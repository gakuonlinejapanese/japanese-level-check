import { getAdminClient, ADMIN_EMAIL } from "./_supabaseAdmin.js";
import { sendEmail } from "./_resend.js";

// api/schedule.js — レッスン予約・ウェイトリスト機能を1ファイルに集約
// (admin-withdrawal.js と同じ理由: Vercel Hobbyプランの12関数制限を超えないため)
//
// ---- 生徒向け（secret不要） ----
// POST { action: "public-availability", fromDate, toDate }
//   → 指定期間の空き/埋まり状況だけを返す（生徒名・理由は非公開）
// POST { action: "submit-waitlist", studentName, studentEmail, planKey, studentTimezone,
//         option1Date, option1Time, option2Date, option2Time, option3Date, option3Time }
//   → ウェイトリストに登録し、先生宛に通知メールを送る
//
// ---- 先生向け（secret必須） ----
// POST { secret, action: "list-waitlist" }
// POST { secret, action: "list-availability", fromDate, toDate }  → label込みで全件返す
// POST { secret, action: "block-slot", date, time, durationMinutes, label }
// POST { secret, action: "unblock-slot", date, time }
// POST { secret, action: "add-official-booking", date, time, durationMinutes, officialStudentId, label }
// POST { secret, action: "confirm-booking", waitlistId, chosenOption (1|2|3), stripeLink }
//   → その希望日時で確定 → teacher_availability に booked 追加 → 生徒にメール
// POST { secret, action: "reject-waitlist", waitlistId }
//   → どの希望も合わなかった場合。生徒に「空き枠なし」メールを送る
// POST { secret, action: "list-official-students" }
// POST { secret, action: "add-official-student", name, email, notes }

function requireAdmin(body) {
  return body.secret && body.secret === process.env.ADMIN_SECRET;
}

// ---------- 生徒向け ----------

async function handlePublicAvailability(supabase, body, res) {
  const { fromDate, toDate } = body;
  if (!fromDate || !toDate) return res.status(400).json({ error: "fromDate and toDate are required" });

  const { data, error } = await supabase
    .from("teacher_availability")
    .select("lesson_date, start_time, duration_minutes, status")
    .gte("lesson_date", fromDate)
    .lte("lesson_date", toDate);
  if (error) return res.status(500).json({ error: error.message });

  // 生徒には status と時間だけ返す（label/生徒名などは一切含めない）
  const slots = (data || []).map((r) => ({
    date: r.lesson_date,
    time: r.start_time,
    durationMinutes: r.duration_minutes,
    status: r.status, // 'booked' or 'blocked' → フロント側で赤表示。それ以外の時間帯は緑（空き）
  }));
  return res.status(200).json({ timezone: "Asia/Tokyo", slots });
}

async function handleSubmitWaitlist(supabase, body, res) {
  const {
    studentName, studentEmail, planKey, studentTimezone,
    option1Date, option1Time, option2Date, option2Time, option3Date, option3Time,
    course, location, levels,
  } = body;

  if (!studentName || !studentEmail || !option1Date || !option1Time) {
    return res.status(400).json({ error: "studentName, studentEmail, option1Date/Time are required" });
  }

  const { data, error } = await supabase
    .from("waitlist_requests")
    .insert({
      student_name: studentName,
      student_email: studentEmail.trim().toLowerCase(),
      plan_key: planKey || null,
      student_timezone: studentTimezone || "Asia/Tokyo",
      option1_date: option1Date, option1_time: option1Time,
      option2_date: option2Date || null, option2_time: option2Time || null,
      option3_date: option3Date || null, option3_time: option3Time || null,
      status: "pending",
      course: course || null,
      student_location: location || null,
      current_levels: Array.isArray(levels) && levels.length ? levels : null,
    })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  // 先生に通知（先生側は常にJSTで確認するので、そのままJSTの日時を載せる）
  try {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `【GAKU】新しい予約待ちリクエスト: ${studentName}`,
      html: `
        <p>${studentName} さん（${studentEmail}）からレッスン予約のウェイトリスト申請がありました。</p>
        <p>First option: ${option1Date} ${option1Time}<br/>
        Second option: ${option2Date || "-"} ${option2Time || ""}<br/>
        Third option: ${option3Date || "-"} ${option3Time || ""}</p>
        <p>管理画面(admin-schedule.html)から確認・確定してください。</p>
      `,
    });
  } catch (e) {
    console.error("Failed to send waitlist notification email:", e.message);
  }

  return res.status(200).json({ ok: true, id: data.id });
}

// ---------- 先生向け ----------

async function handleListWaitlist(supabase, res) {
  const { data, error } = await supabase
    .from("waitlist_requests")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ requests: data || [] });
}

async function handleListAvailability(supabase, body, res) {
  const { fromDate, toDate } = body;
  let query = supabase.from("teacher_availability").select("*").order("lesson_date").order("start_time");
  if (fromDate) query = query.gte("lesson_date", fromDate);
  if (toDate) query = query.lte("lesson_date", toDate);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ slots: data || [] });
}

async function handleBlockSlot(supabase, body, res) {
  const { date, time, durationMinutes, label } = body;
  if (!date || !time) return res.status(400).json({ error: "date and time are required" });
  const { error } = await supabase.from("teacher_availability").upsert(
    { lesson_date: date, start_time: time, duration_minutes: durationMinutes || 60, status: "blocked", label: label || null, source: "manual" },
    { onConflict: "lesson_date,start_time" }
  );
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}

async function handleUnblockSlot(supabase, body, res) {
  const { date, time } = body;
  if (!date || !time) return res.status(400).json({ error: "date and time are required" });
  const { error } = await supabase.from("teacher_availability").delete().eq("lesson_date", date).eq("start_time", time);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}

async function handleAddOfficialBooking(supabase, body, res) {
  const { date, time, durationMinutes, officialStudentId, label } = body;
  if (!date || !time) return res.status(400).json({ error: "date and time are required" });
  const { error } = await supabase.from("teacher_availability").upsert(
    {
      lesson_date: date, start_time: time, duration_minutes: durationMinutes || 60,
      status: "booked", source: "official", official_student_id: officialStudentId || null, label: label || null,
    },
    { onConflict: "lesson_date,start_time" }
  );
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}

async function handleConfirmBooking(supabase, body, res) {
  const { waitlistId, chosenOption, stripeLink } = body;
  if (!waitlistId || ![1, 2, 3].includes(Number(chosenOption))) {
    return res.status(400).json({ error: "waitlistId and chosenOption (1|2|3) are required" });
  }
  const { data: wl, error: findErr } = await supabase.from("waitlist_requests").select("*").eq("id", waitlistId).maybeSingle();
  if (findErr) return res.status(500).json({ error: findErr.message });
  if (!wl) return res.status(404).json({ error: "Waitlist request not found" });

  const date = wl[`option${chosenOption}_date`];
  const time = wl[`option${chosenOption}_time`];
  if (!date || !time) return res.status(400).json({ error: "That option was not provided by the student" });

  const { error: slotErr } = await supabase.from("teacher_availability").insert({
    lesson_date: date, start_time: time, duration_minutes: 60, status: "booked",
    source: "waitlist", waitlist_request_id: waitlistId, label: wl.student_name,
  });
  if (slotErr) return res.status(500).json({ error: slotErr.message });

  const { error: updateErr } = await supabase
    .from("waitlist_requests")
    .update({ status: "confirmed", confirmed_date: date, confirmed_time: time, stripe_link: stripeLink || null, updated_at: new Date().toISOString() })
    .eq("id", waitlistId);
  if (updateErr) return res.status(500).json({ error: updateErr.message });

  try {
    await sendEmail({
      to: wl.student_email,
      subject: "Your GAKU lesson time is confirmed!",
      html: `
        <p>Hi ${wl.student_name},</p>
        <p>Great news — your lesson has been scheduled for <strong>${date} ${time} (Japan Standard Time)</strong>.</p>
        <p>Please complete your payment to secure this slot:</p>
        <p><a href="${stripeLink || "https://www.seitojapanese.online/"}">Complete payment</a></p>
        <p>Thank you!<br/>GAKU Online Japanese</p>
      `,
    });
  } catch (e) {
    console.error("Failed to send confirmation email:", e.message);
  }

  return res.status(200).json({ ok: true, confirmedDate: date, confirmedTime: time });
}

async function handleRejectWaitlist(supabase, body, res) {
  const { waitlistId } = body;
  if (!waitlistId) return res.status(400).json({ error: "waitlistId is required" });
  const { data: wl, error: findErr } = await supabase.from("waitlist_requests").select("*").eq("id", waitlistId).maybeSingle();
  if (findErr) return res.status(500).json({ error: findErr.message });
  if (!wl) return res.status(404).json({ error: "Waitlist request not found" });

  const { error } = await supabase
    .from("waitlist_requests")
    .update({ status: "no_availability", updated_at: new Date().toISOString() })
    .eq("id", waitlistId);
  if (error) return res.status(500).json({ error: error.message });

  try {
    await sendEmail({
      to: wl.student_email,
      subject: "About your GAKU lesson request",
      html: `
        <p>Hi ${wl.student_name},</p>
        <p>Unfortunately, there is no availability to take lessons since lessons have a high demand.</p>
        <p>Please choose one of the app-only payment plans instead: <a href="https://japanese-level-check.vercel.app/app?preview=paywall">View plans</a></p>
        <p>Thank you for your understanding.<br/>GAKU Online Japanese</p>
      `,
    });
  } catch (e) {
    console.error("Failed to send rejection email:", e.message);
  }

  return res.status(200).json({ ok: true });
}

async function handleListOfficialStudents(supabase, res) {
  const { data, error } = await supabase.from("official_students").select("*").order("name");
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ students: data || [] });
}

async function handleAddOfficialStudent(supabase, body, res) {
  const { name, email, notes } = body;
  if (!name || !email) return res.status(400).json({ error: "name and email are required" });
  const { data, error } = await supabase
    .from("official_students")
    .insert({ name, email: email.trim().toLowerCase(), notes: notes || null })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true, student: data });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const supabase = getAdminClient();

  try {
    const body = req.body || {};
    const { action } = body;

    // secret不要（生徒向け・公開）のアクション
    if (action === "public-availability") return await handlePublicAvailability(supabase, body, res);
    if (action === "submit-waitlist") return await handleSubmitWaitlist(supabase, body, res);

    // secret必須（先生向け）のアクション
    if (!requireAdmin(body)) return res.status(401).json({ error: "Unauthorized" });

    if (action === "list-waitlist") return await handleListWaitlist(supabase, res);
    if (action === "list-availability") return await handleListAvailability(supabase, body, res);
    if (action === "block-slot") return await handleBlockSlot(supabase, body, res);
    if (action === "unblock-slot") return await handleUnblockSlot(supabase, body, res);
    if (action === "add-official-booking") return await handleAddOfficialBooking(supabase, body, res);
    if (action === "confirm-booking") return await handleConfirmBooking(supabase, body, res);
    if (action === "reject-waitlist") return await handleRejectWaitlist(supabase, body, res);
    if (action === "list-official-students") return await handleListOfficialStudents(supabase, res);
    if (action === "add-official-student") return await handleAddOfficialStudent(supabase, body, res);

    return res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// api/_absence.js — 長期欠席(1ヶ月以上)の判定と、GAKU Master一時停止の共通処理。
// 先頭が _ のファイルはVercelのサーバーレス関数として数えられない(12関数制限の対象外)。

// 新ルールの適用開始日。欠席期間のカウントはこの日から始める(2026年10月分はノーカウント)。
export const RULE_START_DATE = "2026-11-01";
const countFrom = (d) => (d < RULE_START_DATE ? RULE_START_DATE : d);

// "YYYY-MM-DD" に暦の1ヶ月を足す(31日→翌月末日などは月末に丸める)
export function addOneMonth(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const target = new Date(Date.UTC(y, m, 1)); // 翌月1日
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, lastDay));
  return target.toISOString().slice(0, 10);
}

// このキャンセル/リスケ申請が「1ヶ月以上の欠席」に当たるかを判定する。
// 対象はOfficial Student(official_studentsにいる、または招待コードで無料利用中)で、
// すでに通常の有料プランに入っている人は対象外(すでに支払っているため)。
// 理由は問わない。以下のどちらかに当たれば flagged = true:
//   1) フォームの申告: 復帰予定日(cancel)/希望リスケ日(reschedule)が、キャンセル日の1ヶ月以上先
//   2) すでに欠席: スケジュール上の「直近の過去レッスン」からキャンセル日まで1ヶ月以上空いている
export async function assessLongAbsence(supabase, { email, requestType, cancelDate, returnDate, rescheduleDate }) {
  const result = { applicable: false, flagged: false, reasons: [], lastLessonDate: null };
  const normalizedEmail = (email || "").trim().toLowerCase();
  if (!normalizedEmail || !cancelDate) return result;

  const [{ data: officials }, { data: profile }] = await Promise.all([
    supabase.from("official_students").select("id").eq("email", normalizedEmail),
    supabase.from("profiles").select("is_gaku_student, is_paid").eq("email", normalizedEmail).maybeSingle(),
  ]);
  const officialIds = (officials || []).map((r) => r.id);
  const isOfficial = officialIds.length > 0 || !!profile?.is_gaku_student;
  if (!isOfficial || profile?.is_paid) return result;
  result.applicable = true;

  // 欠席の数え始め: キャンセル日が11月より前なら11月1日から数える(10月分はノーカウント)
  const absenceStart = countFrom(cancelDate);
  const oneMonthAfterStart = addOneMonth(absenceStart);
  const countNote = cancelDate < RULE_START_DATE ? ` (counted from ${RULE_START_DATE}; October is not counted)` : "";
  if (requestType === "cancel" && returnDate && returnDate >= oneMonthAfterStart) {
    result.reasons.push(`Declared absence: canceling on ${cancelDate} and returning on ${returnDate} (1 month or more)${countNote}.`);
  }
  if (requestType === "reschedule" && rescheduleDate && rescheduleDate >= oneMonthAfterStart) {
    result.reasons.push(`Reschedule request: canceling on ${cancelDate} and asking for ${rescheduleDate} (1 month or more away)${countNote}.`);
  }

  if (officialIds.length > 0) {
    const { data: lastRows } = await supabase
      .from("teacher_availability")
      .select("lesson_date")
      .in("official_student_id", officialIds)
      .eq("status", "booked")
      .lt("lesson_date", cancelDate)
      .order("lesson_date", { ascending: false })
      .limit(1);
    const last = lastRows && lastRows[0] ? lastRows[0].lesson_date : null;
    result.lastLessonDate = last;
    if (last && cancelDate >= addOneMonth(countFrom(last))) {
      result.reasons.push(`Already absent: the last lesson on record was ${last}, and ${cancelDate} is 1 month or more after that (counting from ${RULE_START_DATE} at the earliest).`);
    }
  }

  result.flagged = result.reasons.length > 0;
  return result;
}

// ---------- 累積休学月数(Official Students名簿用) ----------
// キャンセルフォームの記録から「丸1ヶ月まるごと休んだ暦月」の数を数える。
// 数え始めは 2026-08-01。月内に戻った欠席は丸1ヶ月に当たらないので自然にノーカウントになる。
export const ABSENCE_COUNT_START = "2026-08-01";
export const ABSENCE_MONTHS_THRESHOLD = 5;

// periods: [{ start: "YYYY-MM-DD", end: "YYYY-MM-DD" }]  end は復帰日(その日は含まない)
// today: "YYYY-MM-DD"(日本時間)
// 戻り値: { confirmed, projected, months }  confirmed=すでに終わった月だけ / projected=予定の月も含む
export function computeAbsenceMonths(periods, today) {
  const clipped = (periods || [])
    .map((p) => ({ start: p.start < ABSENCE_COUNT_START ? ABSENCE_COUNT_START : p.start, end: p.end }))
    .filter((p) => p.start && p.end && p.end > p.start)
    .sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));

  // 重なる・隣り合う期間をまとめる
  const merged = [];
  for (const p of clipped) {
    const last = merged[merged.length - 1];
    if (last && p.start <= last.end) { if (p.end > last.end) last.end = p.end; }
    else merged.push({ ...p });
  }
  if (merged.length === 0) return { confirmed: 0, projected: 0, months: [] };

  const maxEnd = merged[merged.length - 1].end;
  const pad = (n) => String(n).padStart(2, "0");
  let y = 2026, m = 8;
  const months = [];
  let confirmed = 0;
  for (let guard = 0; guard < 120; guard++) {
    const first = `${y}-${pad(m)}-01`;
    if (first >= maxEnd) break;
    const ny = m === 12 ? y + 1 : y, nm = m === 12 ? 1 : m + 1;
    const next = `${ny}-${pad(nm)}-01`;
    if (merged.some((p) => p.start <= first && p.end >= next)) {
      months.push(`${y}-${pad(m)}`);
      if (next <= today) confirmed++;
    }
    y = ny; m = nm;
  }
  return { confirmed, projected: months.length, months };
}

// 名前のゆるい照合用(メールのない古い申請を名簿に結びつける)。英字3文字以上の単語だけ使う。
export function nameTokens(s) {
  return (s || "").toLowerCase().split(/[^a-z]+/).filter((t) => t.length >= 3);
}

export const SUSPEND_EMAIL_SUBJECT = "Your GAKU Master access has been temporarily suspended";

export function suspendEmailHtml(name) {
  return `
    <p>Hi ${name || ""},</p>
    <p>In accordance with our rules, if you are absent from lessons continuously for one month or more, your use of GAKU Master is temporarily suspended.</p>
    <p>If you would like to keep using GAKU Master right away, you can either:</p>
    <ul>
      <li>choose one of our regular payment plans (log in to GAKU Master and pick a plan on the screen that appears), or</li>
      <li>take the three lessons required of Official Students again.</li>
    </ul>
    <p>If you have any questions, please reply to this email.</p>
    <p>GAKU Online Japanese</p>
  `;
}

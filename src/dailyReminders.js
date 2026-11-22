// Daily study reminders for the Android app (added 2026-11-22).
//
// How it works: 5 repeating *local* notifications are scheduled on the phone itself
// (Capacitor Local Notifications). There is no server and no push token, and the times follow
// the phone's own clock, so every student gets them between 8:00 and 23:00 in THEIR local time.
//
// iOS is intentionally not enabled yet (waiting for the App Store review result): everything here
// is a no-op unless the app is running as the Android shell.

const SLOTS = [[8, 0], [11, 45], [15, 30], [19, 15], [23, 0]]; // [hour, minute], local time
const ID_BASE = 9100;                                          // notification ids 9101..9105
const CHANNEL_ID = "daily_study_reminders";

export function isAndroidApp() {
  try {
    const c = window.Capacitor;
    return !!(c && typeof c.getPlatform === "function" && c.getPlatform() === "android");
  } catch { return false; }
}

// Texts per UI language (keys = form.preferredLang). Missing language => English.
// bodies[i] goes with SLOTS[i]: morning, late morning, afternoon, evening, night.
const COPY = {
  English: {
    bodies: [
      "Good morning! Start your day with 5 minutes of Japanese. 🌅",
      "Quick break? Review a few words from your Library. 📚",
      "One small step: do one of today's tasks in GAKU Master. ✨",
      "Keep your streak going — do today's tasks! 🔥",
      "Before bed: 5 minutes of Japanese helps you remember more. 🌙",
    ],
    title: "Daily study reminders",
    desc: "Get 5 gentle reminders a day (between 8:00 and 23:00, your local time). You can turn them off anytime.",
    turnOn: "Turn on reminders", notNow: "Not now",
    on: "Reminders on", off: "Reminders off",
    denied: "Notifications are blocked. Please allow notifications for GAKU Master in your phone's Settings.",
  },
  Japanese: {
    bodies: [
      "おはようございます!1日の始まりに、日本語を5分だけやってみましょう。🌅",
      "ちょっと休憩しませんか?単語帳の単語を少し復習しましょう。📚",
      "小さな一歩を。今日のタスクを1つやってみましょう。✨",
      "連続学習を続けましょう!今日のタスクをやりましょう。🔥",
      "寝る前に日本語を5分。覚えたことが定着しやすくなります。🌙",
    ],
    title: "毎日の勉強リマインダー",
    desc: "1日5回、やさしくお知らせします(あなたの現地時間の8:00〜23:00)。いつでもオフにできます。",
    turnOn: "リマインダーをオンにする", notNow: "今はしない",
    on: "リマインダー オン", off: "リマインダー オフ",
    denied: "通知がブロックされています。スマホの設定で、GAKU Masterの通知を許可してください。",
  },
  Spanish: {
    bodies: [
      "¡Buenos días! Empieza el día con 5 minutos de japonés. 🌅",
      "¿Un descanso? Repasa unas palabras de tu Library. 📚",
      "Un pequeño paso: haz una tarea de hoy en GAKU Master. ✨",
      "¡Mantén tu racha! Haz las tareas de hoy. 🔥",
      "Antes de dormir: 5 minutos de japonés te ayudan a recordar más. 🌙",
    ],
    title: "Recordatorios de estudio diarios",
    desc: "Recibe 5 recordatorios suaves al día (entre las 8:00 y las 23:00, hora local). Puedes desactivarlos cuando quieras.",
    turnOn: "Activar recordatorios", notNow: "Ahora no",
    on: "Recordatorios activados", off: "Recordatorios desactivados",
    denied: "Las notificaciones están bloqueadas. Permite las notificaciones de GAKU Master en los Ajustes del teléfono.",
  },
  French: {
    bodies: [
      "Bonjour ! Commencez la journée avec 5 minutes de japonais. 🌅",
      "Une petite pause ? Révisez quelques mots de votre Library. 📚",
      "Un petit pas : faites une tâche du jour dans GAKU Master. ✨",
      "Gardez votre série ! Faites les tâches du jour. 🔥",
      "Avant de dormir : 5 minutes de japonais aident à mieux retenir. 🌙",
    ],
    title: "Rappels d'étude quotidiens",
    desc: "Recevez 5 rappels discrets par jour (entre 8 h et 23 h, heure locale). Vous pouvez les désactiver à tout moment.",
    turnOn: "Activer les rappels", notNow: "Pas maintenant",
    on: "Rappels activés", off: "Rappels désactivés",
    denied: "Les notifications sont bloquées. Autorisez les notifications de GAKU Master dans les Réglages du téléphone.",
  },
  German: {
    bodies: [
      "Guten Morgen! Starte den Tag mit 5 Minuten Japanisch. 🌅",
      "Kurze Pause? Wiederhole ein paar Wörter aus deiner Library. 📚",
      "Ein kleiner Schritt: Mach heute eine Aufgabe in GAKU Master. ✨",
      "Halte deine Serie am Laufen! Erledige die heutigen Aufgaben. 🔥",
      "Vor dem Schlafen: 5 Minuten Japanisch helfen dir, mehr zu behalten. 🌙",
    ],
    title: "Tägliche Lern-Erinnerungen",
    desc: "Erhalte 5 sanfte Erinnerungen pro Tag (zwischen 8:00 und 23:00 Uhr Ortszeit). Du kannst sie jederzeit ausschalten.",
    turnOn: "Erinnerungen einschalten", notNow: "Jetzt nicht",
    on: "Erinnerungen an", off: "Erinnerungen aus",
    denied: "Benachrichtigungen sind blockiert. Erlaube Benachrichtigungen für GAKU Master in den Einstellungen deines Telefons.",
  },
  "Chinese (Simplified)": {
    bodies: [
      "早上好!用5分钟日语开启新的一天吧。🌅",
      "休息一下?复习几个 Library 里的单词吧。📚",
      "迈出小小一步:在 GAKU Master 完成一个今天的任务。✨",
      "保持连续学习!完成今天的任务吧。🔥",
      "睡前学5分钟日语,能帮你记得更牢。🌙",
    ],
    title: "每日学习提醒",
    desc: "每天5次温和提醒(当地时间 8:00 至 23:00)。你可以随时关闭。",
    turnOn: "开启提醒", notNow: "暂时不用",
    on: "提醒已开启", off: "提醒已关闭",
    denied: "通知已被阻止。请在手机设置中允许 GAKU Master 发送通知。",
  },
  "Chinese (Traditional)": {
    bodies: [
      "早安!用5分鐘日語開啟新的一天吧。🌅",
      "休息一下?複習幾個 Library 裡的單字吧。📚",
      "邁出小小一步:在 GAKU Master 完成一個今天的任務。✨",
      "保持連續學習!完成今天的任務吧。🔥",
      "睡前學5分鐘日語,能幫你記得更牢。🌙",
    ],
    title: "每日學習提醒",
    desc: "每天5次溫和提醒(當地時間 8:00 至 23:00)。你可以隨時關閉。",
    turnOn: "開啟提醒", notNow: "暫時不用",
    on: "提醒已開啟", off: "提醒已關閉",
    denied: "通知已被封鎖。請在手機設定中允許 GAKU Master 傳送通知。",
  },
  Italian: {
    bodies: [
      "Buongiorno! Inizia la giornata con 5 minuti di giapponese. 🌅",
      "Una pausa? Ripassa qualche parola della tua Library. 📚",
      "Un piccolo passo: fai un compito di oggi in GAKU Master. ✨",
      "Mantieni la tua serie! Fai i compiti di oggi. 🔥",
      "Prima di dormire: 5 minuti di giapponese ti aiutano a ricordare di più. 🌙",
    ],
    title: "Promemoria di studio giornalieri",
    desc: "Ricevi 5 promemoria discreti al giorno (tra le 8:00 e le 23:00, ora locale). Puoi disattivarli in qualsiasi momento.",
    turnOn: "Attiva i promemoria", notNow: "Non ora",
    on: "Promemoria attivi", off: "Promemoria disattivati",
    denied: "Le notifiche sono bloccate. Consenti le notifiche di GAKU Master nelle Impostazioni del telefono.",
  },
  Korean: {
    bodies: [
      "좋은 아침이에요! 일본어 5분으로 하루를 시작해 보세요. 🌅",
      "잠깐 쉬어 볼까요? Library의 단어를 몇 개 복습해 보세요. 📚",
      "작은 한 걸음: GAKU Master에서 오늘의 과제를 하나 해 보세요. ✨",
      "연속 학습을 이어 가세요! 오늘의 과제를 해 보세요. 🔥",
      "자기 전 일본어 5분이 기억에 도움이 돼요. 🌙",
    ],
    title: "매일 학습 알림",
    desc: "하루 5번 부드럽게 알려 드려요(현지 시간 8:00~23:00). 언제든지 끌 수 있어요.",
    turnOn: "알림 켜기", notNow: "나중에",
    on: "알림 켜짐", off: "알림 꺼짐",
    denied: "알림이 차단되어 있어요. 휴대폰 설정에서 GAKU Master의 알림을 허용해 주세요.",
  },
  Thai: {
    bodies: [
      "อรุณสวัสดิ์! เริ่มวันด้วยภาษาญี่ปุ่น 5 นาทีกันเถอะ 🌅",
      "พักสักหน่อยไหม? ทบทวนคำศัพท์ใน Library สักสองสามคำ 📚",
      "ก้าวเล็ก ๆ: ลองทำงานของวันนี้สักหนึ่งอย่างใน GAKU Master ✨",
      "รักษาสถิติการเรียนต่อเนื่องไว้! ทำงานของวันนี้กันเถอะ 🔥",
      "ก่อนนอน ภาษาญี่ปุ่น 5 นาทีช่วยให้จำได้ดีขึ้น 🌙",
    ],
    title: "การเตือนเรียนรายวัน",
    desc: "รับการเตือนเบา ๆ วันละ 5 ครั้ง (ระหว่าง 8:00–23:00 ตามเวลาท้องถิ่น) ปิดได้ทุกเมื่อ",
    turnOn: "เปิดการเตือน", notNow: "ไว้ก่อน",
    on: "เปิดการเตือนอยู่", off: "ปิดการเตือนอยู่",
    denied: "การแจ้งเตือนถูกบล็อกอยู่ กรุณาอนุญาตการแจ้งเตือนของ GAKU Master ในการตั้งค่าของโทรศัพท์",
  },
  Malay: {
    bodies: [
      "Selamat pagi! Mulakan hari anda dengan 5 minit bahasa Jepun. 🌅",
      "Rehat sebentar? Ulang kaji beberapa perkataan dalam Library anda. 📚",
      "Satu langkah kecil: cuba satu tugasan hari ini dalam GAKU Master. ✨",
      "Teruskan rentetan belajar anda! Lakukan tugasan hari ini. 🔥",
      "Sebelum tidur: 5 minit bahasa Jepun membantu anda ingat lebih lama. 🌙",
    ],
    title: "Peringatan belajar harian",
    desc: "Dapatkan 5 peringatan lembut sehari (antara 8:00 dan 23:00, waktu tempatan). Anda boleh mematikannya pada bila-bila masa.",
    turnOn: "Hidupkan peringatan", notNow: "Bukan sekarang",
    on: "Peringatan dihidupkan", off: "Peringatan dimatikan",
    denied: "Pemberitahuan disekat. Sila benarkan pemberitahuan GAKU Master dalam Tetapan telefon anda.",
  },
  Indonesian: {
    bodies: [
      "Selamat pagi! Mulai hari dengan 5 menit bahasa Jepang. 🌅",
      "Istirahat sebentar? Ulangi beberapa kata di Library-mu. 📚",
      "Satu langkah kecil: kerjakan satu tugas hari ini di GAKU Master. ✨",
      "Pertahankan rentetan belajarmu! Kerjakan tugas hari ini. 🔥",
      "Sebelum tidur: 5 menit bahasa Jepang membantumu mengingat lebih baik. 🌙",
    ],
    title: "Pengingat belajar harian",
    desc: "Dapatkan 5 pengingat lembut per hari (antara pukul 8:00 dan 23:00, waktu setempat). Kamu bisa mematikannya kapan saja.",
    turnOn: "Aktifkan pengingat", notNow: "Nanti saja",
    on: "Pengingat aktif", off: "Pengingat nonaktif",
    denied: "Notifikasi diblokir. Izinkan notifikasi GAKU Master di Pengaturan ponselmu.",
  },
  Vietnamese: {
    bodies: [
      "Chào buổi sáng! Bắt đầu ngày mới với 5 phút tiếng Nhật nhé. 🌅",
      "Nghỉ một chút nhé? Ôn vài từ trong Library của bạn. 📚",
      "Một bước nhỏ: làm một nhiệm vụ hôm nay trong GAKU Master. ✨",
      "Giữ chuỗi ngày học của bạn nhé! Làm các nhiệm vụ hôm nay. 🔥",
      "Trước khi ngủ: 5 phút tiếng Nhật giúp bạn nhớ lâu hơn. 🌙",
    ],
    title: "Nhắc học hằng ngày",
    desc: "Nhận 5 lời nhắc nhẹ nhàng mỗi ngày (từ 8:00 đến 23:00, giờ địa phương). Bạn có thể tắt bất cứ lúc nào.",
    turnOn: "Bật lời nhắc", notNow: "Để sau",
    on: "Đang bật lời nhắc", off: "Đang tắt lời nhắc",
    denied: "Thông báo đang bị chặn. Hãy cho phép thông báo của GAKU Master trong Cài đặt điện thoại.",
  },
  Hindi: {
    bodies: [
      "सुप्रभात! दिन की शुरुआत 5 मिनट जापानी से करें। 🌅",
      "थोड़ा ब्रेक लें? अपनी Library के कुछ शब्द दोहराएँ। 📚",
      "एक छोटा कदम: GAKU Master में आज का एक काम करें। ✨",
      "अपनी लगातार पढ़ाई बनाए रखें! आज के काम पूरे करें। 🔥",
      "सोने से पहले 5 मिनट जापानी याद रखने में मदद करती है। 🌙",
    ],
    title: "रोज़ की पढ़ाई के रिमाइंडर",
    desc: "दिन में 5 बार हल्के रिमाइंडर पाएँ (स्थानीय समय के अनुसार सुबह 8:00 से रात 23:00 के बीच)। आप इन्हें कभी भी बंद कर सकते हैं।",
    turnOn: "रिमाइंडर चालू करें", notNow: "अभी नहीं",
    on: "रिमाइंडर चालू", off: "रिमाइंडर बंद",
    denied: "सूचनाएँ ब्लॉक हैं। कृपया फ़ोन की सेटिंग में GAKU Master की सूचनाओं की अनुमति दें।",
  },
  Turkish: {
    bodies: [
      "Günaydın! Güne 5 dakikalık Japonca ile başla. 🌅",
      "Kısa bir mola mı? Library'ndeki birkaç kelimeyi tekrar et. 📚",
      "Küçük bir adım: GAKU Master'da bugünün görevlerinden birini yap. ✨",
      "Serini sürdür! Bugünün görevlerini yap. 🔥",
      "Yatmadan önce 5 dakikalık Japonca daha iyi hatırlamana yardımcı olur. 🌙",
    ],
    title: "Günlük çalışma hatırlatmaları",
    desc: "Günde 5 nazik hatırlatma al (yerel saatle 8:00 ile 23:00 arasında). İstediğin zaman kapatabilirsin.",
    turnOn: "Hatırlatmaları aç", notNow: "Şimdi değil",
    on: "Hatırlatmalar açık", off: "Hatırlatmalar kapalı",
    denied: "Bildirimler engellenmiş. Lütfen telefonunun Ayarlar bölümünden GAKU Master bildirimlerine izin ver.",
  },
  Nepali: {
    bodies: [
      "शुभ प्रभात! दिनको सुरुवात ५ मिनेट जापानीजबाट गर्नुहोस्। 🌅",
      "अलिकति विश्राम? आफ्नो Library का केही शब्द दोहोर्‍याउनुहोस्। 📚",
      "सानो कदम: GAKU Master मा आजको एउटा काम गर्नुहोस्। ✨",
      "लगातार पढाइ जारी राख्नुहोस्! आजका कामहरू गर्नुहोस्। 🔥",
      "सुत्नुअघि ५ मिनेट जापानीजले सम्झन धेरै मद्दत गर्छ। 🌙",
    ],
    title: "दैनिक अध्ययन रिमाइन्डर",
    desc: "दिनमा ५ पटक नरम रिमाइन्डर पाउनुहोस् (स्थानीय समय बिहान ८:०० देखि राति २३:०० सम्म)। तपाईं जुनसुकै बेला बन्द गर्न सक्नुहुन्छ।",
    turnOn: "रिमाइन्डर खोल्नुहोस्", notNow: "अहिले होइन",
    on: "रिमाइन्डर खुला", off: "रिमाइन्डर बन्द",
    denied: "सूचनाहरू ब्लक गरिएका छन्। कृपया फोनको सेटिङमा GAKU Master का सूचनाहरूलाई अनुमति दिनुहोस्।",
  },
  Filipino: {
    bodies: [
      "Magandang umaga! Simulan ang araw sa 5 minuto ng Hapon. 🌅",
      "Pahinga muna? Balikan ang ilang salita sa Library mo. 📚",
      "Isang maliit na hakbang: gawin ang isang gawain ngayong araw sa GAKU Master. ✨",
      "Ipagpatuloy ang streak mo! Gawin ang mga gawain ngayong araw. 🔥",
      "Bago matulog: nakakatulong ang 5 minuto ng Hapon para mas matandaan mo. 🌙",
    ],
    title: "Pang-araw-araw na paalala sa pag-aaral",
    desc: "Makatanggap ng 5 banayad na paalala bawat araw (sa pagitan ng 8:00 at 23:00, lokal na oras). Maaari mo itong patayin anumang oras.",
    turnOn: "I-on ang mga paalala", notNow: "Hindi muna",
    on: "Naka-on ang mga paalala", off: "Naka-off ang mga paalala",
    denied: "Naka-block ang mga notification. Mangyaring payagan ang mga notification ng GAKU Master sa Settings ng telepono mo.",
  },
  Portuguese: {
    bodies: [
      "Bom dia! Comece o dia com 5 minutos de japonês. 🌅",
      "Uma pausa? Revise algumas palavras da sua Library. 📚",
      "Um pequeno passo: faça uma tarefa de hoje no GAKU Master. ✨",
      "Mantenha sua sequência! Faça as tarefas de hoje. 🔥",
      "Antes de dormir: 5 minutos de japonês ajudam você a lembrar mais. 🌙",
    ],
    title: "Lembretes diários de estudo",
    desc: "Receba 5 lembretes suaves por dia (entre 8:00 e 23:00, horário local). Você pode desativá-los a qualquer momento.",
    turnOn: "Ativar lembretes", notNow: "Agora não",
    on: "Lembretes ativados", off: "Lembretes desativados",
    denied: "As notificações estão bloqueadas. Permita as notificações do GAKU Master nas Configurações do celular.",
  },
};

export function reminderCopy(lang) {
  return COPY[lang] || COPY.English;
}

async function plugin() {
  const mod = await import("@capacitor/local-notifications");
  return mod.LocalNotifications;
}

// Asks for permission if needed, then (re)schedules the 5 daily notifications in the student's
// language. Returns "granted" | "denied" | "unsupported" | "error". Safe to call repeatedly.
export async function scheduleDailyReminders(lang) {
  if (!isAndroidApp()) return "unsupported";
  try {
    const LN = await plugin();
    let perm = await LN.checkPermissions();
    if (perm.display !== "granted") perm = await LN.requestPermissions();
    if (perm.display !== "granted") return "denied";
    try {
      await LN.createChannel({
        id: CHANNEL_ID, name: "Daily study reminders",
        description: "Gentle reminders to study Japanese with GAKU Master",
        importance: 3, visibility: 1,
      });
    } catch {}
    const ids = SLOTS.map((_, i) => ({ id: ID_BASE + 1 + i }));
    try { await LN.cancel({ notifications: ids }); } catch {}
    const bodies = reminderCopy(lang).bodies;
    await LN.schedule({
      notifications: SLOTS.map(([hour, minute], i) => ({
        id: ID_BASE + 1 + i,
        title: "GAKU Master",
        body: bodies[i],
        channelId: CHANNEL_ID,
        smallIcon: "ic_stat_gaku",
        // Not an "exact" alarm: exact alarms need a special permission that Google Play restricts,
        // and without this flag the plugin would open a system settings screen to ask for it.
        // A few minutes of drift is fine for a study reminder.
        isExactNotification: false,
        schedule: { on: { hour, minute }, allowWhileIdle: true },
      })),
    });
    return "granted";
  } catch (e) {
    try { console.warn("[reminders] schedule failed", e); } catch {}
    return "error";
  }
}

export async function cancelDailyReminders() {
  if (!isAndroidApp()) return;
  try {
    const LN = await plugin();
    await LN.cancel({ notifications: SLOTS.map((_, i) => ({ id: ID_BASE + 1 + i })) });
  } catch {}
}

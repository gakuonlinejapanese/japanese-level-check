// Translations of the on-screen "How to use" guide (GuideCoach). English and Japanese live in GakuApp.jsx (EASY_GUIDES / EASY_LABELS);
// every other UI language is here. Missing language or key => English.
//
// GUIDE_KEYS maps each English guide sentence to a short key. Tokens inside a translation are replaced with the
// real (already translated) on-screen button names, shown in quotes:
//   {fc} From Content tab   {conv} Conversation tab   {pron} Pronunciation tab   {wr} Writing tab
//   {copy} "Copying down" button   {q} "Questions" button
export const GUIDE_KEYS = {
  "Tap here.": "tap",
  "Tap “From Content”.": "tapFc",
  "A sample text is ready. Or paste your own.": "sample",
  "Tap this big button.": "big",
  "Answer the questions. Great job! 🎉": "great",
  "Do today's task. Tap here when you finish.": "task",
  "Type one word here.": "typeWord",
  "Tap here to search.": "search",
  "Tap the word.": "tapWord",
  "Tap here. Saved! 🎉": "saved",
  "① PASTE HERE. Put the Japanese text you want to study in this box. (A sample is already inside.)": "pasteFc",
  "② Then tap this big button.": "thenBig",
  "Tap “Conversation”.": "tapConv",
  "① Easiest: tap here to listen to a video tab. (Not shown on this device? Tap Next.)": "listenTab",
  "② RECORD HERE. Tap this microphone button, then play a Japanese video or talk. There is no box to paste into.": "record",
  "③ When a line appears, tap here to see how to answer.": "hint",
  "Tap “Pronunciation”.": "tapPron",
  "② Tap this button, then play a Japanese video or talk. There is no box to paste into.": "pronBtn",
  "③ When a line appears, tap here and say it out loud after the video.": "pronRec",
  "Tap “Writing”.": "tapWr",
  "You are in “Copying down”. You copy a Japanese sentence by hand.": "inCopy1",
  "Tap “Copying down”. (You copy a Japanese sentence by hand.)": "tapCopy1",
  "① PASTE A JAPANESE SENTENCE HERE. Put a short Japanese sentence in this box.": "pasteSent",
  "② OR use your own words. The words you saved in Vocabulary can be used too. Tap here to open them.": "orWords",
  "③ Pick the folder where you saved your words.": "folder",
  "④ Tap the words you want to practice. A ☑ means chosen.": "words",
  "⑤ Tap this button. Your words go into the box.": "useBtn",
  "⑥ Your words are now in this box. You can still change them.": "nowBox",
  "⑦ Tap here. Then draw each letter with your finger!": "startDraw",
  "You are in “Questions”. Paste a question, write your answer in Japanese, and GAKU checks it. (Tap “Copying down” to copy a sentence by hand instead.)": "inQ",
  "You are in “Copying down”: copy a sentence by hand. (Tap “Questions” to answer a question instead.)": "inCopy2",
  "Pick a style. “Copying down” = copy a sentence by hand. “Questions” = write an answer.": "pickStyle",
  "① PASTE HERE. Put a short Japanese sentence in this box.": "pasteHere",
  "① PASTE THE QUESTION HERE. Put a question from a test or website in this box.": "pasteQ",
  "② Tap here. Then draw with your finger!": "draw",
  "② TYPE YOUR ANSWER HERE, in Japanese.": "typeAns",
  "③ Tap here. GAKU checks your answer against the question.": "check",
  "You are here. Start from the top of this frame and go down.": "generic",
  "Use the box inside this frame to paste subtitles, then follow the buttons.": "subtitles",
  "Your progress checks are in this frame. Tap a card to open it.": "milestones",
  "Your JLPT results are in this frame.": "jlpt",
  "Write your message in this frame and send it.": "feedback",
  "Tap a link in this frame to open a study site.": "links",
  "Search a word in this frame, then tap the word to make a card.": "wordcards",
  "Your saved cards are in this frame. Tap a folder to open it.": "library",
  "The cards in this folder are in this frame. Tap a card to see it.": "folderPg",
  "Flashcards are in this frame. Tap the card to flip it.": "flash",
  "Want to review with flashcards? Tap “Go Flashcard” to start the Flashcards activity.": "goFlash",
  "Pick how you want to practice in this frame.": "pickWriting",
  // titles (feature names such as From Content / Conversation Practice stay in English)
  "Your first minute": "tFirst",
  "Schedule": "tSchedule",
  "Vocabulary": "tVocab",
  "This page": "tPage",
  "Subtitles": "tSubtitles",
  "Milestones": "tMilestones",
  "Feedback": "tFeedback",
  "Links": "tLinks",
  "Word Cards": "tWordCards",
  "Library": "tLibrary",
  "Folder": "tFolder",
  "Flashcards": "tFlash",
};

const GUIDE_I18N = {
 "Spanish": {
  labels: { next:"Siguiente ▶", done:"Listo 🎉", close:"Cerrar", show:"Mira cómo (1 min)", missing:"¿No lo ves aquí? Toca Siguiente.", pick:"Elige uno. Te llevo allí y te muestro dónde tocar." },
  s: {
   tap:"Toca aquí.", tapFc:"Toca {fc}.", sample:"Ya hay un texto de ejemplo. O pega el tuyo.", big:"Toca este botón grande.", great:"Responde las preguntas. ¡Muy bien! 🎉",
   task:"Haz la tarea de hoy. Toca aquí cuando termines.", typeWord:"Escribe una palabra aquí.", search:"Toca aquí para buscar.", tapWord:"Toca la palabra.", saved:"Toca aquí. ¡Guardada! 🎉",
   pasteFc:"① PEGA AQUÍ. Pon en esta caja el texto en japonés que quieres estudiar. (Ya hay un ejemplo dentro.)", thenBig:"② Luego toca este botón grande.",
   tapConv:"Toca {conv}.", listenTab:"① Lo más fácil: toca aquí para escuchar una pestaña con video. (¿No aparece en este dispositivo? Toca Siguiente.)",
   record:"② GRABA AQUÍ. Toca este botón de micrófono y reproduce un video en japonés o habla. Aquí no hay caja para pegar.", hint:"③ Cuando aparezca una frase, toca aquí para ver cómo responder.",
   tapPron:"Toca {pron}.", pronBtn:"② Toca este botón y reproduce un video en japonés o habla. Aquí no hay caja para pegar.", pronRec:"③ Cuando aparezca una frase, toca aquí y dila en voz alta después del video.",
   tapWr:"Toca {wr}.", inCopy1:"Estás en {copy}. Copias a mano una frase en japonés.", tapCopy1:"Toca {copy}. (Copias a mano una frase en japonés.)",
   pasteSent:"① PEGA AQUÍ UNA FRASE EN JAPONÉS. Pon una frase corta en japonés en esta caja.", orWords:"② O usa tus propias palabras. Las palabras que guardaste en Vocabulary también sirven. Toca aquí para abrirlas.",
   folder:"③ Elige la carpeta donde guardaste tus palabras.", words:"④ Toca las palabras que quieres practicar. ☑ significa elegida.", useBtn:"⑤ Toca este botón. Tus palabras pasan a la caja.",
   nowBox:"⑥ Tus palabras ya están en esta caja. Todavía puedes cambiarlas.", startDraw:"⑦ Toca aquí. ¡Luego dibuja cada letra con el dedo!",
   inQ:"Estás en {q}. Pega una pregunta, escribe tu respuesta en japonés y GAKU la revisa. (Toca {copy} para copiar una frase a mano.)",
   inCopy2:"Estás en {copy}: copia una frase a mano. (Toca {q} para responder una pregunta.)", pickStyle:"Elige un estilo. {copy} = copiar una frase a mano. {q} = escribir una respuesta.",
   pasteHere:"① PEGA AQUÍ. Pon una frase corta en japonés en esta caja.", pasteQ:"① PEGA AQUÍ LA PREGUNTA. Pon en esta caja una pregunta de un examen o de un sitio web.",
   draw:"② Toca aquí. ¡Luego dibuja con el dedo!", typeAns:"② ESCRIBE AQUÍ TU RESPUESTA, en japonés.", check:"③ Toca aquí. GAKU revisa tu respuesta según la pregunta.",
   generic:"Estás aquí. Empieza por arriba de este recuadro y ve hacia abajo.", subtitles:"Usa la caja de este recuadro para pegar subtítulos y sigue los botones.",
   milestones:"Tus revisiones de progreso están en este recuadro. Toca una tarjeta para abrirla.", jlpt:"Tus resultados del JLPT están en este recuadro.", feedback:"Escribe tu mensaje en este recuadro y envíalo.",
   links:"Toca un enlace de este recuadro para abrir un sitio de estudio.", wordcards:"Busca una palabra en este recuadro y tócala para crear una tarjeta.",
   library:"Tus tarjetas guardadas están en este recuadro. Toca una carpeta para abrirla.", folderPg:"Las tarjetas de esta carpeta están en este recuadro. Toca una para verla.",
   flash:"Las tarjetas de estudio están en este recuadro. Toca la tarjeta para darle la vuelta.", pickWriting:"Elige cómo quieres practicar en este recuadro.",
   goFlash:"¿Quieres repasar con tarjetas de estudio? Toca “Go Flashcard” para empezar la actividad de Flashcards.",
   tFirst:"Tu primer minuto", tSchedule:"Horario", tVocab:"Vocabulario", tPage:"Esta página", tSubtitles:"Subtítulos", tMilestones:"Hitos", tFeedback:"Comentarios", tLinks:"Enlaces", tWordCards:"Tarjetas de palabras", tLibrary:"Biblioteca", tFolder:"Carpeta", tFlash:"Tarjetas de estudio"
  }
 },
 "French": {
  labels: { next:"Suivant ▶", done:"Terminé 🎉", close:"Fermer", show:"Voir comment (1 min)", missing:"Tu ne le vois pas ici ? Touche Suivant.", pick:"Choisis-en un. Je t'y emmène et je te montre où toucher." },
  s: {
   tap:"Touche ici.", tapFc:"Touche {fc}.", sample:"Un texte d'exemple est prêt. Ou colle le tien.", big:"Touche ce grand bouton.", great:"Réponds aux questions. Bravo ! 🎉",
   task:"Fais la tâche du jour. Touche ici quand tu as fini.", typeWord:"Écris un mot ici.", search:"Touche ici pour chercher.", tapWord:"Touche le mot.", saved:"Touche ici. Enregistré ! 🎉",
   pasteFc:"① COLLE ICI. Mets dans cette zone le texte japonais que tu veux étudier. (Un exemple s'y trouve déjà.)", thenBig:"② Puis touche ce grand bouton.",
   tapConv:"Touche {conv}.", listenTab:"① Le plus simple : touche ici pour écouter un onglet vidéo. (Absent sur cet appareil ? Touche Suivant.)",
   record:"② ENREGISTRE ICI. Touche ce bouton micro, puis lance une vidéo en japonais ou parle. Il n'y a pas de zone où coller.", hint:"③ Quand une phrase apparaît, touche ici pour voir comment répondre.",
   tapPron:"Touche {pron}.", pronBtn:"② Touche ce bouton, puis lance une vidéo en japonais ou parle. Il n'y a pas de zone où coller.", pronRec:"③ Quand une phrase apparaît, touche ici et dis-la à voix haute après la vidéo.",
   tapWr:"Touche {wr}.", inCopy1:"Tu es dans {copy}. Tu recopies une phrase japonaise à la main.", tapCopy1:"Touche {copy}. (Tu recopies une phrase japonaise à la main.)",
   pasteSent:"① COLLE ICI UNE PHRASE JAPONAISE. Mets une courte phrase japonaise dans cette zone.", orWords:"② OU utilise tes propres mots. Les mots enregistrés dans Vocabulary marchent aussi. Touche ici pour les ouvrir.",
   folder:"③ Choisis le dossier où tu as enregistré tes mots.", words:"④ Touche les mots que tu veux travailler. ☑ veut dire choisi.", useBtn:"⑤ Touche ce bouton. Tes mots vont dans la zone.",
   nowBox:"⑥ Tes mots sont maintenant dans cette zone. Tu peux encore les modifier.", startDraw:"⑦ Touche ici. Puis dessine chaque lettre avec ton doigt !",
   inQ:"Tu es dans {q}. Colle une question, écris ta réponse en japonais et GAKU la corrige. (Touche {copy} pour recopier une phrase à la main.)",
   inCopy2:"Tu es dans {copy} : recopie une phrase à la main. (Touche {q} pour répondre à une question.)", pickStyle:"Choisis un style. {copy} = recopier une phrase à la main. {q} = écrire une réponse.",
   pasteHere:"① COLLE ICI. Mets une courte phrase japonaise dans cette zone.", pasteQ:"① COLLE ICI LA QUESTION. Mets dans cette zone une question d'un test ou d'un site web.",
   draw:"② Touche ici. Puis dessine avec ton doigt !", typeAns:"② ÉCRIS ICI TA RÉPONSE, en japonais.", check:"③ Touche ici. GAKU vérifie ta réponse par rapport à la question.",
   generic:"Tu es ici. Commence en haut de ce cadre et descends.", subtitles:"Utilise la zone de ce cadre pour coller des sous-titres, puis suis les boutons.",
   milestones:"Tes bilans de progression sont dans ce cadre. Touche une carte pour l'ouvrir.", jlpt:"Tes résultats JLPT sont dans ce cadre.", feedback:"Écris ton message dans ce cadre et envoie-le.",
   links:"Touche un lien dans ce cadre pour ouvrir un site d'étude.", wordcards:"Cherche un mot dans ce cadre, puis touche-le pour créer une carte.",
   library:"Tes cartes enregistrées sont dans ce cadre. Touche un dossier pour l'ouvrir.", folderPg:"Les cartes de ce dossier sont dans ce cadre. Touche une carte pour la voir.",
   flash:"Les cartes mémoire sont dans ce cadre. Touche la carte pour la retourner.", pickWriting:"Choisis comment t'entraîner dans ce cadre.",
   goFlash:"Tu veux réviser avec des cartes mémoire ? Touche « Go Flashcard » pour lancer l'activité Flashcards.",
   tFirst:"Ta première minute", tSchedule:"Planning", tVocab:"Vocabulaire", tPage:"Cette page", tSubtitles:"Sous-titres", tMilestones:"Étapes", tFeedback:"Avis", tLinks:"Liens", tWordCards:"Cartes de mots", tLibrary:"Bibliothèque", tFolder:"Dossier", tFlash:"Cartes mémoire"
  }
 },
 "German": {
  labels: { next:"Weiter ▶", done:"Fertig 🎉", close:"Schließen", show:"So geht's (1 Min.)", missing:"Hier nicht zu sehen? Tippe auf Weiter.", pick:"Wähle eins. Ich bringe dich hin und zeige dir, wo du tippen musst." },
  s: {
   tap:"Tippe hier.", tapFc:"Tippe auf {fc}.", sample:"Ein Beispieltext ist bereit. Oder füge deinen eigenen ein.", big:"Tippe auf diesen großen Button.", great:"Beantworte die Fragen. Super gemacht! 🎉",
   task:"Erledige die heutige Aufgabe. Tippe hier, wenn du fertig bist.", typeWord:"Tippe hier ein Wort ein.", search:"Tippe hier, um zu suchen.", tapWord:"Tippe auf das Wort.", saved:"Tippe hier. Gespeichert! 🎉",
   pasteFc:"① HIER EINFÜGEN. Füge den japanischen Text, den du lernen möchtest, in dieses Feld ein. (Ein Beispiel steht schon drin.)", thenBig:"② Tippe dann auf diesen großen Button.",
   tapConv:"Tippe auf {conv}.", listenTab:"① Am einfachsten: Tippe hier, um einem Video-Tab zuzuhören. (Auf diesem Gerät nicht sichtbar? Tippe auf Weiter.)",
   record:"② HIER AUFNEHMEN. Tippe auf diesen Mikrofon-Button und spiele dann ein japanisches Video ab oder sprich. Hier gibt es kein Feld zum Einfügen.", hint:"③ Wenn ein Satz erscheint, tippe hier, um zu sehen, wie du antworten kannst.",
   tapPron:"Tippe auf {pron}.", pronBtn:"② Tippe auf diesen Button und spiele dann ein japanisches Video ab oder sprich. Hier gibt es kein Feld zum Einfügen.", pronRec:"③ Wenn ein Satz erscheint, tippe hier und sprich ihn nach dem Video laut nach.",
   tapWr:"Tippe auf {wr}.", inCopy1:"Du bist bei {copy}. Du schreibst einen japanischen Satz von Hand ab.", tapCopy1:"Tippe auf {copy}. (Du schreibst einen japanischen Satz von Hand ab.)",
   pasteSent:"① HIER EINEN JAPANISCHEN SATZ EINFÜGEN. Füge einen kurzen japanischen Satz in dieses Feld ein.", orWords:"② ODER nutze deine eigenen Wörter. Auch Wörter, die du in Vocabulary gespeichert hast, funktionieren. Tippe hier, um sie zu öffnen.",
   folder:"③ Wähle den Ordner, in dem du deine Wörter gespeichert hast.", words:"④ Tippe auf die Wörter, die du üben möchtest. ☑ bedeutet ausgewählt.", useBtn:"⑤ Tippe auf diesen Button. Deine Wörter kommen ins Feld.",
   nowBox:"⑥ Deine Wörter stehen jetzt in diesem Feld. Du kannst sie noch ändern.", startDraw:"⑦ Tippe hier. Zeichne dann jedes Zeichen mit dem Finger!",
   inQ:"Du bist bei {q}. Füge eine Frage ein, schreibe deine Antwort auf Japanisch, und GAKU prüft sie. (Tippe auf {copy}, um stattdessen einen Satz abzuschreiben.)",
   inCopy2:"Du bist bei {copy}: Schreibe einen Satz von Hand ab. (Tippe auf {q}, um stattdessen eine Frage zu beantworten.)", pickStyle:"Wähle eine Art. {copy} = einen Satz von Hand abschreiben. {q} = eine Antwort schreiben.",
   pasteHere:"① HIER EINFÜGEN. Füge einen kurzen japanischen Satz in dieses Feld ein.", pasteQ:"① HIER DIE FRAGE EINFÜGEN. Füge eine Frage aus einem Test oder von einer Website in dieses Feld ein.",
   draw:"② Tippe hier. Zeichne dann mit dem Finger!", typeAns:"② SCHREIBE HIER DEINE ANTWORT, auf Japanisch.", check:"③ Tippe hier. GAKU prüft deine Antwort anhand der Frage.",
   generic:"Hier bist du. Fang oben in diesem Rahmen an und gehe nach unten.", subtitles:"Füge im Feld in diesem Rahmen Untertitel ein und folge dann den Buttons.",
   milestones:"Deine Fortschrittschecks sind in diesem Rahmen. Tippe auf eine Karte, um sie zu öffnen.", jlpt:"Deine JLPT-Ergebnisse sind in diesem Rahmen.", feedback:"Schreibe deine Nachricht in diesem Rahmen und sende sie ab.",
   links:"Tippe in diesem Rahmen auf einen Link, um eine Lernseite zu öffnen.", wordcards:"Suche in diesem Rahmen ein Wort und tippe darauf, um eine Karte zu erstellen.",
   library:"Deine gespeicherten Karten sind in diesem Rahmen. Tippe auf einen Ordner, um ihn zu öffnen.", folderPg:"Die Karten dieses Ordners sind in diesem Rahmen. Tippe auf eine Karte, um sie zu sehen.",
   flash:"Die Lernkarten sind in diesem Rahmen. Tippe auf die Karte, um sie umzudrehen.", pickWriting:"Wähle in diesem Rahmen, wie du üben möchtest.",
   goFlash:"Du möchtest mit Lernkarten wiederholen? Tippe auf „Go Flashcard“, um die Flashcards-Aktivität zu starten.",
   tFirst:"Deine erste Minute", tSchedule:"Zeitplan", tVocab:"Vokabeln", tPage:"Diese Seite", tSubtitles:"Untertitel", tMilestones:"Meilensteine", tFeedback:"Feedback", tLinks:"Links", tWordCards:"Wortkarten", tLibrary:"Bibliothek", tFolder:"Ordner", tFlash:"Lernkarten"
  }
 },
 "Chinese (Simplified)": {
  labels: { next:"下一步 ▶", done:"完成 🎉", close:"关闭", show:"看看怎么用（1分钟）", missing:"这里看不到吗？点“下一步”。", pick:"选一个。我会带你过去，并告诉你点哪里。" },
  s: {
   tap:"点这里。", tapFc:"点 {fc}。", sample:"已经准备好示例文本。也可以粘贴你自己的。", big:"点这个大按钮。", great:"回答问题。做得好！🎉",
   task:"完成今天的任务。做完后点这里。", typeWord:"在这里输入一个单词。", search:"点这里搜索。", tapWord:"点这个单词。", saved:"点这里。已保存！🎉",
   pasteFc:"① 粘贴到这里。把你想学习的日语文本放进这个框里。（里面已有示例。）", thenBig:"② 然后点这个大按钮。",
   tapConv:"点 {conv}。", listenTab:"① 最简单：点这里收听视频标签页的声音。（这台设备上没有显示？点“下一步”。）",
   record:"② 在这里录音。点这个麦克风按钮，然后播放日语视频或直接说话。这里没有可粘贴的框。", hint:"③ 出现句子后，点这里查看怎么回答。",
   tapPron:"点 {pron}。", pronBtn:"② 点这个按钮，然后播放日语视频或直接说话。这里没有可粘贴的框。", pronRec:"③ 出现句子后，点这里，看完视频后大声读出来。",
   tapWr:"点 {wr}。", inCopy1:"你现在在 {copy}。你要亲手抄写一句日语。", tapCopy1:"点 {copy}。（亲手抄写一句日语。）",
   pasteSent:"① 在这里粘贴一句日语。把一句简短的日语放进这个框里。", orWords:"② 或者用你自己的单词。你在 Vocabulary 里保存的单词也可以用。点这里打开。",
   folder:"③ 选择你保存单词的文件夹。", words:"④ 点你想练习的单词。☑ 表示已选中。", useBtn:"⑤ 点这个按钮。你的单词会放进框里。",
   nowBox:"⑥ 你的单词现在在这个框里了。还可以修改。", startDraw:"⑦ 点这里。然后用手指一笔一画地写每个字！",
   inQ:"你现在在 {q}。粘贴一道题，用日语写出答案，GAKU 会帮你检查。（想改为抄写句子，请点 {copy}。）",
   inCopy2:"你现在在 {copy}：亲手抄写一句话。（想改为回答问题，请点 {q}。）", pickStyle:"选一种方式。{copy} = 亲手抄写一句话。{q} = 写出答案。",
   pasteHere:"① 粘贴到这里。把一句简短的日语放进这个框里。", pasteQ:"① 在这里粘贴题目。把考试或网站上的一道题放进这个框里。",
   draw:"② 点这里。然后用手指书写！", typeAns:"② 在这里用日语输入你的答案。", check:"③ 点这里。GAKU 会根据题目检查你的答案。",
   generic:"你在这里。从这个框的上面开始，往下进行。", subtitles:"在这个框里粘贴字幕，然后按照按钮操作。",
   milestones:"你的进度检查在这个框里。点一张卡片即可打开。", jlpt:"你的 JLPT 结果在这个框里。", feedback:"在这个框里写下你的留言并发送。",
   links:"点这个框里的链接，打开学习网站。", wordcards:"在这个框里搜索单词，然后点这个单词制作卡片。",
   library:"你保存的卡片在这个框里。点文件夹即可打开。", folderPg:"这个文件夹里的卡片在这个框里。点一张卡片查看。",
   flash:"闪卡在这个框里。点卡片即可翻面。", pickWriting:"在这个框里选择你想怎么练习。",
   goFlash:"想用闪卡复习吗？点“Go Flashcard”，开始闪卡练习。",
   tFirst:"你的第一分钟", tSchedule:"日程", tVocab:"词汇", tPage:"本页", tSubtitles:"字幕", tMilestones:"里程碑", tFeedback:"反馈", tLinks:"链接", tWordCards:"单词卡片", tLibrary:"资料库", tFolder:"文件夹", tFlash:"闪卡"
  }
 },
 "Chinese (Traditional)": {
  labels: { next:"下一步 ▶", done:"完成 🎉", close:"關閉", show:"看看怎麼用(1分鐘)", missing:"這裡看不到嗎?點「下一步」。", pick:"選一個。我會帶你過去,並告訴你點哪裡。" },
  s: {
   tap:"點這裡。", tapFc:"點 {fc}。", sample:"已經準備好範例文字。也可以貼上你自己的。", big:"點這個大按鈕。", great:"回答問題。做得好!🎉",
   task:"完成今天的任務。做完後點這裡。", typeWord:"在這裡輸入一個單字。", search:"點這裡搜尋。", tapWord:"點這個單字。", saved:"點這裡。已儲存!🎉",
   pasteFc:"① 貼到這裡。把你想學習的日文文字放進這個框裡。(裡面已有範例。)", thenBig:"② 然後點這個大按鈕。",
   tapConv:"點 {conv}。", listenTab:"① 最簡單:點這裡收聽影片分頁的聲音。(這台裝置上沒有顯示?點「下一步」。)",
   record:"② 在這裡錄音。點這個麥克風按鈕,然後播放日文影片或直接說話。這裡沒有可貼上的框。", hint:"③ 出現句子後,點這裡查看怎麼回答。",
   tapPron:"點 {pron}。", pronBtn:"② 點這個按鈕,然後播放日文影片或直接說話。這裡沒有可貼上的框。", pronRec:"③ 出現句子後,點這裡,看完影片後大聲唸出來。",
   tapWr:"點 {wr}。", inCopy1:"你現在在 {copy}。你要親手抄寫一句日文。", tapCopy1:"點 {copy}。(親手抄寫一句日文。)",
   pasteSent:"① 在這裡貼上一句日文。把一句簡短的日文放進這個框裡。", orWords:"② 或者用你自己的單字。你在 Vocabulary 裡儲存的單字也可以用。點這裡打開。",
   folder:"③ 選擇你儲存單字的資料夾。", words:"④ 點你想練習的單字。☑ 表示已選取。", useBtn:"⑤ 點這個按鈕。你的單字會放進框裡。",
   nowBox:"⑥ 你的單字現在在這個框裡了。還可以修改。", startDraw:"⑦ 點這裡。然後用手指一筆一畫地寫每個字!",
   inQ:"你現在在 {q}。貼上一道題目,用日文寫出答案,GAKU 會幫你檢查。(想改為抄寫句子,請點 {copy}。)",
   inCopy2:"你現在在 {copy}:親手抄寫一句話。(想改為回答問題,請點 {q}。)", pickStyle:"選一種方式。{copy} = 親手抄寫一句話。{q} = 寫出答案。",
   pasteHere:"① 貼到這裡。把一句簡短的日文放進這個框裡。", pasteQ:"① 在這裡貼上題目。把考試或網站上的一道題放進這個框裡。",
   draw:"② 點這裡。然後用手指書寫!", typeAns:"② 在這裡用日文輸入你的答案。", check:"③ 點這裡。GAKU 會根據題目檢查你的答案。",
   generic:"你在這裡。從這個框的上面開始,往下進行。", subtitles:"在這個框裡貼上字幕,然後依照按鈕操作。",
   milestones:"你的進度檢查在這個框裡。點一張卡片即可打開。", jlpt:"你的 JLPT 結果在這個框裡。", feedback:"在這個框裡寫下你的留言並送出。",
   links:"點這個框裡的連結,打開學習網站。", wordcards:"在這個框裡搜尋單字,然後點這個單字製作卡片。",
   library:"你儲存的卡片在這個框裡。點資料夾即可打開。", folderPg:"這個資料夾裡的卡片在這個框裡。點一張卡片查看。",
   flash:"閃卡在這個框裡。點卡片即可翻面。", pickWriting:"在這個框裡選擇你想怎麼練習。",
   goFlash:"想用閃卡複習嗎?點「Go Flashcard」,開始閃卡練習。",
   tFirst:"你的第一分鐘", tSchedule:"行程", tVocab:"詞彙", tPage:"本頁", tSubtitles:"字幕", tMilestones:"里程碑", tFeedback:"意見回饋", tLinks:"連結", tWordCards:"單字卡片", tLibrary:"資料庫", tFolder:"資料夾", tFlash:"閃卡"
  }
 },
 "Italian": {
  labels: { next:"Avanti ▶", done:"Fatto 🎉", close:"Chiudi", show:"Guarda come si fa (1 min)", missing:"Non lo vedi qui? Tocca Avanti.", pick:"Scegline uno. Ti porto lì e ti mostro dove toccare." },
  s: {
   tap:"Tocca qui.", tapFc:"Tocca {fc}.", sample:"Un testo di esempio è pronto. Oppure incolla il tuo.", big:"Tocca questo grande pulsante.", great:"Rispondi alle domande. Ottimo lavoro! 🎉",
   task:"Fai il compito di oggi. Tocca qui quando hai finito.", typeWord:"Scrivi una parola qui.", search:"Tocca qui per cercare.", tapWord:"Tocca la parola.", saved:"Tocca qui. Salvata! 🎉",
   pasteFc:"① INCOLLA QUI. Metti in questa casella il testo giapponese che vuoi studiare. (Dentro c'è già un esempio.)", thenBig:"② Poi tocca questo grande pulsante.",
   tapConv:"Tocca {conv}.", listenTab:"① Il più facile: tocca qui per ascoltare una scheda video. (Non compare su questo dispositivo? Tocca Avanti.)",
   record:"② REGISTRA QUI. Tocca questo pulsante del microfono, poi riproduci un video in giapponese o parla. Non c'è nessuna casella dove incollare.", hint:"③ Quando compare una frase, tocca qui per vedere come rispondere.",
   tapPron:"Tocca {pron}.", pronBtn:"② Tocca questo pulsante, poi riproduci un video in giapponese o parla. Non c'è nessuna casella dove incollare.", pronRec:"③ Quando compare una frase, tocca qui e dilla a voce alta dopo il video.",
   tapWr:"Tocca {wr}.", inCopy1:"Sei in {copy}. Copi a mano una frase giapponese.", tapCopy1:"Tocca {copy}. (Copi a mano una frase giapponese.)",
   pasteSent:"① INCOLLA QUI UNA FRASE GIAPPONESE. Metti una breve frase giapponese in questa casella.", orWords:"② OPPURE usa le tue parole. Anche le parole salvate in Vocabulary vanno bene. Tocca qui per aprirle.",
   folder:"③ Scegli la cartella dove hai salvato le tue parole.", words:"④ Tocca le parole che vuoi esercitare. ☑ significa scelta.", useBtn:"⑤ Tocca questo pulsante. Le tue parole vanno nella casella.",
   nowBox:"⑥ Le tue parole ora sono in questa casella. Puoi ancora modificarle.", startDraw:"⑦ Tocca qui. Poi disegna ogni carattere con il dito!",
   inQ:"Sei in {q}. Incolla una domanda, scrivi la risposta in giapponese e GAKU la controlla. (Tocca {copy} per copiare invece una frase a mano.)",
   inCopy2:"Sei in {copy}: copia una frase a mano. (Tocca {q} per rispondere invece a una domanda.)", pickStyle:"Scegli uno stile. {copy} = copiare una frase a mano. {q} = scrivere una risposta.",
   pasteHere:"① INCOLLA QUI. Metti una breve frase giapponese in questa casella.", pasteQ:"① INCOLLA QUI LA DOMANDA. Metti in questa casella una domanda di un test o di un sito web.",
   draw:"② Tocca qui. Poi disegna con il dito!", typeAns:"② SCRIVI QUI LA TUA RISPOSTA, in giapponese.", check:"③ Tocca qui. GAKU controlla la tua risposta rispetto alla domanda.",
   generic:"Sei qui. Parti dall'alto di questo riquadro e scendi.", subtitles:"Usa la casella in questo riquadro per incollare i sottotitoli, poi segui i pulsanti.",
   milestones:"I tuoi controlli dei progressi sono in questo riquadro. Tocca una scheda per aprirla.", jlpt:"I tuoi risultati JLPT sono in questo riquadro.", feedback:"Scrivi il tuo messaggio in questo riquadro e invialo.",
   links:"Tocca un link in questo riquadro per aprire un sito di studio.", wordcards:"Cerca una parola in questo riquadro, poi toccala per creare una scheda.",
   library:"Le tue schede salvate sono in questo riquadro. Tocca una cartella per aprirla.", folderPg:"Le schede di questa cartella sono in questo riquadro. Tocca una scheda per vederla.",
   flash:"Le flashcard sono in questo riquadro. Tocca la scheda per girarla.", pickWriting:"Scegli come vuoi esercitarti in questo riquadro.",
   goFlash:"Vuoi ripassare con le flashcard? Tocca “Go Flashcard” per iniziare l'attività Flashcards.",
   tFirst:"Il tuo primo minuto", tSchedule:"Programma", tVocab:"Vocabolario", tPage:"Questa pagina", tSubtitles:"Sottotitoli", tMilestones:"Traguardi", tFeedback:"Feedback", tLinks:"Link", tWordCards:"Schede di parole", tLibrary:"Libreria", tFolder:"Cartella", tFlash:"Flashcard"
  }
 },
 "Korean": {
  labels: { next:"다음 ▶", done:"완료 🎉", close:"닫기", show:"사용법 보기 (1분)", missing:"여기에 안 보이나요? 다음을 누르세요.", pick:"하나를 고르세요. 그 화면으로 가서 어디를 누를지 알려 드릴게요." },
  s: {
   tap:"여기를 누르세요.", tapFc:"{fc}을(를) 누르세요.", sample:"예시 글이 준비되어 있어요. 직접 붙여 넣어도 돼요.", big:"이 큰 버튼을 누르세요.", great:"질문에 답하세요. 잘했어요! 🎉",
   task:"오늘의 과제를 하세요. 끝나면 여기를 누르세요.", typeWord:"여기에 단어 하나를 입력하세요.", search:"검색하려면 여기를 누르세요.", tapWord:"단어를 누르세요.", saved:"여기를 누르세요. 저장됐어요! 🎉",
   pasteFc:"① 여기에 붙여 넣기. 공부하고 싶은 일본어 글을 이 칸에 넣으세요. (예시가 이미 들어 있어요.)", thenBig:"② 그런 다음 이 큰 버튼을 누르세요.",
   tapConv:"{conv}을(를) 누르세요.", listenTab:"① 가장 쉬운 방법: 여기를 눌러 동영상 탭의 소리를 들으세요. (이 기기에 안 보이나요? 다음을 누르세요.)",
   record:"② 여기에서 녹음. 이 마이크 버튼을 누른 뒤 일본어 동영상을 재생하거나 말하세요. 붙여 넣는 칸은 없어요.", hint:"③ 문장이 나오면 여기를 눌러 대답하는 방법을 확인하세요.",
   tapPron:"{pron}을(를) 누르세요.", pronBtn:"② 이 버튼을 누른 뒤 일본어 동영상을 재생하거나 말하세요. 붙여 넣는 칸은 없어요.", pronRec:"③ 문장이 나오면 여기를 누르고, 동영상을 본 뒤 소리 내어 말해 보세요.",
   tapWr:"{wr}을(를) 누르세요.", inCopy1:"지금 {copy}입니다. 일본어 문장을 손으로 따라 써요.", tapCopy1:"{copy}을(를) 누르세요. (일본어 문장을 손으로 따라 써요.)",
   pasteSent:"① 여기에 일본어 문장을 붙여 넣기. 짧은 일본어 문장을 이 칸에 넣으세요.", orWords:"② 또는 내 단어를 사용하세요. Vocabulary에 저장한 단어도 쓸 수 있어요. 여기를 눌러 여세요.",
   folder:"③ 단어를 저장한 폴더를 고르세요.", words:"④ 연습하고 싶은 단어를 누르세요. ☑는 선택됐다는 뜻이에요.", useBtn:"⑤ 이 버튼을 누르세요. 단어가 칸에 들어가요.",
   nowBox:"⑥ 단어가 이 칸에 들어갔어요. 아직 바꿀 수 있어요.", startDraw:"⑦ 여기를 누르세요. 그런 다음 손가락으로 글자를 한 글자씩 쓰세요!",
   inQ:"지금 {q}입니다. 문제를 붙여 넣고 일본어로 답을 쓰면 GAKU가 확인해 줘요. (문장을 따라 쓰려면 {copy}을(를) 누르세요.)",
   inCopy2:"지금 {copy}입니다: 문장을 손으로 따라 써요. (문제에 답하려면 {q}을(를) 누르세요.)", pickStyle:"방식을 고르세요. {copy} = 문장을 손으로 따라 쓰기. {q} = 답 쓰기.",
   pasteHere:"① 여기에 붙여 넣기. 짧은 일본어 문장을 이 칸에 넣으세요.", pasteQ:"① 여기에 문제를 붙여 넣기. 시험이나 웹사이트의 문제를 이 칸에 넣으세요.",
   draw:"② 여기를 누르세요. 그런 다음 손가락으로 쓰세요!", typeAns:"② 여기에 일본어로 답을 입력하세요.", check:"③ 여기를 누르세요. GAKU가 문제에 맞는지 답을 확인해 줘요.",
   generic:"여기가 현재 페이지예요. 이 틀의 위에서부터 아래로 진행하세요.", subtitles:"이 틀 안의 칸에 자막을 붙여 넣고, 버튼을 따라가세요.",
   milestones:"진행 확인이 이 틀 안에 있어요. 카드를 눌러 여세요.", jlpt:"JLPT 결과가 이 틀 안에 있어요.", feedback:"이 틀 안에 메시지를 쓰고 보내세요.",
   links:"이 틀 안의 링크를 눌러 학습 사이트를 여세요.", wordcards:"이 틀 안에서 단어를 검색한 뒤, 단어를 눌러 카드를 만드세요.",
   library:"저장한 카드가 이 틀 안에 있어요. 폴더를 눌러 여세요.", folderPg:"이 폴더의 카드가 이 틀 안에 있어요. 카드를 눌러 보세요.",
   flash:"플래시카드가 이 틀 안에 있어요. 카드를 눌러 뒤집으세요.", pickWriting:"이 틀 안에서 연습 방식을 고르세요.",
   goFlash:"플래시카드로 복습하고 싶나요? “Go Flashcard”를 눌러 Flashcards 활동을 시작하세요.",
   tFirst:"첫 1분", tSchedule:"일정", tVocab:"단어", tPage:"이 페이지", tSubtitles:"자막", tMilestones:"마일스톤", tFeedback:"의견", tLinks:"링크", tWordCards:"단어 카드", tLibrary:"라이브러리", tFolder:"폴더", tFlash:"플래시카드"
  }
 },
 "Thai": {
  labels: { next:"ถัดไป ▶", done:"เสร็จแล้ว 🎉", close:"ปิด", show:"ดูวิธีใช้ (1 นาที)", missing:"มองไม่เห็นตรงนี้ใช่ไหม? แตะ ถัดไป", pick:"เลือกหนึ่งอย่าง ฉันจะพาไปที่นั่นและบอกว่าต้องแตะตรงไหน" },
  s: {
   tap:"แตะตรงนี้", tapFc:"แตะ {fc}", sample:"มีข้อความตัวอย่างพร้อมแล้ว หรือวางข้อความของคุณเองก็ได้", big:"แตะปุ่มใหญ่นี้", great:"ตอบคำถาม เก่งมาก! 🎉",
   task:"ทำงานของวันนี้ เสร็จแล้วแตะตรงนี้", typeWord:"พิมพ์คำศัพท์หนึ่งคำตรงนี้", search:"แตะตรงนี้เพื่อค้นหา", tapWord:"แตะที่คำศัพท์", saved:"แตะตรงนี้ บันทึกแล้ว! 🎉",
   pasteFc:"① วางตรงนี้ ใส่ข้อความภาษาญี่ปุ่นที่อยากเรียนลงในช่องนี้ (มีตัวอย่างอยู่ในช่องแล้ว)", thenBig:"② จากนั้นแตะปุ่มใหญ่นี้",
   tapConv:"แตะ {conv}", listenTab:"① ง่ายที่สุด: แตะตรงนี้เพื่อฟังเสียงจากแท็บวิดีโอ (ไม่เห็นในอุปกรณ์นี้? แตะ ถัดไป)",
   record:"② อัดเสียงตรงนี้ แตะปุ่มไมโครโฟนนี้ แล้วเปิดวิดีโอภาษาญี่ปุ่นหรือพูดเอง ที่นี่ไม่มีช่องให้วาง", hint:"③ เมื่อมีประโยคขึ้นมา แตะตรงนี้เพื่อดูวิธีตอบ",
   tapPron:"แตะ {pron}", pronBtn:"② แตะปุ่มนี้ แล้วเปิดวิดีโอภาษาญี่ปุ่นหรือพูดเอง ที่นี่ไม่มีช่องให้วาง", pronRec:"③ เมื่อมีประโยคขึ้นมา แตะตรงนี้ แล้วพูดออกเสียงตามหลังวิดีโอ",
   tapWr:"แตะ {wr}", inCopy1:"ตอนนี้คุณอยู่ที่ {copy} คุณจะคัดประโยคภาษาญี่ปุ่นด้วยมือ", tapCopy1:"แตะ {copy} (คัดประโยคภาษาญี่ปุ่นด้วยมือ)",
   pasteSent:"① วางประโยคภาษาญี่ปุ่นตรงนี้ ใส่ประโยคภาษาญี่ปุ่นสั้นๆ ลงในช่องนี้", orWords:"② หรือใช้คำศัพท์ของคุณเอง คำที่คุณบันทึกไว้ใน Vocabulary ก็ใช้ได้ แตะตรงนี้เพื่อเปิด",
   folder:"③ เลือกโฟลเดอร์ที่คุณบันทึกคำศัพท์ไว้", words:"④ แตะคำที่อยากฝึก เครื่องหมาย ☑ คือเลือกแล้ว", useBtn:"⑤ แตะปุ่มนี้ คำศัพท์ของคุณจะเข้าไปอยู่ในช่อง",
   nowBox:"⑥ คำศัพท์ของคุณอยู่ในช่องนี้แล้ว ยังแก้ไขได้อยู่", startDraw:"⑦ แตะตรงนี้ แล้วใช้นิ้วเขียนทีละตัวอักษร!",
   inQ:"ตอนนี้คุณอยู่ที่ {q} วางโจทย์ เขียนคำตอบเป็นภาษาญี่ปุ่น แล้ว GAKU จะตรวจให้ (แตะ {copy} หากต้องการคัดประโยคแทน)",
   inCopy2:"ตอนนี้คุณอยู่ที่ {copy}: คัดประโยคด้วยมือ (แตะ {q} หากต้องการตอบโจทย์แทน)", pickStyle:"เลือกรูปแบบ {copy} = คัดประโยคด้วยมือ {q} = เขียนคำตอบ",
   pasteHere:"① วางตรงนี้ ใส่ประโยคภาษาญี่ปุ่นสั้นๆ ลงในช่องนี้", pasteQ:"① วางโจทย์ตรงนี้ ใส่โจทย์จากข้อสอบหรือเว็บไซต์ลงในช่องนี้",
   draw:"② แตะตรงนี้ แล้วใช้นิ้วเขียนได้เลย!", typeAns:"② พิมพ์คำตอบของคุณตรงนี้ เป็นภาษาญี่ปุ่น", check:"③ แตะตรงนี้ GAKU จะตรวจคำตอบของคุณเทียบกับโจทย์",
   generic:"คุณอยู่ตรงนี้ เริ่มจากด้านบนของกรอบนี้แล้วไล่ลงมา", subtitles:"ใช้ช่องในกรอบนี้วางคำบรรยาย แล้วทำตามปุ่ม",
   milestones:"การตรวจความก้าวหน้าของคุณอยู่ในกรอบนี้ แตะการ์ดเพื่อเปิด", jlpt:"ผล JLPT ของคุณอยู่ในกรอบนี้", feedback:"เขียนข้อความของคุณในกรอบนี้แล้วส่ง",
   links:"แตะลิงก์ในกรอบนี้เพื่อเปิดเว็บไซต์เรียน", wordcards:"ค้นหาคำศัพท์ในกรอบนี้ แล้วแตะคำนั้นเพื่อสร้างการ์ด",
   library:"การ์ดที่บันทึกไว้อยู่ในกรอบนี้ แตะโฟลเดอร์เพื่อเปิด", folderPg:"การ์ดในโฟลเดอร์นี้อยู่ในกรอบนี้ แตะการ์ดเพื่อดู",
   flash:"แฟลชการ์ดอยู่ในกรอบนี้ แตะการ์ดเพื่อพลิก", pickWriting:"เลือกวิธีที่อยากฝึกในกรอบนี้",
   goFlash:"อยากทบทวนด้วยแฟลชการ์ดใช่ไหม? แตะ “Go Flashcard” เพื่อเริ่มกิจกรรม Flashcards",
   tFirst:"1 นาทีแรกของคุณ", tSchedule:"ตารางเรียน", tVocab:"คำศัพท์", tPage:"หน้านี้", tSubtitles:"คำบรรยาย", tMilestones:"เป้าหมายสำคัญ", tFeedback:"ความคิดเห็น", tLinks:"ลิงก์", tWordCards:"การ์ดคำศัพท์", tLibrary:"คลัง", tFolder:"โฟลเดอร์", tFlash:"แฟลชการ์ด"
  }
 },
 "Malay": {
  labels: { next:"Seterusnya ▶", done:"Selesai 🎉", close:"Tutup", show:"Tunjuk cara (1 minit)", missing:"Tak nampak di sini? Tekan Seterusnya.", pick:"Pilih satu. Saya bawa anda ke sana dan tunjukkan di mana hendak menekan." },
  s: {
   tap:"Tekan di sini.", tapFc:"Tekan {fc}.", sample:"Teks contoh sudah sedia. Atau tampal teks anda sendiri.", big:"Tekan butang besar ini.", great:"Jawab soalan. Syabas! 🎉",
   task:"Buat tugasan hari ini. Tekan di sini apabila selesai.", typeWord:"Taip satu perkataan di sini.", search:"Tekan di sini untuk mencari.", tapWord:"Tekan perkataan itu.", saved:"Tekan di sini. Disimpan! 🎉",
   pasteFc:"① TAMPAL DI SINI. Letakkan teks Jepun yang ingin anda pelajari dalam kotak ini. (Contoh sudah ada di dalamnya.)", thenBig:"② Kemudian tekan butang besar ini.",
   tapConv:"Tekan {conv}.", listenTab:"① Paling mudah: tekan di sini untuk mendengar tab video. (Tidak dipaparkan pada peranti ini? Tekan Seterusnya.)",
   record:"② RAKAM DI SINI. Tekan butang mikrofon ini, kemudian mainkan video Jepun atau bercakap. Tiada kotak untuk menampal.", hint:"③ Apabila ayat muncul, tekan di sini untuk lihat cara menjawab.",
   tapPron:"Tekan {pron}.", pronBtn:"② Tekan butang ini, kemudian mainkan video Jepun atau bercakap. Tiada kotak untuk menampal.", pronRec:"③ Apabila ayat muncul, tekan di sini dan sebutkannya dengan kuat selepas video.",
   tapWr:"Tekan {wr}.", inCopy1:"Anda berada di {copy}. Anda menyalin satu ayat Jepun dengan tangan.", tapCopy1:"Tekan {copy}. (Anda menyalin satu ayat Jepun dengan tangan.)",
   pasteSent:"① TAMPAL SATU AYAT JEPUN DI SINI. Letakkan ayat Jepun yang pendek dalam kotak ini.", orWords:"② ATAU guna perkataan anda sendiri. Perkataan yang anda simpan dalam Vocabulary juga boleh digunakan. Tekan di sini untuk membukanya.",
   folder:"③ Pilih folder tempat anda menyimpan perkataan.", words:"④ Tekan perkataan yang ingin dilatih. ☑ bermaksud dipilih.", useBtn:"⑤ Tekan butang ini. Perkataan anda masuk ke dalam kotak.",
   nowBox:"⑥ Perkataan anda kini ada dalam kotak ini. Anda masih boleh mengubahnya.", startDraw:"⑦ Tekan di sini. Kemudian lukis setiap huruf dengan jari anda!",
   inQ:"Anda berada di {q}. Tampal soalan, tulis jawapan dalam bahasa Jepun, dan GAKU akan menyemaknya. (Tekan {copy} untuk menyalin ayat dengan tangan.)",
   inCopy2:"Anda berada di {copy}: salin satu ayat dengan tangan. (Tekan {q} untuk menjawab soalan.)", pickStyle:"Pilih gaya. {copy} = salin ayat dengan tangan. {q} = tulis jawapan.",
   pasteHere:"① TAMPAL DI SINI. Letakkan ayat Jepun yang pendek dalam kotak ini.", pasteQ:"① TAMPAL SOALAN DI SINI. Letakkan soalan daripada ujian atau laman web dalam kotak ini.",
   draw:"② Tekan di sini. Kemudian lukis dengan jari anda!", typeAns:"② TAIP JAWAPAN ANDA DI SINI, dalam bahasa Jepun.", check:"③ Tekan di sini. GAKU menyemak jawapan anda berdasarkan soalan.",
   generic:"Anda berada di sini. Mula dari atas bingkai ini dan turun ke bawah.", subtitles:"Gunakan kotak dalam bingkai ini untuk menampal sari kata, kemudian ikut butang.",
   milestones:"Semakan kemajuan anda ada dalam bingkai ini. Tekan kad untuk membukanya.", jlpt:"Keputusan JLPT anda ada dalam bingkai ini.", feedback:"Tulis mesej anda dalam bingkai ini dan hantar.",
   links:"Tekan pautan dalam bingkai ini untuk membuka laman belajar.", wordcards:"Cari perkataan dalam bingkai ini, kemudian tekan perkataan itu untuk membuat kad.",
   library:"Kad yang anda simpan ada dalam bingkai ini. Tekan folder untuk membukanya.", folderPg:"Kad dalam folder ini ada dalam bingkai ini. Tekan kad untuk melihatnya.",
   flash:"Kad imbas ada dalam bingkai ini. Tekan kad untuk memusingkannya.", pickWriting:"Pilih cara anda mahu berlatih dalam bingkai ini.",
   goFlash:"Mahu ulang kaji dengan kad imbas? Tekan “Go Flashcard” untuk memulakan aktiviti Flashcards.",
   tFirst:"Minit pertama anda", tSchedule:"Jadual", tVocab:"Perbendaharaan kata", tPage:"Halaman ini", tSubtitles:"Sari kata", tMilestones:"Pencapaian", tFeedback:"Maklum balas", tLinks:"Pautan", tWordCards:"Kad perkataan", tLibrary:"Perpustakaan", tFolder:"Folder", tFlash:"Kad imbas"
  }
 },
 "Indonesian": {
  labels: { next:"Berikutnya ▶", done:"Selesai 🎉", close:"Tutup", show:"Lihat caranya (1 menit)", missing:"Tidak terlihat di sini? Ketuk Berikutnya.", pick:"Pilih satu. Saya antar ke sana dan tunjukkan di mana harus mengetuk." },
  s: {
   tap:"Ketuk di sini.", tapFc:"Ketuk {fc}.", sample:"Teks contoh sudah siap. Atau tempel teksmu sendiri.", big:"Ketuk tombol besar ini.", great:"Jawab pertanyaannya. Kerja bagus! 🎉",
   task:"Kerjakan tugas hari ini. Ketuk di sini kalau sudah selesai.", typeWord:"Ketik satu kata di sini.", search:"Ketuk di sini untuk mencari.", tapWord:"Ketuk katanya.", saved:"Ketuk di sini. Tersimpan! 🎉",
   pasteFc:"① TEMPEL DI SINI. Masukkan teks bahasa Jepang yang ingin kamu pelajari ke kotak ini. (Contohnya sudah ada di dalam.)", thenBig:"② Lalu ketuk tombol besar ini.",
   tapConv:"Ketuk {conv}.", listenTab:"① Paling mudah: ketuk di sini untuk mendengarkan tab video. (Tidak muncul di perangkat ini? Ketuk Berikutnya.)",
   record:"② REKAM DI SINI. Ketuk tombol mikrofon ini, lalu putar video bahasa Jepang atau bicara. Tidak ada kotak untuk menempel.", hint:"③ Saat kalimat muncul, ketuk di sini untuk melihat cara menjawab.",
   tapPron:"Ketuk {pron}.", pronBtn:"② Ketuk tombol ini, lalu putar video bahasa Jepang atau bicara. Tidak ada kotak untuk menempel.", pronRec:"③ Saat kalimat muncul, ketuk di sini lalu ucapkan dengan keras setelah video.",
   tapWr:"Ketuk {wr}.", inCopy1:"Kamu berada di {copy}. Kamu menyalin satu kalimat bahasa Jepang dengan tangan.", tapCopy1:"Ketuk {copy}. (Kamu menyalin satu kalimat bahasa Jepang dengan tangan.)",
   pasteSent:"① TEMPEL SATU KALIMAT BAHASA JEPANG DI SINI. Masukkan kalimat bahasa Jepang yang pendek ke kotak ini.", orWords:"② ATAU pakai kata-katamu sendiri. Kata yang kamu simpan di Vocabulary juga bisa dipakai. Ketuk di sini untuk membukanya.",
   folder:"③ Pilih folder tempat kamu menyimpan kata-katamu.", words:"④ Ketuk kata yang ingin dilatih. ☑ berarti terpilih.", useBtn:"⑤ Ketuk tombol ini. Kata-katamu masuk ke kotak.",
   nowBox:"⑥ Kata-katamu sekarang ada di kotak ini. Kamu masih bisa mengubahnya.", startDraw:"⑦ Ketuk di sini. Lalu gambar setiap huruf dengan jarimu!",
   inQ:"Kamu berada di {q}. Tempel pertanyaan, tulis jawabanmu dalam bahasa Jepang, dan GAKU akan memeriksanya. (Ketuk {copy} untuk menyalin kalimat dengan tangan.)",
   inCopy2:"Kamu berada di {copy}: salin satu kalimat dengan tangan. (Ketuk {q} untuk menjawab pertanyaan.)", pickStyle:"Pilih gaya. {copy} = salin kalimat dengan tangan. {q} = tulis jawaban.",
   pasteHere:"① TEMPEL DI SINI. Masukkan kalimat bahasa Jepang yang pendek ke kotak ini.", pasteQ:"① TEMPEL PERTANYAANNYA DI SINI. Masukkan pertanyaan dari tes atau situs web ke kotak ini.",
   draw:"② Ketuk di sini. Lalu tulis dengan jarimu!", typeAns:"② KETIK JAWABANMU DI SINI, dalam bahasa Jepang.", check:"③ Ketuk di sini. GAKU memeriksa jawabanmu terhadap pertanyaannya.",
   generic:"Kamu di sini. Mulai dari atas bingkai ini lalu turun ke bawah.", subtitles:"Pakai kotak di dalam bingkai ini untuk menempel subtitel, lalu ikuti tombolnya.",
   milestones:"Pemeriksaan kemajuanmu ada di bingkai ini. Ketuk kartu untuk membukanya.", jlpt:"Hasil JLPT-mu ada di bingkai ini.", feedback:"Tulis pesanmu di bingkai ini lalu kirim.",
   links:"Ketuk tautan di bingkai ini untuk membuka situs belajar.", wordcards:"Cari kata di bingkai ini, lalu ketuk kata itu untuk membuat kartu.",
   library:"Kartu yang kamu simpan ada di bingkai ini. Ketuk folder untuk membukanya.", folderPg:"Kartu di folder ini ada di bingkai ini. Ketuk kartu untuk melihatnya.",
   flash:"Kartu kilat ada di bingkai ini. Ketuk kartu untuk membaliknya.", pickWriting:"Pilih cara berlatih di bingkai ini.",
   goFlash:"Mau mengulang dengan kartu kilat? Ketuk “Go Flashcard” untuk memulai aktivitas Flashcards.",
   tFirst:"Menit pertamamu", tSchedule:"Jadwal", tVocab:"Kosakata", tPage:"Halaman ini", tSubtitles:"Subtitel", tMilestones:"Pencapaian", tFeedback:"Masukan", tLinks:"Tautan", tWordCards:"Kartu kata", tLibrary:"Pustaka", tFolder:"Folder", tFlash:"Kartu kilat"
  }
 },
 "Vietnamese": {
  labels: { next:"Tiếp ▶", done:"Xong 🎉", close:"Đóng", show:"Xem cách dùng (1 phút)", missing:"Không thấy ở đây? Chạm Tiếp.", pick:"Chọn một mục. Mình sẽ đưa bạn đến đó và chỉ chỗ cần chạm." },
  s: {
   tap:"Chạm vào đây.", tapFc:"Chạm {fc}.", sample:"Đã có sẵn một văn bản mẫu. Hoặc dán văn bản của bạn.", big:"Chạm vào nút lớn này.", great:"Trả lời các câu hỏi. Giỏi lắm! 🎉",
   task:"Làm nhiệm vụ hôm nay. Xong thì chạm vào đây.", typeWord:"Gõ một từ vào đây.", search:"Chạm vào đây để tìm.", tapWord:"Chạm vào từ đó.", saved:"Chạm vào đây. Đã lưu! 🎉",
   pasteFc:"① DÁN VÀO ĐÂY. Đặt đoạn văn tiếng Nhật bạn muốn học vào ô này. (Bên trong đã có bài mẫu.)", thenBig:"② Sau đó chạm vào nút lớn này.",
   tapConv:"Chạm {conv}.", listenTab:"① Dễ nhất: chạm vào đây để nghe âm thanh của thẻ video. (Không thấy trên thiết bị này? Chạm Tiếp.)",
   record:"② GHI ÂM Ở ĐÂY. Chạm nút micro này, rồi phát video tiếng Nhật hoặc tự nói. Ở đây không có ô để dán.", hint:"③ Khi một câu hiện ra, chạm vào đây để xem cách trả lời.",
   tapPron:"Chạm {pron}.", pronBtn:"② Chạm nút này, rồi phát video tiếng Nhật hoặc tự nói. Ở đây không có ô để dán.", pronRec:"③ Khi một câu hiện ra, chạm vào đây rồi đọc to lên sau video.",
   tapWr:"Chạm {wr}.", inCopy1:"Bạn đang ở {copy}. Bạn chép tay một câu tiếng Nhật.", tapCopy1:"Chạm {copy}. (Bạn chép tay một câu tiếng Nhật.)",
   pasteSent:"① DÁN MỘT CÂU TIẾNG NHẬT VÀO ĐÂY. Đặt một câu tiếng Nhật ngắn vào ô này.", orWords:"② HOẶC dùng từ của riêng bạn. Các từ bạn đã lưu trong Vocabulary cũng dùng được. Chạm vào đây để mở.",
   folder:"③ Chọn thư mục bạn đã lưu các từ.", words:"④ Chạm vào các từ bạn muốn luyện. ☑ nghĩa là đã chọn.", useBtn:"⑤ Chạm nút này. Các từ của bạn sẽ vào ô.",
   nowBox:"⑥ Các từ của bạn đã ở trong ô này. Bạn vẫn có thể sửa.", startDraw:"⑦ Chạm vào đây. Rồi dùng ngón tay viết từng chữ!",
   inQ:"Bạn đang ở {q}. Dán một câu hỏi, viết câu trả lời bằng tiếng Nhật, và GAKU sẽ kiểm tra. (Chạm {copy} để chép tay một câu.)",
   inCopy2:"Bạn đang ở {copy}: chép tay một câu. (Chạm {q} để trả lời câu hỏi.)", pickStyle:"Chọn cách luyện. {copy} = chép tay một câu. {q} = viết câu trả lời.",
   pasteHere:"① DÁN VÀO ĐÂY. Đặt một câu tiếng Nhật ngắn vào ô này.", pasteQ:"① DÁN CÂU HỎI VÀO ĐÂY. Đặt một câu hỏi từ bài kiểm tra hoặc trang web vào ô này.",
   draw:"② Chạm vào đây. Rồi dùng ngón tay viết!", typeAns:"② GÕ CÂU TRẢ LỜI CỦA BẠN VÀO ĐÂY, bằng tiếng Nhật.", check:"③ Chạm vào đây. GAKU kiểm tra câu trả lời của bạn so với câu hỏi.",
   generic:"Bạn đang ở đây. Bắt đầu từ trên cùng của khung này rồi đi xuống.", subtitles:"Dùng ô trong khung này để dán phụ đề, rồi làm theo các nút.",
   milestones:"Phần kiểm tra tiến độ của bạn nằm trong khung này. Chạm vào một thẻ để mở.", jlpt:"Kết quả JLPT của bạn nằm trong khung này.", feedback:"Viết tin nhắn của bạn trong khung này rồi gửi.",
   links:"Chạm vào một liên kết trong khung này để mở trang học.", wordcards:"Tìm một từ trong khung này, rồi chạm vào từ đó để tạo thẻ.",
   library:"Các thẻ đã lưu của bạn nằm trong khung này. Chạm vào một thư mục để mở.", folderPg:"Các thẻ trong thư mục này nằm trong khung này. Chạm vào một thẻ để xem.",
   flash:"Thẻ ghi nhớ nằm trong khung này. Chạm vào thẻ để lật.", pickWriting:"Chọn cách bạn muốn luyện tập trong khung này.",
   goFlash:"Muốn ôn tập bằng thẻ ghi nhớ? Chạm “Go Flashcard” để bắt đầu hoạt động Flashcards.",
   tFirst:"Phút đầu tiên của bạn", tSchedule:"Lịch học", tVocab:"Từ vựng", tPage:"Trang này", tSubtitles:"Phụ đề", tMilestones:"Cột mốc", tFeedback:"Phản hồi", tLinks:"Liên kết", tWordCards:"Thẻ từ", tLibrary:"Thư viện", tFolder:"Thư mục", tFlash:"Thẻ ghi nhớ"
  }
 },
 "Hindi": {
  labels: { next:"आगे ▶", done:"हो गया 🎉", close:"बंद करें", show:"तरीका देखें (1 मिनट)", missing:"यहाँ नहीं दिख रहा? आगे दबाएँ।", pick:"एक चुनें। मैं आपको वहाँ ले जाऊँगा और दिखाऊँगा कि कहाँ दबाना है।" },
  s: {
   tap:"यहाँ दबाएँ।", tapFc:"{fc} दबाएँ।", sample:"एक नमूना पाठ तैयार है। या अपना पाठ चिपकाएँ।", big:"इस बड़े बटन को दबाएँ।", great:"सवालों के जवाब दें। बहुत बढ़िया! 🎉",
   task:"आज का काम करें। पूरा होने पर यहाँ दबाएँ।", typeWord:"यहाँ एक शब्द लिखें।", search:"खोजने के लिए यहाँ दबाएँ।", tapWord:"शब्द पर दबाएँ।", saved:"यहाँ दबाएँ। सेव हो गया! 🎉",
   pasteFc:"① यहाँ चिपकाएँ। जो जापानी पाठ आप पढ़ना चाहते हैं, उसे इस बॉक्स में डालें। (अंदर एक नमूना पहले से है।)", thenBig:"② फिर इस बड़े बटन को दबाएँ।",
   tapConv:"{conv} दबाएँ।", listenTab:"① सबसे आसान: वीडियो टैब की आवाज़ सुनने के लिए यहाँ दबाएँ। (इस डिवाइस पर नहीं दिख रहा? आगे दबाएँ।)",
   record:"② यहाँ रिकॉर्ड करें। इस माइक्रोफ़ोन बटन को दबाएँ, फिर जापानी वीडियो चलाएँ या बोलें। यहाँ चिपकाने के लिए कोई बॉक्स नहीं है।", hint:"③ जब कोई वाक्य दिखे, तो जवाब देने का तरीका देखने के लिए यहाँ दबाएँ।",
   tapPron:"{pron} दबाएँ।", pronBtn:"② इस बटन को दबाएँ, फिर जापानी वीडियो चलाएँ या बोलें। यहाँ चिपकाने के लिए कोई बॉक्स नहीं है।", pronRec:"③ जब कोई वाक्य दिखे, तो यहाँ दबाएँ और वीडियो के बाद उसे ज़ोर से बोलें।",
   tapWr:"{wr} दबाएँ।", inCopy1:"आप अभी {copy} में हैं। आप एक जापानी वाक्य हाथ से नकल करके लिखेंगे।", tapCopy1:"{copy} दबाएँ। (एक जापानी वाक्य हाथ से नकल करके लिखें।)",
   pasteSent:"① यहाँ एक जापानी वाक्य चिपकाएँ। इस बॉक्स में एक छोटा जापानी वाक्य डालें।", orWords:"② या अपने खुद के शब्द इस्तेमाल करें। Vocabulary में सेव किए शब्द भी चलेंगे। उन्हें खोलने के लिए यहाँ दबाएँ।",
   folder:"③ वह फ़ोल्डर चुनें जिसमें आपने अपने शब्द सेव किए हैं।", words:"④ जिन शब्दों का अभ्यास करना है, उन पर दबाएँ। ☑ का मतलब है चुना गया।", useBtn:"⑤ इस बटन को दबाएँ। आपके शब्द बॉक्स में चले जाएँगे।",
   nowBox:"⑥ आपके शब्द अब इस बॉक्स में हैं। आप उन्हें अब भी बदल सकते हैं।", startDraw:"⑦ यहाँ दबाएँ। फिर उंगली से हर अक्षर बनाएँ!",
   inQ:"आप अभी {q} में हैं। एक सवाल चिपकाएँ, जापानी में जवाब लिखें, और GAKU उसे जाँचेगा। (वाक्य हाथ से नकल करने के लिए {copy} दबाएँ।)",
   inCopy2:"आप अभी {copy} में हैं: एक वाक्य हाथ से नकल करें। (सवाल का जवाब देने के लिए {q} दबाएँ।)", pickStyle:"एक तरीका चुनें। {copy} = वाक्य हाथ से नकल करना। {q} = जवाब लिखना।",
   pasteHere:"① यहाँ चिपकाएँ। इस बॉक्स में एक छोटा जापानी वाक्य डालें।", pasteQ:"① यहाँ सवाल चिपकाएँ। किसी टेस्ट या वेबसाइट का सवाल इस बॉक्स में डालें।",
   draw:"② यहाँ दबाएँ। फिर उंगली से लिखें!", typeAns:"② यहाँ अपना जवाब जापानी में लिखें।", check:"③ यहाँ दबाएँ। GAKU सवाल के हिसाब से आपका जवाब जाँचता है।",
   generic:"आप यहाँ हैं। इस फ़्रेम के ऊपर से शुरू करें और नीचे जाएँ।", subtitles:"इस फ़्रेम के बॉक्स में सबटाइटल चिपकाएँ, फिर बटनों का पालन करें।",
   milestones:"आपकी प्रगति की जाँच इस फ़्रेम में है। कार्ड खोलने के लिए उस पर दबाएँ।", jlpt:"आपके JLPT के नतीजे इस फ़्रेम में हैं।", feedback:"इस फ़्रेम में अपना संदेश लिखें और भेजें।",
   links:"पढ़ाई की साइट खोलने के लिए इस फ़्रेम में किसी लिंक पर दबाएँ।", wordcards:"इस फ़्रेम में कोई शब्द खोजें, फिर कार्ड बनाने के लिए उस शब्द पर दबाएँ।",
   library:"आपके सेव किए कार्ड इस फ़्रेम में हैं। फ़ोल्डर खोलने के लिए उस पर दबाएँ।", folderPg:"इस फ़ोल्डर के कार्ड इस फ़्रेम में हैं। देखने के लिए किसी कार्ड पर दबाएँ।",
   flash:"फ़्लैशकार्ड इस फ़्रेम में हैं। पलटने के लिए कार्ड पर दबाएँ।", pickWriting:"इस फ़्रेम में चुनें कि आप कैसे अभ्यास करना चाहते हैं।",
   goFlash:"फ़्लैशकार्ड से दोहराना चाहते हैं? Flashcards गतिविधि शुरू करने के लिए “Go Flashcard” दबाएँ।",
   tFirst:"आपका पहला मिनट", tSchedule:"शेड्यूल", tVocab:"शब्दावली", tPage:"यह पेज", tSubtitles:"सबटाइटल", tMilestones:"मील के पत्थर", tFeedback:"फ़ीडबैक", tLinks:"लिंक", tWordCards:"शब्द कार्ड", tLibrary:"लाइब्रेरी", tFolder:"फ़ोल्डर", tFlash:"फ़्लैशकार्ड"
  }
 },
 "Turkish": {
  labels: { next:"İleri ▶", done:"Bitti 🎉", close:"Kapat", show:"Nasıl yapılır göster (1 dk)", missing:"Burada görünmüyor mu? İleri'ye dokun.", pick:"Birini seç. Seni oraya götürüp nereye dokunacağını göstereyim." },
  s: {
   tap:"Buraya dokun.", tapFc:"{fc} öğesine dokun.", sample:"Örnek bir metin hazır. Ya da kendi metnini yapıştır.", big:"Bu büyük düğmeye dokun.", great:"Soruları yanıtla. Harika! 🎉",
   task:"Bugünün görevini yap. Bitirince buraya dokun.", typeWord:"Buraya bir kelime yaz.", search:"Aramak için buraya dokun.", tapWord:"Kelimeye dokun.", saved:"Buraya dokun. Kaydedildi! 🎉",
   pasteFc:"① BURAYA YAPIŞTIR. Çalışmak istediğin Japonca metni bu kutuya koy. (İçinde zaten bir örnek var.)", thenBig:"② Sonra bu büyük düğmeye dokun.",
   tapConv:"{conv} öğesine dokun.", listenTab:"① En kolayı: bir video sekmesini dinlemek için buraya dokun. (Bu cihazda görünmüyor mu? İleri'ye dokun.)",
   record:"② BURADA KAYDET. Bu mikrofon düğmesine dokun, sonra Japonca bir video oynat veya konuş. Yapıştıracak kutu yok.", hint:"③ Bir cümle çıkınca, nasıl yanıt vereceğini görmek için buraya dokun.",
   tapPron:"{pron} öğesine dokun.", pronBtn:"② Bu düğmeye dokun, sonra Japonca bir video oynat veya konuş. Yapıştıracak kutu yok.", pronRec:"③ Bir cümle çıkınca buraya dokun ve videodan sonra yüksek sesle söyle.",
   tapWr:"{wr} öğesine dokun.", inCopy1:"Şu an {copy} bölümündesin. Bir Japonca cümleyi elle kopyalarsın.", tapCopy1:"{copy} öğesine dokun. (Bir Japonca cümleyi elle kopyalarsın.)",
   pasteSent:"① BURAYA BİR JAPONCA CÜMLE YAPIŞTIR. Bu kutuya kısa bir Japonca cümle koy.", orWords:"② YA DA kendi kelimelerini kullan. Vocabulary'de kaydettiğin kelimeler de kullanılabilir. Açmak için buraya dokun.",
   folder:"③ Kelimelerini kaydettiğin klasörü seç.", words:"④ Çalışmak istediğin kelimelere dokun. ☑ seçildi demek.", useBtn:"⑤ Bu düğmeye dokun. Kelimelerin kutuya girer.",
   nowBox:"⑥ Kelimelerin artık bu kutuda. Hâlâ değiştirebilirsin.", startDraw:"⑦ Buraya dokun. Sonra her harfi parmağınla çiz!",
   inQ:"Şu an {q} bölümündesin. Bir soru yapıştır, cevabını Japonca yaz, GAKU kontrol etsin. (Bir cümleyi elle kopyalamak için {copy} öğesine dokun.)",
   inCopy2:"Şu an {copy} bölümündesin: bir cümleyi elle kopyala. (Bir soruyu yanıtlamak için {q} öğesine dokun.)", pickStyle:"Bir stil seç. {copy} = bir cümleyi elle kopyalamak. {q} = cevap yazmak.",
   pasteHere:"① BURAYA YAPIŞTIR. Bu kutuya kısa bir Japonca cümle koy.", pasteQ:"① SORUYU BURAYA YAPIŞTIR. Bir testten veya web sitesinden bir soruyu bu kutuya koy.",
   draw:"② Buraya dokun. Sonra parmağınla yaz!", typeAns:"② CEVABINI BURAYA YAZ, Japonca olarak.", check:"③ Buraya dokun. GAKU cevabını soruya göre kontrol eder.",
   generic:"Buradasın. Bu çerçevenin en üstünden başla ve aşağı doğru ilerle.", subtitles:"Altyazıları yapıştırmak için bu çerçevedeki kutuyu kullan, sonra düğmeleri takip et.",
   milestones:"İlerleme kontrollerin bu çerçevede. Açmak için bir karta dokun.", jlpt:"JLPT sonuçların bu çerçevede.", feedback:"Mesajını bu çerçeveye yaz ve gönder.",
   links:"Bir çalışma sitesini açmak için bu çerçevedeki bir bağlantıya dokun.", wordcards:"Bu çerçevede bir kelime ara, sonra kart yapmak için kelimeye dokun.",
   library:"Kaydettiğin kartlar bu çerçevede. Açmak için bir klasöre dokun.", folderPg:"Bu klasördeki kartlar bu çerçevede. Görmek için bir karta dokun.",
   flash:"Bilgi kartları bu çerçevede. Çevirmek için karta dokun.", pickWriting:"Bu çerçevede nasıl çalışmak istediğini seç.",
   goFlash:"Bilgi kartlarıyla tekrar yapmak ister misin? Flashcards etkinliğini başlatmak için “Go Flashcard” öğesine dokun.",
   tFirst:"İlk dakikan", tSchedule:"Program", tVocab:"Kelimeler", tPage:"Bu sayfa", tSubtitles:"Altyazılar", tMilestones:"Dönüm noktaları", tFeedback:"Geri bildirim", tLinks:"Bağlantılar", tWordCards:"Kelime kartları", tLibrary:"Kütüphane", tFolder:"Klasör", tFlash:"Bilgi kartları"
  }
 },
 "Nepali": {
  labels: { next:"अर्को ▶", done:"भयो 🎉", close:"बन्द गर्नुहोस्", show:"कसरी गर्ने हेर्नुहोस् (१ मिनेट)", missing:"यहाँ देखिएन? अर्को थिच्नुहोस्।", pick:"एउटा छान्नुहोस्। म तपाईंलाई त्यहाँ लैजान्छु र कहाँ थिच्ने देखाउँछु।" },
  s: {
   tap:"यहाँ थिच्नुहोस्।", tapFc:"{fc} थिच्नुहोस्।", sample:"नमुना पाठ तयार छ। वा आफ्नै पाठ टाँस्नुहोस्।", big:"यो ठूलो बटन थिच्नुहोस्।", great:"प्रश्नहरूको जवाफ दिनुहोस्। धेरै राम्रो! 🎉",
   task:"आजको काम गर्नुहोस्। सकिएपछि यहाँ थिच्नुहोस्।", typeWord:"यहाँ एउटा शब्द लेख्नुहोस्।", search:"खोज्न यहाँ थिच्नुहोस्।", tapWord:"शब्दमा थिच्नुहोस्।", saved:"यहाँ थिच्नुहोस्। सेभ भयो! 🎉",
   pasteFc:"① यहाँ टाँस्नुहोस्। तपाईंले पढ्न चाहेको जापानी पाठ यो बक्समा राख्नुहोस्। (भित्र नमुना पहिल्यै छ।)", thenBig:"② त्यसपछि यो ठूलो बटन थिच्नुहोस्।",
   tapConv:"{conv} थिच्नुहोस्।", listenTab:"① सबैभन्दा सजिलो: भिडियो ट्याबको आवाज सुन्न यहाँ थिच्नुहोस्। (यो उपकरणमा देखिएन? अर्को थिच्नुहोस्।)",
   record:"② यहाँ रेकर्ड गर्नुहोस्। यो माइक्रोफोन बटन थिच्नुहोस्, त्यसपछि जापानी भिडियो चलाउनुहोस् वा बोल्नुहोस्। यहाँ टाँस्ने बक्स छैन।", hint:"③ वाक्य देखा परेपछि, जवाफ कसरी दिने हेर्न यहाँ थिच्नुहोस्।",
   tapPron:"{pron} थिच्नुहोस्।", pronBtn:"② यो बटन थिच्नुहोस्, त्यसपछि जापानी भिडियो चलाउनुहोस् वा बोल्नुहोस्। यहाँ टाँस्ने बक्स छैन।", pronRec:"③ वाक्य देखा परेपछि, यहाँ थिच्नुहोस् र भिडियोपछि ठूलो स्वरमा भन्नुहोस्।",
   tapWr:"{wr} थिच्नुहोस्।", inCopy1:"तपाईं अहिले {copy} मा हुनुहुन्छ। तपाईं एउटा जापानी वाक्य हातले सारेर लेख्नुहुन्छ।", tapCopy1:"{copy} थिच्नुहोस्। (एउटा जापानी वाक्य हातले सारेर लेख्नुहोस्।)",
   pasteSent:"① यहाँ एउटा जापानी वाक्य टाँस्नुहोस्। यो बक्समा छोटो जापानी वाक्य राख्नुहोस्।", orWords:"② वा आफ्नै शब्द प्रयोग गर्नुहोस्। Vocabulary मा सेभ गरेका शब्द पनि चल्छन्। खोल्न यहाँ थिच्नुहोस्।",
   folder:"③ तपाईंले शब्दहरू सेभ गरेको फोल्डर छान्नुहोस्।", words:"④ अभ्यास गर्न चाहेका शब्दमा थिच्नुहोस्। ☑ को अर्थ छानिएको हो।", useBtn:"⑤ यो बटन थिच्नुहोस्। तपाईंका शब्द बक्समा जान्छन्।",
   nowBox:"⑥ तपाईंका शब्द अब यो बक्समा छन्। अझै परिवर्तन गर्न सक्नुहुन्छ।", startDraw:"⑦ यहाँ थिच्नुहोस्। त्यसपछि औंलाले हरेक अक्षर कोर्नुहोस्!",
   inQ:"तपाईं अहिले {q} मा हुनुहुन्छ। प्रश्न टाँस्नुहोस्, जापानीमा जवाफ लेख्नुहोस्, र GAKU ले जाँच गर्छ। (वाक्य हातले सार्न {copy} थिच्नुहोस्।)",
   inCopy2:"तपाईं अहिले {copy} मा हुनुहुन्छ: वाक्य हातले सारेर लेख्नुहोस्। (प्रश्नको जवाफ दिन {q} थिच्नुहोस्।)", pickStyle:"तरिका छान्नुहोस्। {copy} = वाक्य हातले सारेर लेख्ने। {q} = जवाफ लेख्ने।",
   pasteHere:"① यहाँ टाँस्नुहोस्। यो बक्समा छोटो जापानी वाक्य राख्नुहोस्।", pasteQ:"① यहाँ प्रश्न टाँस्नुहोस्। परीक्षा वा वेबसाइटको प्रश्न यो बक्समा राख्नुहोस्।",
   draw:"② यहाँ थिच्नुहोस्। त्यसपछि औंलाले लेख्नुहोस्!", typeAns:"② यहाँ आफ्नो जवाफ जापानीमा लेख्नुहोस्।", check:"③ यहाँ थिच्नुहोस्। GAKU ले प्रश्नअनुसार तपाईंको जवाफ जाँच्छ।",
   generic:"तपाईं यहाँ हुनुहुन्छ। यो फ्रेमको माथिबाट सुरु गरेर तल जानुहोस्।", subtitles:"यो फ्रेमभित्रको बक्समा सबटाइटल टाँस्नुहोस्, त्यसपछि बटनहरू पछ्याउनुहोस्।",
   milestones:"तपाईंको प्रगति जाँच यो फ्रेममा छ। खोल्न कार्डमा थिच्नुहोस्।", jlpt:"तपाईंको JLPT नतिजा यो फ्रेममा छ।", feedback:"यो फ्रेममा आफ्नो सन्देश लेखेर पठाउनुहोस्।",
   links:"अध्ययन साइट खोल्न यो फ्रेमको लिङ्कमा थिच्नुहोस्।", wordcards:"यो फ्रेममा शब्द खोज्नुहोस्, त्यसपछि कार्ड बनाउन शब्दमा थिच्नुहोस्।",
   library:"तपाईंले सेभ गरेका कार्डहरू यो फ्रेममा छन्। खोल्न फोल्डरमा थिच्नुहोस्।", folderPg:"यो फोल्डरका कार्डहरू यो फ्रेममा छन्। हेर्न कार्डमा थिच्नुहोस्।",
   flash:"फ्ल्यासकार्डहरू यो फ्रेममा छन्। पल्टाउन कार्डमा थिच्नुहोस्।", pickWriting:"यो फ्रेममा तपाईं कसरी अभ्यास गर्न चाहनुहुन्छ छान्नुहोस्।",
   goFlash:"फ्ल्यासकार्डबाट दोहोर्याउन चाहनुहुन्छ? Flashcards गतिविधि सुरु गर्न “Go Flashcard” थिच्नुहोस्।",
   tFirst:"तपाईंको पहिलो मिनेट", tSchedule:"तालिका", tVocab:"शब्दावली", tPage:"यो पेज", tSubtitles:"सबटाइटल", tMilestones:"माइलस्टोन", tFeedback:"प्रतिक्रिया", tLinks:"लिङ्कहरू", tWordCards:"शब्द कार्ड", tLibrary:"लाइब्रेरी", tFolder:"फोल्डर", tFlash:"फ्ल्यासकार्ड"
  }
 },
 "Filipino": {
  labels: { next:"Susunod ▶", done:"Tapos na 🎉", close:"Isara", show:"Ipakita kung paano (1 min)", missing:"Hindi makita rito? I-tap ang Susunod.", pick:"Pumili ng isa. Dadalhin kita roon at ipapakita kung saan mag-tap." },
  s: {
   tap:"I-tap dito.", tapFc:"I-tap ang {fc}.", sample:"May sample na teksto na. O i-paste ang sarili mong teksto.", big:"I-tap ang malaking button na ito.", great:"Sagutin ang mga tanong. Magaling! 🎉",
   task:"Gawin ang gawain ngayong araw. I-tap dito kapag tapos ka na.", typeWord:"Mag-type ng isang salita rito.", search:"I-tap dito para maghanap.", tapWord:"I-tap ang salita.", saved:"I-tap dito. Na-save na! 🎉",
   pasteFc:"① I-PASTE DITO. Ilagay sa kahong ito ang tekstong Japanese na gusto mong pag-aralan. (May sample na sa loob.)", thenBig:"② Pagkatapos, i-tap ang malaking button na ito.",
   tapConv:"I-tap ang {conv}.", listenTab:"① Pinakamadali: i-tap dito para pakinggan ang isang video tab. (Hindi lumalabas sa device na ito? I-tap ang Susunod.)",
   record:"② MAG-RECORD DITO. I-tap ang microphone button na ito, saka mag-play ng Japanese na video o magsalita. Walang kahong paglalagyan ng i-paste.", hint:"③ Kapag may lumabas na pangungusap, i-tap dito para makita kung paano sumagot.",
   tapPron:"I-tap ang {pron}.", pronBtn:"② I-tap ang button na ito, saka mag-play ng Japanese na video o magsalita. Walang kahong paglalagyan ng i-paste.", pronRec:"③ Kapag may lumabas na pangungusap, i-tap dito at sabihin ito nang malakas pagkatapos ng video.",
   tapWr:"I-tap ang {wr}.", inCopy1:"Nasa {copy} ka. Kokopyahin mo nang kamay ang isang pangungusap na Japanese.", tapCopy1:"I-tap ang {copy}. (Kokopyahin mo nang kamay ang isang pangungusap na Japanese.)",
   pasteSent:"① MAG-PASTE DITO NG ISANG PANGUNGUSAP NA JAPANESE. Maglagay ng maikling pangungusap na Japanese sa kahong ito.", orWords:"② O gamitin ang sarili mong mga salita. Magagamit din ang mga salitang na-save mo sa Vocabulary. I-tap dito para buksan.",
   folder:"③ Piliin ang folder kung saan mo na-save ang iyong mga salita.", words:"④ I-tap ang mga salitang gusto mong i-practice. Ang ☑ ay nangangahulugang napili.", useBtn:"⑤ I-tap ang button na ito. Papasok sa kahon ang iyong mga salita.",
   nowBox:"⑥ Nasa kahong ito na ang iyong mga salita. Puwede mo pa ring baguhin.", startDraw:"⑦ I-tap dito. Pagkatapos, iguhit ang bawat letra gamit ang daliri mo!",
   inQ:"Nasa {q} ka. Mag-paste ng tanong, isulat ang sagot mo sa Japanese, at susuriin ito ng GAKU. (I-tap ang {copy} para magkopya na lang ng pangungusap nang kamay.)",
   inCopy2:"Nasa {copy} ka: kopyahin nang kamay ang isang pangungusap. (I-tap ang {q} para sumagot na lang ng tanong.)", pickStyle:"Pumili ng istilo. {copy} = kopyahin nang kamay ang pangungusap. {q} = magsulat ng sagot.",
   pasteHere:"① I-PASTE DITO. Maglagay ng maikling pangungusap na Japanese sa kahong ito.", pasteQ:"① I-PASTE DITO ANG TANONG. Maglagay ng tanong mula sa test o website sa kahong ito.",
   draw:"② I-tap dito. Pagkatapos, sumulat gamit ang daliri mo!", typeAns:"② I-TYPE DITO ANG SAGOT MO, sa Japanese.", check:"③ I-tap dito. Susuriin ng GAKU ang sagot mo ayon sa tanong.",
   generic:"Nandito ka. Magsimula sa itaas ng frame na ito at pumunta pababa.", subtitles:"Gamitin ang kahon sa loob ng frame na ito para mag-paste ng subtitle, saka sundan ang mga button.",
   milestones:"Nasa frame na ito ang mga progress check mo. I-tap ang card para buksan.", jlpt:"Nasa frame na ito ang mga resulta mo sa JLPT.", feedback:"Isulat ang mensahe mo sa frame na ito at ipadala.",
   links:"I-tap ang link sa frame na ito para magbukas ng study site.", wordcards:"Maghanap ng salita sa frame na ito, saka i-tap ang salita para gumawa ng card.",
   library:"Nasa frame na ito ang mga na-save mong card. I-tap ang folder para buksan.", folderPg:"Nasa frame na ito ang mga card sa folder na ito. I-tap ang card para makita.",
   flash:"Nasa frame na ito ang mga flashcard. I-tap ang card para baliktarin.", pickWriting:"Piliin sa frame na ito kung paano mo gustong mag-practice.",
   goFlash:"Gusto mong mag-review gamit ang flashcard? I-tap ang “Go Flashcard” para simulan ang Flashcards activity.",
   tFirst:"Ang una mong minuto", tSchedule:"Iskedyul", tVocab:"Bokabularyo", tPage:"Pahinang ito", tSubtitles:"Mga subtitle", tMilestones:"Mga milestone", tFeedback:"Feedback", tLinks:"Mga link", tWordCards:"Mga word card", tLibrary:"Library", tFolder:"Folder", tFlash:"Mga flashcard"
  }
 }
};

const stripEmoji = (s) => String(s || "").replace(/^[^\p{L}\p{N}]+/u, "").trim();

// Labels for the guide card (Next / Done / Close / ...). Returns null when there is no translation (caller uses English).
export function guideLabels(lang) {
  const d = GUIDE_I18N[lang];
  return d ? d.labels : null;
}

// Translate one English guide ({title, steps}) into `lang`. `T` = UI translations, used to quote the real button names.
export function localizeGuide(enGuide, lang, T) {
  const d = GUIDE_I18N[lang];
  if (!d || !enGuide) return enGuide;
  const tok = {
    fc: stripEmoji(T && T.tabPractice) || "From Content",
    conv: stripEmoji(T && T.convTitle) || "Conversation",
    pron: stripEmoji(T && T.pronTitle) || "Pronunciation",
    wr: stripEmoji(T && T.writeTitle) || "Writing",
    copy: stripEmoji(T && T.writeModeCopy) || "Copying down",
    q: stripEmoji(T && T.writeModeQuestion) || "Questions",
  };
  const tr = (en) => {
    const k = GUIDE_KEYS[en];
    let out = k && d.s[k];
    if (!out) return en;
    Object.keys(tok).forEach(n => { out = out.split("{" + n + "}").join("“" + tok[n] + "”"); });
    return out;
  };
  return {
    ...enGuide,
    title: tr(enGuide.title),
    steps: enGuide.steps.map(st => ({
      ...st,
      ...(st.t ? { t: tr(st.t) } : {}),
      ...(st.alts ? { alts: st.alts.map(a => ({ ...a, t: tr(a.t) })) } : {}),
    })),
  };
}

export default GUIDE_I18N;

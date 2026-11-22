// Translations of the "How to use" help (SECTION_HELP), first-steps card and hint bubbles.
// English and Japanese live in GakuApp.jsx; every other UI language is here. Missing language => English.
const HELP_I18N = {
 "Spanish": {
  "labels": {
   "how": "Cómo se usa",
   "what": "¿Qué es esto?",
   "steps": "3 pasos",
   "close": "Cerrar",
   "never": "No volver a mostrar",
   "tryIntensive": "Probar Intensive Mode"
  },
  "firstSteps": {
   "title": "Tus primeros pasos",
   "sub": "Solo toma unos 3 minutos",
   "profile": "Configura tu perfil",
   "content": "Prueba Create From Content (1 min)",
   "word": "Guarda tu primera palabra",
   "go": "Ir →",
   "allDone": "🎉 ¡Buen comienzo! Terminaste tus primeros pasos.",
   "ok": "OK",
   "hide": "Ocultar",
   "progress": "{n} / {m} listo"
  },
  "hints": {
   "vocab_search": "Escribe una palabra y búscala — luego guárdala en tu Library.",
   "content_sample": "Te pusimos un texto de ejemplo. Solo toca el botón de abajo — o pega el tuyo.",
   "content_analyze": "Toca aquí — tus primeras actividades estarán listas en aproximadamente un minuto."
  },
  "sections": {
   "schedule": {
    "title": "Horario",
    "what": "Tu plan de estudio semanal personal. Se crea una sola vez para ti y no cambia, a menos que toques \"Update my study guide\" en Edit Profile.",
    "steps": [
     "Abre las tareas de hoy y hazlas en orden.",
     "Toca el enlace de una tarea o el botón \"Go to…\" para abrir la herramienta correcta.",
     "Marca la casilla cuando termines — tu racha y tu progreso suben."
    ],
    "example": "Ejemplo: \"Lee una escena de manga\" → toca el enlace → vuelve → márcala.",
    "intensive": "En la parte de arriba de esta pantalla, Intensive Mode muestra una meta diaria (8 acciones al día) y te avisa si vas atrasado. También mira tus últimos 14 días de estudio y te sugiere las áreas donde cometes más errores, para que sepas qué practicar hoy."
   },
   "vocabulary": {
    "title": "Vocabulario",
    "what": "Busca cualquier palabra y guárdala en tus propias carpetas (Library) para repasarla después.",
    "steps": [
     "Escribe una palabra en inglés o japonés y búscala.",
     "Toca Save y elige una carpeta.",
     "Abre la Library para repasar con Flashcards o escuchar la pronunciación."
    ],
    "example": "Ejemplo: busca \"階段\" → Save → repásala en tu carpeta \"Vida diaria\"."
   },
   "subtitles": {
    "title": "Subtítulos",
    "what": "Guarda palabras y frases de los videos que ves, para estudiarlas más tarde.",
    "steps": [
     "Pega una línea de subtítulo o una palabra del video.",
     "Guárdala en tu lista.",
     "Vuelve para repasar las líneas que guardaste."
    ],
    "example": "Ejemplo: pega una línea de un episodio de anime → guárdala → repásala mañana."
   },
   "milestones": {
    "title": "Hitos",
    "what": "Tu mapa de metas y tu control de progreso, para ver cuánto has avanzado.",
    "steps": [
     "Lee los pasos de tu mapa para tu meta.",
     "Usa el control de progreso para ver cómo vas.",
     "Mantén tu racha para seguir avanzando."
    ],
    "example": "Ejemplo: termina las tareas de esta semana para llegar al siguiente hito."
   },
   "jlpt": {
    "title": "Resultados del JLPT",
    "what": "Aquí aparece el resultado de tu diagnóstico del JLPT enviado por tu profesor.",
    "steps": [
     "Espera a que tu profesor te envíe el resultado.",
     "Abre esta pestaña para verlo.",
     "Toca Download PDF para guardarlo."
    ],
    "example": "Ejemplo: después de tu examen de práctica, el informe con tu resultado aparece aquí."
   },
   "feedback": {
    "title": "Comentarios",
    "what": "Cuéntanos qué mejorar en GAKU Master.",
    "steps": [
     "Escribe tu idea o problema.",
     "Toca Send.",
     "Por favor, sé amable — no se aceptan mensajes ofensivos."
    ],
    "example": "Ejemplo: \"Por favor, agreguen más preguntas de gramática N4.\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "Busca cualquier palabra y abre su tarjeta: significado, lectura y oraciones de ejemplo.",
    "steps": [
     "Escribe una palabra en inglés o japonés (o un tema) y toca Search.",
     "Toca un resultado para abrir su tarjeta.",
     "Guárdala en una carpeta para repasarla después."
    ],
    "example": "Ejemplo: busca \"階段\" → abre la tarjeta → Save en tu carpeta \"Vida diaria\"."
   },
   "vocab_library": {
    "title": "Library",
    "what": "Todas las palabras que guardaste, ordenadas en carpetas.",
    "steps": [
     "Toca una carpeta para ver las tarjetas de palabras que contiene.",
     "Toca 🔊 ▶ en una carpeta para escuchar todas sus palabras una tras otra.",
     "Toca \"Quick review with Flashcards\" para practicar tus palabras."
    ],
    "example": "Consejo: crea tus propias carpetas con \"New folder\" (por ejemplo, una carpeta para cada clase)."
   },
   "vocab_folder": {
    "title": "Tarjetas de palabras de esta carpeta",
    "what": "Cada recuadro de abajo es una tarjeta de palabra: una palabra que guardaste.",
    "steps": [
     "Toca una tarjeta para abrirla: significado, lectura y oraciones de ejemplo.",
     "Toca 🔊 para escuchar la palabra. Toca 🔊 ▶ All (arriba a la derecha) para escuchar todas las palabras de esta carpeta.",
     "Toca Go Flashcard para practicar solo esa palabra. Toca el bote de basura para borrar la tarjeta."
    ],
    "example": "Consejo: \"📋 Copy to folder\" copia palabras a otra carpeta (por ejemplo, la carpeta de tu próxima clase)."
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "Practica tus palabras guardadas como con tarjetas de papel. Toca la tarjeta para voltearla y ver la respuesta.",
    "steps": [
     "Mira la palabra e intenta recordar el significado. Toca Hint si necesitas la lectura, y luego toca la tarjeta para ver la respuesta.",
     "Si la sabías, toca ✅ Understand. La palabra pasa a la carpeta \"Understood\", así puedes repasar solo las palabras que aún no sabes. Sigue guardada en tu Library — no se pierde nada.",
     "Si no la sabías, no toques nada. Solo toca → para la siguiente tarjeta; se queda en tu mazo."
    ],
    "example": "Intensive Mode registra qué tan rápido volteas cada tarjeta y cuántas veces tocas Understand, y lo usa para mostrar qué palabras realmente sabes y cuáles no.",
    "action": "Probar Intensive Mode"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "Copia japonés un carácter a la vez, dibujando cada trazo con el dedo o el mouse. GAKU revisa el orden y la forma de tus trazos.",
    "steps": [
     "Pega una oración en japonés en el cuadro, o toca \"Choose words from your Library\" para usar palabras que guardaste.",
     "Toca \"Start writing\".",
     "Escribe cada carácter, un trazo a la vez."
    ],
    "example": "Consejo: se practican hasta 30 caracteres a la vez."
   },
   "res_writing_copy_write": {
    "title": "Escribir un carácter a la vez",
    "what": "Escribes, un carácter a la vez, el texto que pegaste o las palabras que elegiste de tu Library.",
    "steps": [
     "Escribe el carácter un trazo a la vez, en el orden correcto. GAKU te avisa cuando un trazo está mal.",
     "¿No sabes cómo escribirlo? Toca ▶ Watch stroke order. ¿Quieres intentarlo otra vez? Toca ↺ Try again.",
     "Cuando termines un carácter, toca el botón azul Next ▶. En el último carácter dice Finish."
    ],
    "notes": [
     "La guía es el contorno gris tenue del carácter. Con 👁 Show guide puedes trazar encima; con 🙈 Hide guide escribes de memoria.",
     "Un texto nuevo te lleva a la pantalla anterior, donde eliges nuevas palabras, caracteres o una oración."
    ],
    "example": "Intensive Mode mide tu escritura con más precisión y analiza los caracteres, palabras y oraciones que te cuestan.",
    "action": "Probar Intensive Mode"
   },
   "res_links": {
    "title": "Resources",
    "what": "Sitios web, videos y apps elegidos a mano para tu nivel y tus habilidades.",
    "steps": [
     "Mira las tarjetas de abajo (cada tarjeta es un video o un sitio web). Están elegidas según tu nivel.",
     "Toca el botón Open en una tarjeta que te guste.",
     "Usa GAKU Reader en esa página para buscar las palabras que no conoces."
    ],
    "example": "Ejemplo: abre un sitio de lectura recomendado y lee una página corta."
   },
   "res_content": {
    "title": "Create From Content",
    "what": "Pega cualquier texto en japonés que estés leyendo o viendo, y GAKU lo convierte en preguntas de práctica.",
    "steps": [
     "Pega un texto en japonés (un artículo, subtítulos, un mensaje).",
     "Toca Analyze para crear preguntas.",
     "Respóndelas, y activa furigana / romaji / traducción si necesitas ayuda."
    ],
    "example": "Ejemplo: pega un aviso de un apartamento → obtén preguntas de significado, kanji y gramática."
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "Reproduce un video real cerca de tu micrófono. GAKU escucha, muestra las frases reales y te ayuda a responder.",
    "steps": [
     "Toca el botón de escuchar y reproduce un video en japonés con sonido.",
     "Cada línea que escuchas se convierte en una tarjeta. Si GAKU no pudo captar una línea, te pedirá que escuches otra vez — por favor, vuelve a reproducir el video o el audio que estabas escuchando.",
     "Toca \"How would you respond?\" para practicar una respuesta natural."
    ],
    "example": "Ejemplo: reproduce una conversación de YouTube → elige la mejor respuesta entre 4 opciones.",
    "intensive": "Cuando dices tu respuesta en voz alta, GAKU revisa tu japonés. Intensive Mode registra si cada respuesta hablada fue correcta y qué tipo de error cometiste (partículas, formas verbales, elección de palabras, orden de las palabras u ortografía), además de las palabras que fallas varias veces. Luego te sugiere en qué concentrarte hoy."
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "Lee japonés en voz alta (o escucha y repite) y mira qué tan cerca estuvo tu pronunciación.",
    "steps": [
     "Pega un texto en japonés para obtener frases.",
     "Escucha, y luego grábate diciéndolo.",
     "Revisa tu resultado e inténtalo de nuevo."
    ],
    "example": "Ejemplo: pega una línea corta de una canción → dila → mira tu puntaje.",
    "intensive": "Intensive Mode registra el resultado de cada intento de pronunciación (y tu puntaje), para encontrar las frases que sigues fallando y sugerírtelas como práctica extra."
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "Practica escribir en japonés copiando texto o respondiendo preguntas.",
    "steps": [
     "Elige un modo (Copying down o Questions).",
     "Elige un texto, o escoge palabras de tu Library.",
     "Escribe tu respuesta y revísala."
    ],
    "example": "Ejemplo: copia 3 oraciones de una escena de manga y luego revisa lo que escribiste.",
    "intensive": "Intensive Mode mide con más cuidado la precisión de tu escritura. En Copying down, registra cada carácter y cada trazo. En el modo Questions, GAKU revisa tu respuesta y registra el tipo de error (partículas, formas verbales, elección de palabras, orden de las palabras u ortografía) y las palabras incorrectas. Luego te señala qué errores cometes más y qué practicar hoy."
   }
  }
 },
 "French": {
  "labels": {
   "how": "Comment l'utiliser",
   "what": "C'est quoi ?",
   "steps": "3 étapes",
   "close": "Fermer",
   "never": "Ne plus afficher",
   "tryIntensive": "Essayer Intensive Mode"
  },
  "firstSteps": {
   "title": "Tes premiers pas",
   "sub": "Prend environ 3 minutes",
   "profile": "Configure ton profil",
   "content": "Essaie Create From Content (1 min)",
   "word": "Enregistre ton premier mot",
   "go": "Aller →",
   "allDone": "🎉 Beau début ! Tu as terminé tes premiers pas.",
   "ok": "OK",
   "hide": "Masquer",
   "progress": "{n} / {m} terminé"
  },
  "hints": {
   "vocab_search": "Tape un mot et lance la recherche — puis enregistre-le dans ta Library.",
   "content_sample": "Nous avons ajouté un texte d'exemple pour toi. Appuie simplement sur le bouton ci-dessous — ou colle ton propre texte.",
   "content_analyze": "Appuie ici — tes premières activités seront prêtes dans environ une minute."
  },
  "sections": {
   "schedule": {
    "title": "Planning",
    "what": "Ton plan d'étude hebdomadaire personnel. Il est créé une seule fois pour toi et ne change jamais, sauf si tu appuies sur \"Update my study guide\" dans Edit Profile.",
    "steps": [
     "Ouvre les tâches du jour et fais-les dans l'ordre.",
     "Appuie sur le lien d'une tâche ou sur le bouton \"Go to…\" pour ouvrir le bon outil.",
     "Coche la case quand tu as fini — ta série et ta progression augmentent."
    ],
    "example": "Exemple : \"Lis une scène de manga\" → appuie sur le lien → reviens → coche la tâche.",
    "intensive": "En haut de cet écran, Intensive Mode affiche un objectif quotidien (8 actions par jour) et te prévient si tu as du retard. Il regarde aussi tes 14 derniers jours d'étude et te suggère les domaines où tu fais le plus d'erreurs, pour que tu saches quoi pratiquer aujourd'hui."
   },
   "vocabulary": {
    "title": "Vocabulaire",
    "what": "Cherche n'importe quel mot et enregistre-le dans tes propres dossiers (Library) pour le réviser plus tard.",
    "steps": [
     "Tape un mot en anglais ou en japonais et lance la recherche.",
     "Appuie sur Save et choisis un dossier.",
     "Ouvre la Library pour réviser avec les Flashcards ou écouter la prononciation."
    ],
    "example": "Exemple : cherche \"階段\" → Save → révise-le dans ton dossier \"Vie quotidienne\"."
   },
   "subtitles": {
    "title": "Sous-titres",
    "what": "Enregistre des mots et des phrases des vidéos que tu regardes, pour les étudier plus tard.",
    "steps": [
     "Colle une ligne de sous-titre ou un mot de la vidéo.",
     "Enregistre-la dans ta liste.",
     "Reviens réviser les lignes que tu as enregistrées."
    ],
    "example": "Exemple : colle une phrase d'un épisode d'anime → enregistre-la → révise-la demain."
   },
   "milestones": {
    "title": "Étapes clés",
    "what": "Ta feuille de route et ton bilan de progression, pour voir le chemin parcouru.",
    "steps": [
     "Lis les étapes de ta feuille de route pour ton objectif.",
     "Utilise le bilan de progression pour voir où tu en es.",
     "Garde ta série en cours pour avancer."
    ],
    "example": "Exemple : termine les tâches de cette semaine pour atteindre l'étape suivante."
   },
   "jlpt": {
    "title": "Résultats du JLPT",
    "what": "Le résultat de ton diagnostic JLPT envoyé par ton professeur apparaît ici.",
    "steps": [
     "Attends que ton professeur t'envoie ton résultat.",
     "Ouvre cet onglet pour le voir.",
     "Appuie sur Download PDF pour l'enregistrer."
    ],
    "example": "Exemple : après ton test blanc, ton rapport de résultat apparaît ici."
   },
   "feedback": {
    "title": "Commentaires",
    "what": "Dis-nous ce qu'il faut améliorer dans GAKU Master.",
    "steps": [
     "Écris ton idée ou ton problème.",
     "Appuie sur Send.",
     "Sois gentil, s'il te plaît — les messages injurieux ne sont pas acceptés."
    ],
    "example": "Exemple : \"Ajoutez plus de questions de grammaire N4, s'il vous plaît.\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "Cherche n'importe quel mot et ouvre sa fiche : sens, lecture et phrases d'exemple.",
    "steps": [
     "Tape un mot en anglais ou en japonais (ou un thème) et appuie sur Search.",
     "Appuie sur un résultat pour ouvrir sa fiche.",
     "Enregistre-le dans un dossier pour le réviser plus tard."
    ],
    "example": "Exemple : cherche \"階段\" → ouvre la fiche → Save dans ton dossier \"Vie quotidienne\"."
   },
   "vocab_library": {
    "title": "Library",
    "what": "Tous les mots que tu as enregistrés, classés dans des dossiers.",
    "steps": [
     "Appuie sur un dossier pour voir les fiches de mots qu'il contient.",
     "Appuie sur 🔊 ▶ sur un dossier pour écouter tous ses mots l'un après l'autre.",
     "Appuie sur \"Quick review with Flashcards\" pour t'entraîner avec tes mots."
    ],
    "example": "Astuce : crée tes propres dossiers avec \"New folder\" (par exemple, un dossier pour chaque cours)."
   },
   "vocab_folder": {
    "title": "Fiches de mots de ce dossier",
    "what": "Chaque case ci-dessous est une fiche de mot : un mot que tu as enregistré.",
    "steps": [
     "Appuie sur une fiche pour l'ouvrir : sens, lecture et phrases d'exemple.",
     "Appuie sur 🔊 pour écouter le mot. Appuie sur 🔊 ▶ All (en haut à droite) pour écouter tous les mots de ce dossier.",
     "Appuie sur Go Flashcard pour t'entraîner seulement avec ce mot. Appuie sur la corbeille pour supprimer la fiche."
    ],
    "example": "Astuce : \"📋 Copy to folder\" copie des mots dans un autre dossier (par exemple, le dossier de ton prochain cours)."
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "Entraîne-toi avec tes mots enregistrés comme avec des cartes en papier. Appuie sur la carte pour la retourner et vérifier la réponse.",
    "steps": [
     "Regarde le mot et essaie de te souvenir du sens. Appuie sur Hint si tu as besoin de la lecture, puis appuie sur la carte pour voir la réponse.",
     "Si tu le connaissais, appuie sur ✅ Understand. Le mot passe dans le dossier \"Understood\", pour que tu puisses réviser seulement les mots que tu ne connais pas encore. Il reste enregistré dans ta Library — rien n'est perdu.",
     "Si tu ne le connaissais pas, n'appuie sur rien. Appuie simplement sur → pour la carte suivante ; elle reste dans ton paquet."
    ],
    "example": "Intensive Mode enregistre la vitesse à laquelle tu retournes chaque carte et combien de fois tu appuies sur Understand, puis s'en sert pour montrer quels mots tu connais vraiment et lesquels tu ne connais pas.",
    "action": "Essayer Intensive Mode"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "Copie le japonais caractère par caractère, en dessinant chaque trait avec ton doigt ou ta souris. GAKU vérifie l'ordre et la forme de tes traits.",
    "steps": [
     "Colle une phrase en japonais dans la zone, ou appuie sur \"Choose words from your Library\" pour utiliser les mots que tu as enregistrés.",
     "Appuie sur \"Start writing\".",
     "Écris chaque caractère, un trait à la fois."
    ],
    "example": "Astuce : jusqu'à 30 caractères sont travaillés à la fois."
   },
   "res_writing_copy_write": {
    "title": "Écrire un caractère à la fois",
    "what": "Tu écris, un caractère à la fois, le texte que tu as collé ou les mots que tu as choisis dans ta Library.",
    "steps": [
     "Écris le caractère un trait à la fois, dans le bon ordre. GAKU te prévient quand un trait est faux.",
     "Tu ne sais pas comment l'écrire ? Appuie sur ▶ Watch stroke order. Tu veux réessayer ? Appuie sur ↺ Try again.",
     "Quand tu as fini un caractère, appuie sur le bouton bleu Next ▶. Pour le dernier caractère, il indique Finish."
    ],
    "notes": [
     "Le guide est le contour gris clair du caractère. Avec 👁 Show guide, tu peux repasser dessus ; avec 🙈 Hide guide, tu écris de mémoire.",
     "Un nouveau texte te ramène à l'écran précédent, où tu choisis de nouveaux mots, caractères ou une phrase."
    ],
    "example": "Intensive Mode mesure ton écriture plus précisément et analyse les caractères, les mots et les phrases que tu trouves difficiles.",
    "action": "Essayer Intensive Mode"
   },
   "res_links": {
    "title": "Resources",
    "what": "Des sites web, des vidéos et des applis choisis pour ton niveau et tes compétences.",
    "steps": [
     "Regarde les cartes ci-dessous (chaque carte est une vidéo ou un site web). Elles sont choisies selon ton niveau.",
     "Appuie sur le bouton Open d'une carte qui te plaît.",
     "Utilise GAKU Reader sur cette page pour chercher les mots que tu ne connais pas."
    ],
    "example": "Exemple : ouvre un site de lecture recommandé et lis une courte page."
   },
   "res_content": {
    "title": "Create From Content",
    "what": "Colle n'importe quel texte japonais que tu lis ou regardes, et GAKU le transforme en questions d'entraînement.",
    "steps": [
     "Colle un texte japonais (un article, des sous-titres, un message).",
     "Appuie sur Analyze pour créer des questions.",
     "Réponds-y, et active furigana / romaji / traduction si tu as besoin d'aide."
    ],
    "example": "Exemple : colle une annonce d'appartement → obtiens des questions de sens, de kanji et de grammaire."
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "Joue une vraie vidéo près de ton micro. GAKU écoute, affiche les vraies phrases et t'aide à répondre.",
    "steps": [
     "Appuie sur le bouton d'écoute et joue une vidéo japonaise avec le son.",
     "Chaque phrase entendue devient une carte. Si GAKU n'a pas pu comprendre une phrase, il te demandera d'écouter à nouveau — rejoue alors la vidéo ou l'audio que tu écoutais.",
     "Appuie sur \"How would you respond?\" pour t'entraîner à donner une réponse naturelle."
    ],
    "example": "Exemple : joue une conversation YouTube → choisis la meilleure réponse parmi 4 choix.",
    "intensive": "Quand tu dis ta réponse à voix haute, GAKU vérifie ton japonais. Intensive Mode enregistre si chaque réponse orale était correcte et quel type d'erreur tu as faite (particules, formes verbales, choix des mots, ordre des mots ou orthographe), ainsi que les mots faux répétés. Il te suggère ensuite sur quoi te concentrer aujourd'hui."
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "Lis le japonais à voix haute (ou écoute et répète) et vois à quel point ta prononciation était proche.",
    "steps": [
     "Colle un texte japonais pour obtenir des phrases.",
     "Écoute, puis enregistre-toi en train de le dire.",
     "Regarde ton résultat et réessaie."
    ],
    "example": "Exemple : colle une courte ligne de chanson → dis-la → vois ton score.",
    "intensive": "Intensive Mode enregistre le résultat de chaque essai de prononciation (et ton score), pour trouver les phrases que tu rates sans cesse et te les suggérer comme entraînement supplémentaire."
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "Entraîne-toi à écrire le japonais en copiant un texte ou en répondant à des questions.",
    "steps": [
     "Choisis un mode (Copying down ou Questions).",
     "Choisis un texte, ou sélectionne des mots de ta Library.",
     "Tape ta réponse et vérifie-la."
    ],
    "example": "Exemple : copie 3 phrases d'une scène de manga, puis vérifie ce que tu as tapé.",
    "intensive": "Intensive Mode mesure plus précisément ta précision d'écriture. En Copying down, il enregistre chaque caractère et chaque trait. En mode Questions, GAKU vérifie ta réponse et enregistre le type d'erreur (particules, formes verbales, choix des mots, ordre des mots ou orthographe) et les mots faux. Il te montre ensuite quelles erreurs tu fais le plus souvent et quoi pratiquer aujourd'hui."
   }
  }
 },
 "German": {
  "labels": {
   "how": "So benutzt du es",
   "what": "Was ist das?",
   "steps": "3 Schritte",
   "close": "Schließen",
   "never": "Nicht mehr anzeigen",
   "tryIntensive": "Intensive Mode ausprobieren"
  },
  "firstSteps": {
   "title": "Deine ersten Schritte",
   "sub": "Dauert etwa 3 Minuten",
   "profile": "Richte dein Profil ein",
   "content": "Probiere Create From Content aus (1 Min.)",
   "word": "Speichere dein erstes Wort",
   "go": "Los →",
   "allDone": "🎉 Toller Start! Du hast deine ersten Schritte geschafft.",
   "ok": "OK",
   "hide": "Ausblenden",
   "progress": "{n} / {m} erledigt"
  },
  "hints": {
   "vocab_search": "Gib ein Wort ein und such danach — speichere es dann in deiner Library.",
   "content_sample": "Wir haben einen Beispieltext für dich eingefügt. Tippe einfach auf den Button unten — oder füge deinen eigenen Text ein.",
   "content_analyze": "Tippe hier — deine ersten Aktivitäten sind in etwa einer Minute fertig."
  },
  "sections": {
   "schedule": {
    "title": "Zeitplan",
    "what": "Dein persönlicher wöchentlicher Lernplan. Er wird einmal für dich erstellt und ändert sich nie, außer du tippst in Edit Profile auf \"Update my study guide\".",
    "steps": [
     "Öffne die heutigen Aufgaben und erledige sie der Reihe nach.",
     "Tippe auf den Link einer Aufgabe oder auf den Button \"Go to…\", um das passende Werkzeug zu öffnen.",
     "Hake das Kästchen ab, wenn du fertig bist — deine Serie und dein Fortschritt steigen."
    ],
    "example": "Beispiel: \"Lies eine Manga-Szene\" → tippe auf den Link → komm zurück → hake sie ab.",
    "intensive": "Oben auf diesem Bildschirm zeigt Intensive Mode ein Tagesziel (8 Aktionen pro Tag) und warnt dich, wenn du im Rückstand bist. Außerdem schaut er sich deine letzten 14 Lerntage an und schlägt dir die Bereiche vor, in denen du die meisten Fehler machst, damit du weißt, was du heute üben sollst."
   },
   "vocabulary": {
    "title": "Vokabeln",
    "what": "Such ein beliebiges Wort und speichere es in deinen eigenen Ordnern (Library), um es später zu wiederholen.",
    "steps": [
     "Gib ein Wort auf Englisch oder Japanisch ein und such danach.",
     "Tippe auf Save und wähle einen Ordner.",
     "Öffne die Library, um mit Flashcards zu wiederholen oder dir die Aussprache anzuhören."
    ],
    "example": "Beispiel: such nach \"階段\" → Save → wiederhole es in deinem Ordner \"Alltag\"."
   },
   "subtitles": {
    "title": "Untertitel",
    "what": "Speichere Wörter und Sätze aus Videos, die du schaust, um sie später zu lernen.",
    "steps": [
     "Füge eine Untertitelzeile oder ein Wort aus dem Video ein.",
     "Speichere sie in deiner Liste.",
     "Komm zurück, um die gespeicherten Zeilen zu wiederholen."
    ],
    "example": "Beispiel: füge eine Zeile aus einer Anime-Folge ein → speichere sie → wiederhole sie morgen."
   },
   "milestones": {
    "title": "Meilensteine",
    "what": "Deine Ziel-Roadmap und dein Fortschrittscheck, damit du siehst, wie weit du schon gekommen bist.",
    "steps": [
     "Lies die Schritte deiner Roadmap für dein Ziel.",
     "Nutze den Fortschrittscheck, um zu sehen, wo du stehst.",
     "Halte deine Serie am Laufen, um voranzukommen."
    ],
    "example": "Beispiel: erledige die Aufgaben dieser Woche, um den nächsten Meilenstein zu erreichen."
   },
   "jlpt": {
    "title": "JLPT-Ergebnisse",
    "what": "Dein JLPT-Diagnoseergebnis, das dein Lehrer geschickt hat, erscheint hier.",
    "steps": [
     "Warte, bis dein Lehrer dir dein Ergebnis schickt.",
     "Öffne diesen Tab, um es zu sehen.",
     "Tippe auf Download PDF, um es zu speichern."
    ],
    "example": "Beispiel: nach deinem Probetest erscheint dein Ergebnisbericht hier."
   },
   "feedback": {
    "title": "Feedback",
    "what": "Sag uns, was wir in GAKU Master verbessern sollen.",
    "steps": [
     "Schreibe deine Idee oder dein Problem auf.",
     "Tippe auf Send.",
     "Bitte sei freundlich — beleidigende Nachrichten werden nicht angenommen."
    ],
    "example": "Beispiel: \"Bitte fügt mehr N4-Grammatikfragen hinzu.\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "Such ein beliebiges Wort und öffne seine Wortkarte — Bedeutung, Lesung und Beispielsätze.",
    "steps": [
     "Gib ein englisches oder japanisches Wort (oder ein Thema) ein und tippe auf Search.",
     "Tippe auf ein Ergebnis, um die Karte zu öffnen.",
     "Speichere sie in einem Ordner, damit du sie später wiederholen kannst."
    ],
    "example": "Beispiel: such nach \"階段\" → öffne die Karte → Save in deinem Ordner \"Alltag\"."
   },
   "vocab_library": {
    "title": "Library",
    "what": "Alle Wörter, die du gespeichert hast, in Ordnern sortiert.",
    "steps": [
     "Tippe auf einen Ordner, um die Wortkarten darin zu sehen.",
     "Tippe bei einem Ordner auf 🔊 ▶, um alle Wörter nacheinander anzuhören.",
     "Tippe auf \"Quick review with Flashcards\", um deine Wörter zu üben."
    ],
    "example": "Tipp: Erstelle eigene Ordner mit \"New folder\" (zum Beispiel einen Ordner für jede Unterrichtsstunde)."
   },
   "vocab_folder": {
    "title": "Wortkarten in diesem Ordner",
    "what": "Jedes Feld unten ist eine Wortkarte — ein Wort, das du gespeichert hast.",
    "steps": [
     "Tippe auf eine Wortkarte, um sie zu öffnen: Bedeutung, Lesung und Beispielsätze.",
     "Tippe auf 🔊, um das Wort zu hören. Tippe auf 🔊 ▶ All (oben rechts), um alle Wörter in diesem Ordner zu hören.",
     "Tippe auf Go Flashcard, um nur dieses Wort zu üben. Tippe auf den Mülleimer, um die Karte zu löschen."
    ],
    "example": "Tipp: \"📋 Copy to folder\" kopiert Wörter in einen anderen Ordner (zum Beispiel in den Ordner deiner nächsten Stunde)."
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "Übe deine gespeicherten Wörter wie mit Karteikarten aus Papier. Tippe auf die Karte, um sie umzudrehen und die Antwort zu prüfen.",
    "steps": [
     "Sieh dir das Wort an und versuche, dich an die Bedeutung zu erinnern. Tippe auf Hint, wenn du die Lesung brauchst, und tippe dann auf die Karte, um die Antwort zu sehen.",
     "Wenn du es gewusst hast, tippe auf ✅ Understand. Das Wort wandert in den Ordner \"Understood\", sodass du nur die Wörter wiederholen kannst, die du noch nicht kennst. Es bleibt in deiner Library gespeichert — nichts geht verloren.",
     "Wenn du es nicht gewusst hast, tippe auf nichts. Tippe einfach auf → für die nächste Karte; sie bleibt in deinem Stapel."
    ],
    "example": "Intensive Mode zeichnet auf, wie schnell du jede Karte umdrehst und wie oft du auf Understand tippst, und nutzt das, um zu zeigen, welche Wörter du wirklich kennst und welche nicht.",
    "action": "Intensive Mode ausprobieren"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "Schreibe Japanisch Zeichen für Zeichen ab und zeichne jeden Strich mit dem Finger oder der Maus. GAKU prüft deine Strichreihenfolge und Form.",
    "steps": [
     "Füge einen japanischen Satz in das Feld ein oder tippe auf \"Choose words from your Library\", um gespeicherte Wörter zu verwenden.",
     "Tippe auf \"Start writing\".",
     "Schreibe jedes Zeichen, einen Strich nach dem anderen."
    ],
    "example": "Tipp: Es werden bis zu 30 Zeichen auf einmal geübt."
   },
   "res_writing_copy_write": {
    "title": "Ein Zeichen nach dem anderen schreiben",
    "what": "Du schreibst, Zeichen für Zeichen, den Text, den du eingefügt hast, oder die Wörter, die du aus deiner Library gewählt hast.",
    "steps": [
     "Schreibe das Zeichen Strich für Strich in der richtigen Reihenfolge. GAKU sagt dir, wenn ein Strich falsch ist.",
     "Du weißt nicht, wie man es schreibt? Tippe auf ▶ Watch stroke order. Du möchtest es noch einmal versuchen? Tippe auf ↺ Try again.",
     "Wenn du ein Zeichen fertig hast, tippe auf den blauen Button Next ▶. Beim letzten Zeichen steht dort Finish."
    ],
    "notes": [
     "Die Hilfe ist die blasse graue Umrisslinie des Zeichens. Mit 👁 Show guide kannst du darüber nachzeichnen; mit 🙈 Hide guide schreibst du aus dem Gedächtnis.",
     "Ein neuer Text bringt dich zurück zum vorherigen Bildschirm, wo du neue Wörter, Zeichen oder einen Satz auswählst."
    ],
    "example": "Intensive Mode misst dein Schreiben genauer und analysiert die Zeichen, Wörter und Sätze, die dir schwerfallen.",
    "action": "Intensive Mode ausprobieren"
   },
   "res_links": {
    "title": "Resources",
    "what": "Handverlesene Websites, Videos und Apps für dein Niveau und deine Fähigkeiten.",
    "steps": [
     "Sieh dir die Karten unten an (jede Karte ist ein Video oder eine Website). Sie sind passend zu deinem Niveau ausgewählt.",
     "Tippe bei einer Karte, die dir gefällt, auf den Button Open.",
     "Nutze GAKU Reader auf dieser Seite, um Wörter nachzuschlagen, die du nicht kennst."
    ],
    "example": "Beispiel: öffne eine empfohlene Leseseite und lies eine kurze Seite."
   },
   "res_content": {
    "title": "Create From Content",
    "what": "Füge ein beliebiges japanisches Material ein, das du liest oder schaust, und GAKU macht daraus Übungsfragen.",
    "steps": [
     "Füge einen japanischen Text ein (einen Artikel, Untertitel, eine Nachricht).",
     "Tippe auf Analyze, um Fragen zu erstellen.",
     "Beantworte sie, und schalte furigana / romaji / Übersetzung ein, wenn du Hilfe brauchst."
    ],
    "example": "Beispiel: füge eine Wohnungsmitteilung ein → erhalte Fragen zu Bedeutung, Kanji und Grammatik."
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "Spiele ein echtes Video in der Nähe deines Mikrofons ab. GAKU hört zu, zeigt die echten Sätze und hilft dir bei der Antwort.",
    "steps": [
     "Tippe auf den Zuhören-Button und spiele ein japanisches Video mit Ton ab.",
     "Jeder Satz, den du hörst, wird zu einer Karte. Wenn GAKU einen Satz nicht verstehen konnte, bittet es dich, noch einmal zuzuhören — bitte spiele das Video oder Audio, das du gehört hast, erneut ab.",
     "Tippe auf \"How would you respond?\", um eine natürliche Antwort zu üben."
    ],
    "example": "Beispiel: spiele ein YouTube-Gespräch ab → wähle die beste Antwort aus 4 Optionen.",
    "intensive": "Wenn du deine Antwort sprichst, prüft GAKU dein Japanisch. Intensive Mode zeichnet auf, ob jede gesprochene Antwort richtig war und welche Art von Fehler du gemacht hast (Partikeln, Verbformen, Wortwahl, Wortreihenfolge oder Rechtschreibung), sowie wiederholt falsche Wörter. Dann schlägt er vor, worauf du dich heute konzentrieren sollst."
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "Lies Japanisch laut vor (oder höre zu und sprich nach) und sieh, wie nah dein Sprechen dran war.",
    "steps": [
     "Füge einen japanischen Text ein, um Sätze zu bekommen.",
     "Hör zu und nimm dich dann beim Sprechen auf.",
     "Sieh dir dein Ergebnis an und versuche es noch einmal."
    ],
    "example": "Beispiel: füge eine kurze Liedzeile ein → sprich sie → sieh deine Punktzahl.",
    "intensive": "Intensive Mode zeichnet das Ergebnis jedes Aussprache-Versuchs (und deine Punktzahl) auf, damit er die Sätze findet, die du immer wieder falsch sprichst, und sie dir zum zusätzlichen Üben vorschlägt."
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "Übe das Schreiben von Japanisch, indem du Text abschreibst oder Fragen beantwortest.",
    "steps": [
     "Wähle einen Modus (Copying down oder Questions).",
     "Wähle einen Text oder wähle Wörter aus deiner Library.",
     "Tippe deine Antwort ein und prüfe sie."
    ],
    "example": "Beispiel: schreibe 3 Sätze aus einer Manga-Szene ab und prüfe dann deine Eingabe.",
    "intensive": "Intensive Mode misst deine Schreibgenauigkeit sorgfältiger. In Copying down zeichnet er jedes Zeichen und jeden Strich auf. Im Questions-Modus prüft GAKU deine Antwort und zeichnet die Art des Fehlers (Partikeln, Verbformen, Wortwahl, Wortreihenfolge oder Rechtschreibung) und die falschen Wörter auf. Dann zeigt er dir, welche Fehler du am häufigsten machst und was du heute üben sollst."
   }
  }
 },
 "Chinese (Simplified)": {
  "labels": {
   "how": "使用方法",
   "what": "这是什么?",
   "steps": "3个步骤",
   "close": "关闭",
   "never": "不再显示",
   "tryIntensive": "试试 Intensive Mode"
  },
  "firstSteps": {
   "title": "你的第一步",
   "sub": "大约只需3分钟",
   "profile": "设置你的个人资料",
   "content": "试试 Create From Content(1分钟)",
   "word": "保存你的第一个单词",
   "go": "前往 →",
   "allDone": "🎉 开了个好头!你已完成第一步。",
   "ok": "OK",
   "hide": "隐藏",
   "progress": "已完成 {n} / {m}"
  },
  "hints": {
   "vocab_search": "输入一个单词并搜索,然后把它保存到你的 Library。",
   "content_sample": "我们为你准备了一段示例文本。直接点下面的按钮就可以,也可以粘贴你自己的文本。",
   "content_analyze": "点这里,大约一分钟后就会准备好你的第一批练习。"
  },
  "sections": {
   "schedule": {
    "title": "日程表",
    "what": "你专属的每周学习计划。它只会为你制作一次,除非你在 Edit Profile 里点击 \"Update my study guide\",否则不会改变。",
    "steps": [
     "打开今天的任务,按顺序完成。",
     "点任务的链接或 \"Go to…\" 按钮,打开对应的工具。",
     "完成后勾选方框,你的连续学习天数和进度就会增加。"
    ],
    "example": "例如:\"Read a manga scene\" → 点链接 → 回来 → 勾选。",
    "intensive": "在这个画面的顶部,Intensive Mode 会显示每日目标(每天8个动作),落后时会提醒你。它还会查看你最近14天的学习情况,指出你错得最多的方面,让你知道今天该练什么。"
   },
   "vocabulary": {
    "title": "单词",
    "what": "查询任何单词,并保存到你自己的文件夹(Library)里,以后复习。",
    "steps": [
     "输入英语或日语单词并搜索。",
     "点 Save,然后选择一个文件夹。",
     "打开 Library,用 flashcards 复习,或听发音。"
    ],
    "example": "例如:搜索 \"階段\" → Save → 在你的 \"Daily life\" 文件夹里复习。"
   },
   "subtitles": {
    "title": "字幕",
    "what": "保存你看视频时遇到的单词和句子,以后再学习。",
    "steps": [
     "粘贴视频中的一句字幕或一个单词。",
     "把它保存到你的列表。",
     "回来复习你保存的句子。"
    ],
    "example": "例如:粘贴动画某一集里的一句话 → 保存 → 明天复习。"
   },
   "milestones": {
    "title": "里程碑",
    "what": "你的目标路线图和进度检查,让你看到自己已经走了多远。",
    "steps": [
     "阅读你的目标对应的路线图步骤。",
     "用进度检查看看你现在的水平。",
     "保持连续学习,就能不断前进。"
    ],
    "example": "例如:完成本周的任务,就能到达下一个里程碑。"
   },
   "jlpt": {
    "title": "JLPT 结果",
    "what": "老师发送给你的 JLPT 诊断结果会显示在这里。",
    "steps": [
     "等老师把结果发给你。",
     "打开这个标签页查看。",
     "点 Download PDF 保存。"
    ],
    "example": "例如:模拟考试之后,你的结果报告会出现在这里。"
   },
   "feedback": {
    "title": "反馈",
    "what": "告诉我们 GAKU Master 哪里需要改进。",
    "steps": [
     "写下你的想法或遇到的问题。",
     "点 Send。",
     "请保持友善——我们不接受辱骂性的留言。"
    ],
    "example": "例如:\"Please add more N4 grammar questions.\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "搜索任何单词并打开它的单词卡——有意思、读音和例句。",
    "steps": [
     "输入英语或日语单词(或一个主题),然后点 Search。",
     "点一个结果,打开它的卡片。",
     "把它保存到文件夹,以后就能复习。"
    ],
    "example": "例如:搜索 \"階段\" → 打开卡片 → Save 到你的 \"Daily life\" 文件夹。"
   },
   "vocab_library": {
    "title": "Library",
    "what": "你保存的所有单词,按文件夹整理好。",
    "steps": [
     "点一个文件夹,查看里面的单词卡。",
     "点文件夹上的 🔊 ▶,依次听里面所有的单词。",
     "点 \"Quick review with Flashcards\" 来练习你的单词。"
    ],
    "example": "小提示:用 \"New folder\" 创建你自己的文件夹(比如每节课一个文件夹)。"
   },
   "vocab_folder": {
    "title": "这个文件夹里的 Word Cards",
    "what": "下面的每个方框都是一张单词卡——一个你保存的单词。",
    "steps": [
     "点一张单词卡打开它:有意思、读音和例句。",
     "点 🔊 听这个单词。点右上角的 🔊 ▶ All,听这个文件夹里的每个单词。",
     "点 Go Flashcard,只练习这一个单词。点垃圾桶图标删除这张卡片。"
    ],
    "example": "小提示:\"📋 Copy to folder\" 可以把单词复制到另一个文件夹(比如下一节课的文件夹)。"
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "像纸质单词卡一样练习你保存的单词。点卡片翻面,查看答案。",
    "steps": [
     "看着单词,试着想起它的意思。如果需要读音,就点 Hint,然后点卡片查看答案。",
     "如果你知道,就点 ✅ Understand。这个单词会移到 \"Understood\" 文件夹,这样你就可以只复习还不会的单词。它仍然保存在你的 Library 里——什么都不会丢。",
     "如果你不知道,什么都不用按。直接点 → 看下一张卡片;它会继续留在你的卡组里。"
    ],
    "example": "Intensive Mode 会记录你翻每张卡片的速度,以及你按 Understand 的次数,并据此显示你真正掌握了哪些单词、没掌握哪些。",
    "action": "试试 Intensive Mode"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "一个字一个字地抄写日语,用手指或鼠标写出每一笔。GAKU 会检查你的笔顺和字形。",
    "steps": [
     "把一句日语粘贴到输入框里,或点 \"Choose words from your Library\",使用你保存的单词。",
     "点 \"Start writing\"。",
     "一笔一笔地写出每个字。"
    ],
    "example": "小提示:每次最多练习30个字。"
   },
   "res_writing_copy_write": {
    "title": "一次写一个字",
    "what": "你一次写一个字,内容是你粘贴的文本,或你从 Library 里选的单词。",
    "steps": [
     "按正确的顺序,一笔一笔地写这个字。如果有一笔错了,GAKU 会告诉你。",
     "不知道怎么写?点 ▶ Watch stroke order。想再写一次?点 ↺ Try again。",
     "写完一个字后,点蓝色的 Next ▶ 按钮。最后一个字会显示 Finish。"
    ],
    "notes": [
     "引导是字的浅灰色轮廓。用 👁 Show guide 可以描着写;用 🙈 Hide guide 就是凭记忆写。",
     "输入新文本会回到上一个画面,在那里你可以选择新的单词、字或句子。"
    ],
    "example": "Intensive Mode 会更准确地测量你的书写,并分析你觉得困难的字、单词和句子。",
    "action": "试试 Intensive Mode"
   },
   "res_links": {
    "title": "学习资源",
    "what": "为你的水平和技能精选的网站、视频和应用。",
    "steps": [
     "看看下面的卡片(每张卡片是一个视频或网站)。它们是按你的水平挑选的。",
     "点你喜欢的卡片上的 Open 按钮。",
     "在那个页面上使用 GAKU Reader 查询你不认识的单词。"
    ],
    "example": "例如:打开一个推荐的阅读网站,读一页短文。"
   },
   "res_content": {
    "title": "Create From Content",
    "what": "粘贴你正在读或正在看的任何日语,GAKU 会把它变成练习题。",
    "steps": [
     "粘贴日语文本(文章、字幕、消息)。",
     "点 Analyze 生成题目。",
     "回答题目;需要帮助时,可以打开假名注音 / 罗马字 / 翻译。"
    ],
    "example": "例如:粘贴一份公寓通知 → 得到关于意思、汉字和语法的题目。"
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "在麦克风附近播放真实的视频。GAKU 会听,显示真实的台词,并帮你回答。",
    "steps": [
     "点收听按钮,播放一个有声音的日语视频。",
     "你听到的每一句话都会变成一张卡片。如果 GAKU 没听清某一句,它会请你再听一次——请重新播放你刚才听的视频或音频。",
     "点 \"How would you respond?\" 练习自然的回答。"
    ],
    "example": "例如:播放一段 YouTube 对话 → 从4个选项里选出最好的回答。",
    "intensive": "当你说出你的回答时,GAKU 会检查你的日语。Intensive Mode 会记录每次口头回答是否正确、你犯了哪种错误(助词、动词形式、选词、语序或拼写),以及反复出错的单词。然后它会建议你今天该重点练什么。"
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "大声朗读日语(或者听后跟读),看看你说得有多接近。",
    "steps": [
     "粘贴日语文本,得到短语。",
     "先听,然后录下你自己说的。",
     "查看结果,再试一次。"
    ],
    "example": "例如:粘贴一句短短的歌词 → 说出来 → 查看你的分数。",
    "intensive": "Intensive Mode 会记录每一次发音尝试的结果(和你的分数),这样它就能找出你总是说错的短语,并建议你额外练习。"
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "通过抄写文本或回答问题来练习写日语。",
    "steps": [
     "选择一个模式(Copying down 或 Questions)。",
     "选择文本,或从你的 Library 里选单词。",
     "输入你的答案并检查。"
    ],
    "example": "例如:从漫画的一个场景里抄3个句子,然后检查你的输入。",
    "intensive": "Intensive Mode 会更仔细地测量你的书写准确度。在 Copying down 里,它会记录每个字和每一笔。在 Questions 模式里,GAKU 会检查你的答案,并记录错误的种类(助词、动词形式、选词、语序或拼写)和错的单词。然后它会指出你最常犯哪些错误,以及今天该练什么。"
   }
  }
 },
 "Chinese (Traditional)": {
  "labels": {
   "how": "使用方法",
   "what": "這是什麼?",
   "steps": "3個步驟",
   "close": "關閉",
   "never": "不再顯示",
   "tryIntensive": "試試 Intensive Mode"
  },
  "firstSteps": {
   "title": "你的第一步",
   "sub": "大約只需3分鐘",
   "profile": "設定你的個人資料",
   "content": "試試 Create From Content(1分鐘)",
   "word": "儲存你的第一個單字",
   "go": "前往 →",
   "allDone": "🎉 開了個好頭!你已完成第一步。",
   "ok": "OK",
   "hide": "隱藏",
   "progress": "已完成 {n} / {m}"
  },
  "hints": {
   "vocab_search": "輸入一個單字並搜尋,然後把它儲存到你的 Library。",
   "content_sample": "我們為你準備了一段範例文字。直接點下面的按鈕就可以,也可以貼上你自己的文字。",
   "content_analyze": "點這裡,大約一分鐘後就會準備好你的第一批練習。"
  },
  "sections": {
   "schedule": {
    "title": "行程表",
    "what": "你專屬的每週學習計畫。它只會為你製作一次,除非你在 Edit Profile 裡點選 \"Update my study guide\",否則不會改變。",
    "steps": [
     "打開今天的任務,依序完成。",
     "點任務的連結或 \"Go to…\" 按鈕,打開對應的工具。",
     "完成後勾選方框,你的連續學習天數和進度就會增加。"
    ],
    "example": "例如:\"Read a manga scene\" → 點連結 → 回來 → 勾選。",
    "intensive": "在這個畫面的頂端,Intensive Mode 會顯示每日目標(每天8個動作),落後時會提醒你。它還會查看你最近14天的學習情況,指出你錯得最多的地方,讓你知道今天該練什麼。"
   },
   "vocabulary": {
    "title": "單字",
    "what": "查詢任何單字,並儲存到你自己的資料夾(Library)裡,之後再複習。",
    "steps": [
     "輸入英語或日語單字並搜尋。",
     "點 Save,然後選擇一個資料夾。",
     "打開 Library,用 flashcards 複習,或聽發音。"
    ],
    "example": "例如:搜尋 \"階段\" → Save → 在你的 \"Daily life\" 資料夾裡複習。"
   },
   "subtitles": {
    "title": "字幕",
    "what": "儲存你看影片時遇到的單字和句子,之後再學習。",
    "steps": [
     "貼上影片中的一句字幕或一個單字。",
     "把它儲存到你的清單。",
     "回來複習你儲存的句子。"
    ],
    "example": "例如:貼上動畫某一集裡的一句話 → 儲存 → 明天複習。"
   },
   "milestones": {
    "title": "里程碑",
    "what": "你的目標路線圖和進度檢查,讓你看到自己已經走了多遠。",
    "steps": [
     "閱讀你的目標對應的路線圖步驟。",
     "用進度檢查看看你現在的程度。",
     "保持連續學習,就能不斷前進。"
    ],
    "example": "例如:完成本週的任務,就能到達下一個里程碑。"
   },
   "jlpt": {
    "title": "JLPT 結果",
    "what": "老師寄給你的 JLPT 診斷結果會顯示在這裡。",
    "steps": [
     "等老師把結果寄給你。",
     "打開這個分頁查看。",
     "點 Download PDF 儲存。"
    ],
    "example": "例如:模擬考試之後,你的結果報告會出現在這裡。"
   },
   "feedback": {
    "title": "意見回饋",
    "what": "告訴我們 GAKU Master 哪裡需要改進。",
    "steps": [
     "寫下你的想法或遇到的問題。",
     "點 Send。",
     "請保持友善——我們不接受辱罵性的留言。"
    ],
    "example": "例如:\"Please add more N4 grammar questions.\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "搜尋任何單字並打開它的單字卡——有意思、讀音和例句。",
    "steps": [
     "輸入英語或日語單字(或一個主題),然後點 Search。",
     "點一個結果,打開它的卡片。",
     "把它儲存到資料夾,之後就能複習。"
    ],
    "example": "例如:搜尋 \"階段\" → 打開卡片 → Save 到你的 \"Daily life\" 資料夾。"
   },
   "vocab_library": {
    "title": "Library",
    "what": "你儲存的所有單字,依資料夾整理好。",
    "steps": [
     "點一個資料夾,查看裡面的單字卡。",
     "點資料夾上的 🔊 ▶,依序聽裡面所有的單字。",
     "點 \"Quick review with Flashcards\" 來練習你的單字。"
    ],
    "example": "小提示:用 \"New folder\" 建立你自己的資料夾(例如每堂課一個資料夾)。"
   },
   "vocab_folder": {
    "title": "這個資料夾裡的 Word Cards",
    "what": "下面的每個方框都是一張單字卡——一個你儲存的單字。",
    "steps": [
     "點一張單字卡打開它:有意思、讀音和例句。",
     "點 🔊 聽這個單字。點右上角的 🔊 ▶ All,聽這個資料夾裡的每個單字。",
     "點 Go Flashcard,只練習這一個單字。點垃圾桶圖示刪除這張卡片。"
    ],
    "example": "小提示:\"📋 Copy to folder\" 可以把單字複製到另一個資料夾(例如下一堂課的資料夾)。"
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "像紙本單字卡一樣練習你儲存的單字。點卡片翻面,查看答案。",
    "steps": [
     "看著單字,試著想起它的意思。如果需要讀音,就點 Hint,然後點卡片查看答案。",
     "如果你知道,就點 ✅ Understand。這個單字會移到 \"Understood\" 資料夾,這樣你就可以只複習還不會的單字。它仍然儲存在你的 Library 裡——什麼都不會遺失。",
     "如果你不知道,什麼都不用按。直接點 → 看下一張卡片;它會繼續留在你的牌組裡。"
    ],
    "example": "Intensive Mode 會記錄你翻每張卡片的速度,以及你按 Understand 的次數,並據此顯示你真正掌握了哪些單字、沒掌握哪些。",
    "action": "試試 Intensive Mode"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "一個字一個字地抄寫日語,用手指或滑鼠寫出每一筆。GAKU 會檢查你的筆順和字形。",
    "steps": [
     "把一句日語貼到輸入框裡,或點 \"Choose words from your Library\",使用你儲存的單字。",
     "點 \"Start writing\"。",
     "一筆一筆地寫出每個字。"
    ],
    "example": "小提示:每次最多練習30個字。"
   },
   "res_writing_copy_write": {
    "title": "一次寫一個字",
    "what": "你一次寫一個字,內容是你貼上的文字,或你從 Library 裡選的單字。",
    "steps": [
     "依照正確的順序,一筆一筆地寫這個字。如果有一筆錯了,GAKU 會告訴你。",
     "不知道怎麼寫?點 ▶ Watch stroke order。想再寫一次?點 ↺ Try again。",
     "寫完一個字後,點藍色的 Next ▶ 按鈕。最後一個字會顯示 Finish。"
    ],
    "notes": [
     "引導是字的淡灰色輪廓。用 👁 Show guide 可以描著寫;用 🙈 Hide guide 就是憑記憶寫。",
     "輸入新文字會回到上一個畫面,在那裡你可以選擇新的單字、字或句子。"
    ],
    "example": "Intensive Mode 會更準確地測量你的書寫,並分析你覺得困難的字、單字和句子。",
    "action": "試試 Intensive Mode"
   },
   "res_links": {
    "title": "學習資源",
    "what": "為你的程度和技能精選的網站、影片和應用程式。",
    "steps": [
     "看看下面的卡片(每張卡片是一個影片或網站)。它們是依你的程度挑選的。",
     "點你喜歡的卡片上的 Open 按鈕。",
     "在那個頁面上使用 GAKU Reader 查詢你不認識的單字。"
    ],
    "example": "例如:打開一個推薦的閱讀網站,讀一頁短文。"
   },
   "res_content": {
    "title": "Create From Content",
    "what": "貼上你正在讀或正在看的任何日語,GAKU 會把它變成練習題。",
    "steps": [
     "貼上日語文字(文章、字幕、訊息)。",
     "點 Analyze 產生題目。",
     "回答題目;需要幫助時,可以打開假名注音 / 羅馬拼音 / 翻譯。"
    ],
    "example": "例如:貼上一份公寓通知 → 得到關於意思、漢字和文法的題目。"
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "在麥克風附近播放真實的影片。GAKU 會聽,顯示真實的台詞,並幫你回答。",
    "steps": [
     "點收聽按鈕,播放一個有聲音的日語影片。",
     "你聽到的每一句話都會變成一張卡片。如果 GAKU 沒聽清楚某一句,它會請你再聽一次——請重新播放你剛才聽的影片或音訊。",
     "點 \"How would you respond?\" 練習自然的回答。"
    ],
    "example": "例如:播放一段 YouTube 對話 → 從4個選項裡選出最好的回答。",
    "intensive": "當你說出你的回答時,GAKU 會檢查你的日語。Intensive Mode 會記錄每次口頭回答是否正確、你犯了哪種錯誤(助詞、動詞形式、選詞、語序或拼寫),以及反覆出錯的單字。然後它會建議你今天該重點練什麼。"
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "大聲朗讀日語(或者聽後跟讀),看看你說得有多接近。",
    "steps": [
     "貼上日語文字,得到短語。",
     "先聽,然後錄下你自己說的。",
     "查看結果,再試一次。"
    ],
    "example": "例如:貼上一句短短的歌詞 → 說出來 → 查看你的分數。",
    "intensive": "Intensive Mode 會記錄每一次發音嘗試的結果(和你的分數),這樣它就能找出你總是說錯的短語,並建議你額外練習。"
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "透過抄寫文字或回答問題來練習寫日語。",
    "steps": [
     "選擇一個模式(Copying down 或 Questions)。",
     "選擇文字,或從你的 Library 裡選單字。",
     "輸入你的答案並檢查。"
    ],
    "example": "例如:從漫畫的一個場景裡抄3個句子,然後檢查你的輸入。",
    "intensive": "Intensive Mode 會更仔細地測量你的書寫準確度。在 Copying down 裡,它會記錄每個字和每一筆。在 Questions 模式裡,GAKU 會檢查你的答案,並記錄錯誤的種類(助詞、動詞形式、選詞、語序或拼寫)和錯的單字。然後它會指出你最常犯哪些錯誤,以及今天該練什麼。"
   }
  }
 },
 "Italian": {
  "labels": {
   "how": "Come si usa",
   "what": "Che cos'è?",
   "steps": "3 passaggi",
   "close": "Chiudi",
   "never": "Non mostrare più",
   "tryIntensive": "Prova Intensive Mode"
  },
  "firstSteps": {
   "title": "I tuoi primi passi",
   "sub": "Ci vogliono circa 3 minuti",
   "profile": "Crea il tuo profilo",
   "content": "Prova Create From Content (1 min)",
   "word": "Salva la tua prima parola",
   "go": "Vai →",
   "allDone": "🎉 Ottimo inizio! Hai finito i primi passi.",
   "ok": "OK",
   "hide": "Nascondi",
   "progress": "{n} / {m} completati"
  },
  "hints": {
   "vocab_search": "Scrivi una parola e cercala — poi salvala nella tua Library.",
   "content_sample": "Abbiamo aggiunto un testo di esempio per te. Tocca il pulsante qui sotto — oppure incolla il tuo testo.",
   "content_analyze": "Tocca qui — le tue prime attività saranno pronte in circa un minuto."
  },
  "sections": {
   "schedule": {
    "title": "Programma",
    "what": "Il tuo piano di studio settimanale personale. Viene creato una sola volta per te e non cambia mai, a meno che tu non tocchi \"Update my study guide\" in Edit Profile.",
    "steps": [
     "Apri i compiti di oggi e falli in ordine.",
     "Tocca il link di un compito o il pulsante \"Go to…\" per aprire lo strumento giusto.",
     "Spunta la casella quando hai finito — la tua serie e i tuoi progressi aumentano."
    ],
    "example": "Esempio: \"Read a manga scene\" → tocca il link → torna indietro → spunta.",
    "intensive": "In alto in questa schermata, Intensive Mode mostra un obiettivo giornaliero (8 azioni al giorno) e ti avvisa se sei indietro. Guarda anche i tuoi ultimi 14 giorni di studio e ti suggerisce le aree in cui fai più errori, così sai cosa esercitare oggi."
   },
   "vocabulary": {
    "title": "Vocabolario",
    "what": "Cerca qualsiasi parola e salvala nelle tue cartelle (Library) per ripassarla più tardi.",
    "steps": [
     "Scrivi una parola in inglese o in giapponese e cerca.",
     "Tocca Save e scegli una cartella.",
     "Apri la Library per ripassare con le flashcard o ascoltare la pronuncia."
    ],
    "example": "Esempio: cerca \"階段\" → Save → ripassa nella tua cartella \"Daily life\"."
   },
   "subtitles": {
    "title": "Sottotitoli",
    "what": "Salva parole e frasi dai video che guardi, così puoi studiarle più tardi.",
    "steps": [
     "Incolla una riga di sottotitoli o una parola dal video.",
     "Salvala nella tua lista.",
     "Torna a ripassare le frasi che hai salvato."
    ],
    "example": "Esempio: incolla una frase da un episodio di un anime → salva → ripassala domani."
   },
   "milestones": {
    "title": "Traguardi",
    "what": "La mappa dei tuoi obiettivi e il controllo dei progressi, per vedere quanta strada hai fatto.",
    "steps": [
     "Leggi i passaggi della tua mappa per il tuo obiettivo.",
     "Usa il controllo dei progressi per vedere a che punto sei.",
     "Mantieni la tua serie per andare avanti."
    ],
    "example": "Esempio: completa i compiti di questa settimana per raggiungere il prossimo traguardo."
   },
   "jlpt": {
    "title": "Risultati JLPT",
    "what": "Qui appare il risultato della tua diagnosi JLPT inviato dal tuo insegnante.",
    "steps": [
     "Aspetta che il tuo insegnante ti mandi il risultato.",
     "Apri questa scheda per vederlo.",
     "Tocca Download PDF per salvarlo."
    ],
    "example": "Esempio: dopo il tuo test di prova, qui compare il rapporto con il tuo risultato."
   },
   "feedback": {
    "title": "Feedback",
    "what": "Dicci cosa migliorare in GAKU Master.",
    "steps": [
     "Scrivi la tua idea o il tuo problema.",
     "Tocca Send.",
     "Sii gentile — i messaggi offensivi non vengono accettati."
    ],
    "example": "Esempio: \"Please add more N4 grammar questions.\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "Cerca qualsiasi parola e apri la sua word card — significato, lettura e frasi di esempio.",
    "steps": [
     "Scrivi una parola in inglese o in giapponese (o un argomento) e tocca Search.",
     "Tocca un risultato per aprire la sua scheda.",
     "Salvala in una cartella per ripassarla più tardi."
    ],
    "example": "Esempio: cerca \"階段\" → apri la scheda → Save nella tua cartella \"Daily life\"."
   },
   "vocab_library": {
    "title": "Library",
    "what": "Tutte le parole che hai salvato, divise in cartelle.",
    "steps": [
     "Tocca una cartella per vedere le word card al suo interno.",
     "Tocca 🔊 ▶ su una cartella per ascoltare tutte le sue parole una dopo l'altra.",
     "Tocca \"Quick review with Flashcards\" per esercitarti con le tue parole."
    ],
    "example": "Consiglio: crea le tue cartelle con \"New folder\" (per esempio, una cartella per ogni lezione)."
   },
   "vocab_folder": {
    "title": "Word card in questa cartella",
    "what": "Ogni riquadro qui sotto è una word card — una parola che hai salvato.",
    "steps": [
     "Tocca una word card per aprirla: significato, lettura e frasi di esempio.",
     "Tocca 🔊 per ascoltare la parola. Tocca 🔊 ▶ All (in alto a destra) per ascoltare tutte le parole di questa cartella.",
     "Tocca Go Flashcard per esercitarti solo con quella parola. Tocca il cestino per eliminare la scheda."
    ],
    "example": "Consiglio: \"📋 Copy to folder\" copia le parole in un'altra cartella (per esempio, la cartella della tua prossima lezione)."
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "Esercitati con le parole salvate come con le flashcard di carta. Tocca la carta per girarla e controllare la risposta.",
    "steps": [
     "Guarda la parola e prova a ricordare il significato. Tocca Hint se ti serve la lettura, poi tocca la carta per vedere la risposta.",
     "Se la sapevi, tocca ✅ Understand. La parola passa nella cartella \"Understood\", così puoi ripassare solo le parole che non sai ancora. Resta comunque salvata nella tua Library — non si perde nulla.",
     "Se non la sapevi, non toccare nulla. Tocca solo → per la carta successiva; la parola resta nel tuo mazzo."
    ],
    "example": "Intensive Mode registra quanto velocemente giri ogni carta e quante volte premi Understand, e lo usa per mostrare quali parole conosci davvero e quali no.",
    "action": "Prova Intensive Mode"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "Copia il giapponese un carattere alla volta, disegnando ogni tratto con il dito o con il mouse. GAKU controlla l'ordine dei tratti e la forma.",
    "steps": [
     "Incolla una frase in giapponese nella casella, oppure tocca \"Choose words from your Library\" per usare le parole che hai salvato.",
     "Tocca \"Start writing\".",
     "Scrivi ogni carattere, un tratto alla volta."
    ],
    "example": "Consiglio: si esercitano fino a 30 caratteri alla volta."
   },
   "res_writing_copy_write": {
    "title": "Scrivere un carattere alla volta",
    "what": "Scrivi, un carattere alla volta, il testo che hai incollato o le parole che hai scelto dalla tua Library.",
    "steps": [
     "Scrivi il carattere un tratto alla volta, nell'ordine giusto. GAKU ti dice quando un tratto è sbagliato.",
     "Non sai come si scrive? Tocca ▶ Watch stroke order. Vuoi riprovare? Tocca ↺ Try again.",
     "Quando finisci un carattere, tocca il pulsante blu Next ▶. Sull'ultimo carattere c'è scritto Finish."
    ],
    "notes": [
     "La guida è il contorno grigio chiaro del carattere. Con 👁 Show guide puoi ricalcarlo; con 🙈 Hide guide scrivi a memoria.",
     "Con un nuovo testo torni alla schermata precedente, dove scegli nuove parole, caratteri o una frase."
    ],
    "example": "Intensive Mode misura la tua scrittura con più precisione e analizza i caratteri, le parole e le frasi che trovi difficili.",
    "action": "Prova Intensive Mode"
   },
   "res_links": {
    "title": "Risorse",
    "what": "Siti web, video e app scelti a mano per il tuo livello e le tue abilità.",
    "steps": [
     "Guarda le schede qui sotto (ogni scheda è un video o un sito). Sono scelte per il tuo livello.",
     "Tocca il pulsante Open su una scheda che ti piace.",
     "Usa GAKU Reader su quella pagina per cercare le parole che non conosci."
    ],
    "example": "Esempio: apri un sito di lettura consigliato e leggi una pagina breve."
   },
   "res_content": {
    "title": "Create From Content",
    "what": "Incolla qualsiasi testo in giapponese che stai leggendo o guardando, e GAKU lo trasforma in domande di pratica.",
    "steps": [
     "Incolla un testo in giapponese (un articolo, dei sottotitoli, un messaggio).",
     "Tocca Analyze per creare le domande.",
     "Rispondi, e attiva furigana / romaji / traduzione se ti serve aiuto."
    ],
    "example": "Esempio: incolla un avviso del condominio → ottieni domande su significato, kanji e grammatica."
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "Riproduci un video vero vicino al microfono. GAKU ascolta, mostra le frasi vere e ti aiuta a rispondere.",
    "steps": [
     "Tocca il pulsante di ascolto e riproduci un video in giapponese con l'audio.",
     "Ogni frase che senti diventa una scheda. Se GAKU non riesce a capire una frase, ti chiederà di ascoltare di nuovo — riproduci ancora il video o l'audio che stavi ascoltando.",
     "Tocca \"How would you respond?\" per esercitarti a dare una risposta naturale."
    ],
    "example": "Esempio: riproduci una conversazione di YouTube → scegli la risposta migliore tra 4 opzioni.",
    "intensive": "Quando dici la tua risposta a voce, GAKU controlla il tuo giapponese. Intensive Mode registra se ogni risposta parlata era corretta e che tipo di errore hai fatto (particelle, forme verbali, scelta delle parole, ordine delle parole o ortografia), oltre alle parole sbagliate ripetute. Poi ti suggerisce su cosa concentrarti oggi."
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "Leggi il giapponese ad alta voce (oppure ascolta e ripeti) e vedi quanto era vicina la tua pronuncia.",
    "steps": [
     "Incolla un testo in giapponese per ottenere delle frasi.",
     "Ascolta, poi registrati mentre la dici.",
     "Controlla il risultato e riprova."
    ],
    "example": "Esempio: incolla una breve frase di una canzone → dilla → guarda il tuo punteggio.",
    "intensive": "Intensive Mode registra il risultato di ogni tentativo di pronuncia (e il tuo punteggio), così può trovare le frasi che sbagli di continuo e suggerirtele per un esercizio in più."
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "Esercitati a scrivere in giapponese copiando un testo o rispondendo a domande.",
    "steps": [
     "Scegli una modalità (Copying down o Questions).",
     "Scegli un testo, oppure scegli parole dalla tua Library.",
     "Scrivi la tua risposta e controllala."
    ],
    "example": "Esempio: copia 3 frasi da una scena di un manga, poi controlla quello che hai scritto.",
    "intensive": "Intensive Mode misura la precisione della tua scrittura con più attenzione. In Copying down registra ogni carattere e ogni tratto. In modalità Questions, GAKU controlla la tua risposta e registra il tipo di errore (particelle, forme verbali, scelta delle parole, ordine delle parole o ortografia) e le parole sbagliate. Poi ti indica quali errori fai di più e cosa esercitare oggi."
   }
  }
 },
 "Korean": {
  "labels": {
   "how": "사용 방법",
   "what": "이게 뭐예요?",
   "steps": "3단계",
   "close": "닫기",
   "never": "다시 보지 않기",
   "tryIntensive": "Intensive Mode 해 보기"
  },
  "firstSteps": {
   "title": "첫 단계",
   "sub": "약 3분이면 돼요",
   "profile": "프로필 설정하기",
   "content": "Create From Content 해 보기 (1분)",
   "word": "첫 단어 저장하기",
   "go": "가기 →",
   "allDone": "🎉 좋은 시작이에요! 첫 단계를 모두 끝냈어요.",
   "ok": "OK",
   "hide": "숨기기",
   "progress": "{n} / {m} 완료"
  },
  "hints": {
   "vocab_search": "단어 하나를 입력해 검색한 다음, Library에 저장해 보세요.",
   "content_sample": "예시 글을 준비해 뒀어요. 아래 버튼만 누르면 돼요. 직접 만든 글을 붙여 넣어도 좋아요.",
   "content_analyze": "여기를 누르세요. 약 1분 뒤에 첫 연습 활동이 준비돼요."
  },
  "sections": {
   "schedule": {
    "title": "일정",
    "what": "나만의 주간 학습 계획이에요. 한 번만 만들어지고, Edit Profile에서 \"Update my study guide\"를 누르지 않는 한 바뀌지 않아요.",
    "steps": [
     "오늘의 할 일을 열고 순서대로 하세요.",
     "할 일의 링크나 \"Go to…\" 버튼을 눌러 알맞은 도구를 여세요.",
     "끝나면 체크 박스를 누르세요. 연속 학습 일수와 진행도가 올라가요."
    ],
    "example": "예: \"Read a manga scene\" → 링크 누르기 → 돌아오기 → 체크하기.",
    "intensive": "이 화면 맨 위에서 Intensive Mode가 하루 목표(하루 8개 활동)를 보여 주고, 뒤처지면 알려 줘요. 또 최근 14일 동안의 학습을 살펴보고 가장 많이 틀리는 부분을 제안해서, 오늘 무엇을 연습하면 좋을지 알 수 있어요."
   },
   "vocabulary": {
    "title": "단어",
    "what": "어떤 단어든 찾아서 나만의 폴더(Library)에 저장하고, 나중에 복습해요.",
    "steps": [
     "영어나 일본어 단어를 입력하고 검색하세요.",
     "Save를 누르고 폴더를 고르세요.",
     "Library를 열어서 flashcards로 복습하거나 발음을 들어 보세요."
    ],
    "example": "예: \"階段\" 검색 → Save → \"Daily life\" 폴더에서 복습."
   },
   "subtitles": {
    "title": "자막",
    "what": "영상을 보다가 만난 단어와 문장을 저장해 두고, 나중에 공부해요.",
    "steps": [
     "영상의 자막 한 줄이나 단어를 붙여 넣으세요.",
     "내 목록에 저장하세요.",
     "다시 와서 저장한 문장을 복습하세요."
    ],
    "example": "예: 애니메이션 한 편에서 대사 한 줄 붙여 넣기 → 저장 → 내일 복습."
   },
   "milestones": {
    "title": "마일스톤",
    "what": "목표 로드맵과 진행 확인으로, 내가 얼마나 왔는지 볼 수 있어요.",
    "steps": [
     "내 목표에 맞는 로드맵 단계를 읽어 보세요.",
     "진행 확인으로 지금 어디쯤인지 보세요.",
     "연속 학습을 이어 가면 앞으로 나아갈 수 있어요."
    ],
    "example": "예: 이번 주 할 일을 끝내면 다음 마일스톤에 도착해요."
   },
   "jlpt": {
    "title": "JLPT 결과",
    "what": "선생님이 보내 준 JLPT 진단 결과가 여기에 나타나요.",
    "steps": [
     "선생님이 결과를 보내 줄 때까지 기다리세요.",
     "이 탭을 열어서 확인하세요.",
     "Download PDF를 눌러 저장하세요."
    ],
    "example": "예: 모의고사를 본 뒤에 결과 리포트가 여기에 나타나요."
   },
   "feedback": {
    "title": "피드백",
    "what": "GAKU Master에서 고쳤으면 하는 점을 알려 주세요.",
    "steps": [
     "아이디어나 문제를 써 주세요.",
     "Send를 누르세요.",
     "친절하게 써 주세요. 욕설이 담긴 메시지는 받지 않아요."
    ],
    "example": "예: \"Please add more N4 grammar questions.\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "단어를 검색하고 단어 카드를 열어 보세요. 뜻, 읽는 법, 예문이 나와요.",
    "steps": [
     "영어나 일본어 단어(또는 주제)를 입력하고 Search를 누르세요.",
     "결과를 눌러 카드를 여세요.",
     "폴더에 저장해 두면 나중에 복습할 수 있어요."
    ],
    "example": "예: \"階段\" 검색 → 카드 열기 → \"Daily life\" 폴더에 Save."
   },
   "vocab_library": {
    "title": "Library",
    "what": "저장한 모든 단어가 폴더별로 정리되어 있어요.",
    "steps": [
     "폴더를 눌러 안에 있는 단어 카드를 보세요.",
     "폴더의 🔊 ▶를 누르면 그 폴더의 모든 단어를 차례로 들을 수 있어요.",
     "\"Quick review with Flashcards\"를 눌러 단어를 연습하세요."
    ],
    "example": "팁: \"New folder\"로 나만의 폴더를 만드세요 (예: 수업마다 폴더 하나)."
   },
   "vocab_folder": {
    "title": "이 폴더의 Word Cards",
    "what": "아래의 각 상자는 단어 카드 하나, 즉 내가 저장한 단어예요.",
    "steps": [
     "단어 카드를 눌러 열어 보세요. 뜻, 읽는 법, 예문이 나와요.",
     "🔊를 누르면 단어를 들을 수 있어요. 오른쪽 위의 🔊 ▶ All을 누르면 이 폴더의 모든 단어를 들을 수 있어요.",
     "Go Flashcard를 누르면 그 단어만 연습해요. 휴지통을 누르면 카드를 지워요."
    ],
    "example": "팁: \"📋 Copy to folder\"로 단어를 다른 폴더에 복사할 수 있어요 (예: 다음 수업 폴더)."
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "저장한 단어를 종이 단어장처럼 연습해요. 카드를 눌러 뒤집으면 답을 확인할 수 있어요.",
    "steps": [
     "단어를 보고 뜻을 떠올려 보세요. 읽는 법이 필요하면 Hint를 누르고, 카드를 눌러 답을 확인하세요.",
     "알았다면 ✅ Understand를 누르세요. 그 단어는 \"Understood\" 폴더로 옮겨져서, 아직 모르는 단어만 복습할 수 있어요. Library에는 그대로 저장되어 있으니 잃어버리는 건 없어요.",
     "몰랐다면 아무것도 누르지 마세요. → 를 눌러 다음 카드로 가면 돼요. 그 카드는 덱에 그대로 남아요."
    ],
    "example": "Intensive Mode는 카드를 얼마나 빨리 넘기는지, Understand를 몇 번 눌렀는지 기록해서, 어떤 단어를 정말 알고 어떤 단어를 모르는지 보여 줘요.",
    "action": "Intensive Mode 해 보기"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "일본어를 한 글자씩 따라 쓰면서, 손가락이나 마우스로 획을 하나하나 그려요. GAKU가 획순과 글자 모양을 확인해 줘요.",
    "steps": [
     "일본어 문장을 상자에 붙여 넣거나, \"Choose words from your Library\"를 눌러 저장한 단어를 사용하세요.",
     "\"Start writing\"을 누르세요.",
     "글자를 한 획씩 쓰세요."
    ],
    "example": "팁: 한 번에 최대 30글자까지 연습해요."
   },
   "res_writing_copy_write": {
    "title": "한 글자씩 쓰기",
    "what": "붙여 넣은 글이나 Library에서 고른 단어를 한 글자씩 써요.",
    "steps": [
     "올바른 순서로 글자를 한 획씩 쓰세요. 획이 틀리면 GAKU가 알려 줘요.",
     "쓰는 법을 모르겠나요? ▶ Watch stroke order를 누르세요. 다시 쓰고 싶나요? ↺ Try again을 누르세요.",
     "한 글자를 다 쓰면 파란색 Next ▶ 버튼을 누르세요. 마지막 글자에서는 Finish라고 나와요."
    ],
    "notes": [
     "가이드는 글자의 연한 회색 윤곽선이에요. 👁 Show guide를 켜면 그 위에 따라 쓸 수 있고, 🙈 Hide guide를 켜면 기억으로 써요.",
     "새 글을 입력하면 이전 화면으로 돌아가고, 거기서 새 단어, 글자 또는 문장을 고를 수 있어요."
    ],
    "example": "Intensive Mode는 쓰기를 더 정확하게 측정하고, 어려워하는 글자, 단어, 문장을 분석해 줘요.",
    "action": "Intensive Mode 해 보기"
   },
   "res_links": {
    "title": "학습 자료",
    "what": "내 레벨과 실력에 맞춰 골라 둔 웹사이트, 영상, 앱이에요.",
    "steps": [
     "아래 카드를 보세요 (각 카드는 영상이나 웹사이트예요). 내 레벨에 맞게 골랐어요.",
     "마음에 드는 카드의 Open 버튼을 누르세요.",
     "그 페이지에서 GAKU Reader를 사용해 모르는 단어를 찾아보세요."
    ],
    "example": "예: 추천 읽기 사이트를 열고 짧은 글 한 페이지를 읽기."
   },
   "res_content": {
    "title": "Create From Content",
    "what": "읽고 있거나 보고 있는 일본어를 붙여 넣으면, GAKU가 연습 문제로 바꿔 줘요.",
    "steps": [
     "일본어 글(기사, 자막, 메시지)을 붙여 넣으세요.",
     "Analyze를 눌러 문제를 만드세요.",
     "문제를 풀고, 도움이 필요하면 후리가나 / 로마자 / 번역을 켜세요."
    ],
    "example": "예: 아파트 공지를 붙여 넣기 → 뜻, 한자, 문법 문제를 받기."
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "마이크 가까이에서 실제 영상을 재생하세요. GAKU가 듣고, 실제 대사를 보여 주고, 대답을 도와줘요.",
    "steps": [
     "듣기 버튼을 누르고 소리가 나는 일본어 영상을 재생하세요.",
     "들린 대사가 한 줄씩 카드가 돼요. GAKU가 어떤 대사를 알아듣지 못하면 다시 들려 달라고 해요. 듣고 있던 영상이나 오디오를 다시 재생해 주세요.",
     "\"How would you respond?\"를 눌러 자연스러운 대답을 연습하세요."
    ],
    "example": "예: YouTube 대화를 재생 → 4개의 보기 중에서 가장 좋은 대답 고르기.",
    "intensive": "대답을 소리 내어 말하면 GAKU가 내 일본어를 확인해요. Intensive Mode는 말한 대답마다 맞았는지, 어떤 종류의 실수(조사, 동사 형태, 단어 선택, 어순, 철자)를 했는지, 그리고 반복해서 틀리는 단어를 기록해요. 그런 다음 오늘 집중할 부분을 제안해 줘요."
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "일본어를 소리 내어 읽거나(또는 듣고 따라 하고), 내 말이 얼마나 비슷했는지 확인해요.",
    "steps": [
     "일본어 글을 붙여 넣어 문구를 만드세요.",
     "듣고 나서 직접 말하는 것을 녹음하세요.",
     "결과를 확인하고 다시 해 보세요."
    ],
    "example": "예: 노래 가사 한 줄 붙여 넣기 → 말해 보기 → 점수 확인.",
    "intensive": "Intensive Mode는 발음을 시도할 때마다 결과(와 점수)를 기록해서, 계속 틀리는 문구를 찾아 추가 연습으로 제안해 줘요."
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "글을 따라 쓰거나 질문에 답하면서 일본어 쓰기를 연습해요.",
    "steps": [
     "모드(Copying down 또는 Questions)를 고르세요.",
     "글을 고르거나 Library에서 단어를 고르세요.",
     "답을 입력하고 확인하세요."
    ],
    "example": "예: 만화 장면에서 문장 3개를 따라 쓴 다음, 입력한 것을 확인하기.",
    "intensive": "Intensive Mode는 쓰기 정확도를 더 꼼꼼하게 측정해요. Copying down에서는 모든 글자와 획을 기록해요. Questions 모드에서는 GAKU가 답을 확인하고, 실수의 종류(조사, 동사 형태, 단어 선택, 어순, 철자)와 틀린 단어를 기록해요. 그런 다음 가장 자주 하는 실수와 오늘 연습할 것을 알려 줘요."
   }
  }
 },
 "Thai": {
  "labels": {
   "how": "วิธีใช้",
   "what": "นี่คืออะไร?",
   "steps": "3 ขั้นตอน",
   "close": "ปิด",
   "never": "ไม่ต้องแสดงอีก",
   "tryIntensive": "ลอง Intensive Mode"
  },
  "firstSteps": {
   "title": "ก้าวแรกของคุณ",
   "sub": "ใช้เวลาประมาณ 3 นาที",
   "profile": "ตั้งค่าโปรไฟล์ของคุณ",
   "content": "ลองใช้ Create From Content (1 นาที)",
   "word": "บันทึกคำศัพท์คำแรกของคุณ",
   "go": "ไปเลย →",
   "allDone": "🎉 เริ่มต้นได้ดีมาก! คุณทำก้าวแรกครบแล้ว",
   "ok": "OK",
   "hide": "ซ่อน",
   "progress": "เสร็จแล้ว {n} / {m}"
  },
  "hints": {
   "vocab_search": "พิมพ์คำศัพท์หนึ่งคำแล้วค้นหา จากนั้นบันทึกลงใน Library ของคุณ",
   "content_sample": "เราใส่ข้อความตัวอย่างไว้ให้แล้ว แตะปุ่มด้านล่างได้เลย หรือจะวางข้อความของคุณเองก็ได้",
   "content_analyze": "แตะตรงนี้ แล้วกิจกรรมแรกของคุณจะพร้อมในเวลาประมาณ 1 นาที"
  },
  "sections": {
   "schedule": {
    "title": "ตารางเรียน",
    "what": "แผนการเรียนรายสัปดาห์ของคุณเอง สร้างให้คุณครั้งเดียวและจะไม่เปลี่ยน เว้นแต่คุณกด \"Update my study guide\" ใน Edit Profile",
    "steps": [
     "เปิดงานของวันนี้ แล้วทำตามลำดับ",
     "แตะลิงก์ของงาน หรือปุ่ม \"Go to…\" เพื่อเปิดเครื่องมือที่ถูกต้อง",
     "ติ๊กช่องเมื่อทำเสร็จ แล้วสตรีคและความก้าวหน้าของคุณจะเพิ่มขึ้น"
    ],
    "example": "ตัวอย่าง: \"อ่านฉากมังงะ\" → แตะลิงก์ → กลับมา → ติ๊กช่อง",
    "intensive": "ที่ด้านบนของหน้าจอนี้ Intensive Mode จะแสดงเป้าหมายรายวัน (8 กิจกรรมต่อวัน) และเตือนคุณถ้าคุณทำตามไม่ทัน นอกจากนี้ยังดูการเรียนย้อนหลัง 14 วันของคุณ และแนะนำหัวข้อที่คุณทำผิดบ่อยที่สุด คุณจะได้รู้ว่าวันนี้ควรฝึกอะไร"
   },
   "vocabulary": {
    "title": "คำศัพท์",
    "what": "ค้นหาคำศัพท์ใดก็ได้ แล้วบันทึกลงโฟลเดอร์ของคุณเอง (Library) เพื่อทบทวนภายหลัง",
    "steps": [
     "พิมพ์คำภาษาอังกฤษหรือภาษาญี่ปุ่น แล้วค้นหา",
     "แตะ Save แล้วเลือกโฟลเดอร์",
     "เปิด Library เพื่อทบทวนด้วย flashcards หรือฟังเสียงอ่าน"
    ],
    "example": "ตัวอย่าง: ค้นหา \"階段\" → Save → ทบทวนในโฟลเดอร์ \"Daily life\" ของคุณ"
   },
   "subtitles": {
    "title": "คำบรรยาย",
    "what": "บันทึกคำและประโยคจากวิดีโอที่คุณดู เพื่อนำมาเรียนภายหลัง",
    "steps": [
     "วางประโยคคำบรรยายหรือคำศัพท์จากวิดีโอ",
     "บันทึกลงในรายการของคุณ",
     "กลับมาทบทวนประโยคที่คุณบันทึกไว้"
    ],
    "example": "ตัวอย่าง: วางประโยคจากอนิเมะหนึ่งตอน → บันทึก → ทบทวนพรุ่งนี้"
   },
   "milestones": {
    "title": "เป้าหมายสำคัญ",
    "what": "แผนที่เป้าหมายและการเช็กความก้าวหน้าของคุณ เพื่อให้เห็นว่าคุณมาไกลแค่ไหนแล้ว",
    "steps": [
     "อ่านขั้นตอนในแผนที่เป้าหมายของคุณ",
     "ใช้การเช็กความก้าวหน้าเพื่อดูว่าตอนนี้คุณอยู่ตรงไหน",
     "รักษาสตรีคไว้เพื่อก้าวต่อไป"
    ],
    "example": "ตัวอย่าง: ทำงานของสัปดาห์นี้ให้ครบ เพื่อไปถึงเป้าหมายสำคัญถัดไป"
   },
   "jlpt": {
    "title": "ผล JLPT",
    "what": "ผลวินิจฉัย JLPT ของคุณที่ครูส่งมาจะแสดงที่นี่",
    "steps": [
     "รอให้ครูส่งผลของคุณมา",
     "เปิดแท็บนี้เพื่อดูผล",
     "แตะ Download PDF เพื่อบันทึก"
    ],
    "example": "ตัวอย่าง: หลังจากทำข้อสอบจำลอง รายงานผลของคุณจะปรากฏที่นี่"
   },
   "feedback": {
    "title": "ข้อเสนอแนะ",
    "what": "บอกเราว่าควรปรับปรุงอะไรใน GAKU Master",
    "steps": [
     "เขียนความคิดหรือปัญหาของคุณ",
     "แตะ Send",
     "กรุณาใช้คำสุภาพ เราไม่รับข้อความที่หยาบคาย"
    ],
    "example": "ตัวอย่าง: \"ช่วยเพิ่มแบบฝึกหัดไวยากรณ์ N4 อีกหน่อยนะ\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "ค้นหาคำศัพท์ใดก็ได้แล้วเปิด word card ของคำนั้น ดูความหมาย คำอ่าน และประโยคตัวอย่าง",
    "steps": [
     "พิมพ์คำภาษาอังกฤษหรือภาษาญี่ปุ่น (หรือหัวข้อ) แล้วแตะ Search",
     "แตะผลลัพธ์เพื่อเปิดการ์ด",
     "บันทึกลงโฟลเดอร์เพื่อทบทวนภายหลัง"
    ],
    "example": "ตัวอย่าง: ค้นหา \"階段\" → เปิดการ์ด → Save ลงโฟลเดอร์ \"Daily life\" ของคุณ"
   },
   "vocab_library": {
    "title": "Library",
    "what": "คำศัพท์ทั้งหมดที่คุณบันทึกไว้ แยกเป็นโฟลเดอร์",
    "steps": [
     "แตะโฟลเดอร์เพื่อดู word cards ข้างใน",
     "แตะ 🔊 ▶ ที่โฟลเดอร์เพื่อฟังคำทั้งหมดต่อกันไป",
     "แตะ \"Quick review with Flashcards\" เพื่อฝึกคำศัพท์ของคุณ"
    ],
    "example": "เคล็ดลับ: สร้างโฟลเดอร์ของคุณเองด้วย \"New folder\" (เช่น หนึ่งโฟลเดอร์ต่อหนึ่งบทเรียน)"
   },
   "vocab_folder": {
    "title": "Word cards ในโฟลเดอร์นี้",
    "what": "แต่ละกล่องด้านล่างคือ word card หนึ่งใบ ซึ่งเป็นคำที่คุณบันทึกไว้",
    "steps": [
     "แตะ word card เพื่อเปิด: ความหมาย คำอ่าน และประโยคตัวอย่าง",
     "แตะ 🔊 เพื่อฟังคำนั้น แตะ 🔊 ▶ All (มุมขวาบน) เพื่อฟังทุกคำในโฟลเดอร์นี้",
     "แตะ Go Flashcard เพื่อฝึกเฉพาะคำนั้น แตะรูปถังขยะเพื่อลบการ์ด"
    ],
    "example": "เคล็ดลับ: \"📋 Copy to folder\" จะคัดลอกคำศัพท์ไปยังโฟลเดอร์อื่น (เช่น โฟลเดอร์ของบทเรียนถัดไป)"
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "ฝึกคำศัพท์ที่คุณบันทึกไว้เหมือนบัตรคำกระดาษ แตะการ์ดเพื่อพลิกและดูคำตอบ",
    "steps": [
     "ดูคำศัพท์แล้วลองนึกความหมาย ถ้าต้องการคำอ่านให้แตะ Hint จากนั้นแตะการ์ดเพื่อดูคำตอบ",
     "ถ้าคุณรู้คำนี้ ให้แตะ ✅ Understand คำนั้นจะย้ายไปที่โฟลเดอร์ \"Understood\" คุณจึงทบทวนเฉพาะคำที่ยังไม่รู้ได้ คำนั้นยังบันทึกอยู่ใน Library ของคุณ ไม่หายไปไหน",
     "ถ้าคุณไม่รู้ อย่ากดอะไร แค่แตะ → เพื่อไปการ์ดใบถัดไป คำนั้นจะยังอยู่ในสำรับของคุณ"
    ],
    "example": "Intensive Mode จะบันทึกว่าคุณพลิกการ์ดแต่ละใบเร็วแค่ไหน และกด Understand กี่ครั้ง แล้วนำไปใช้บอกว่าคำไหนที่คุณรู้จริง และคำไหนที่ยังไม่รู้",
    "action": "ลอง Intensive Mode"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "คัดภาษาญี่ปุ่นทีละตัวอักษร โดยเขียนแต่ละขีดด้วยนิ้วหรือเมาส์ GAKU จะตรวจลำดับขีดและรูปร่างของตัวอักษรให้คุณ",
    "steps": [
     "วางประโยคภาษาญี่ปุ่นในช่อง หรือแตะ \"Choose words from your Library\" เพื่อใช้คำที่คุณบันทึกไว้",
     "แตะ \"Start writing\"",
     "เขียนตัวอักษรทีละตัว ทีละขีด"
    ],
    "example": "เคล็ดลับ: ฝึกได้ครั้งละไม่เกิน 30 ตัวอักษร"
   },
   "res_writing_copy_write": {
    "title": "เขียนทีละตัวอักษร",
    "what": "คุณเขียนทีละตัวอักษร จากข้อความที่คุณวางไว้ หรือคำที่คุณเลือกจาก Library",
    "steps": [
     "เขียนตัวอักษรทีละขีดตามลำดับที่ถูกต้อง GAKU จะบอกเมื่อคุณเขียนขีดผิด",
     "ไม่แน่ใจว่าเขียนยังไง? แตะ ▶ Watch stroke order อยากลองอีกครั้ง? แตะ ↺ Try again",
     "เมื่อเขียนตัวอักษรเสร็จ แตะปุ่ม Next ▶ สีน้ำเงิน ที่ตัวอักษรสุดท้ายปุ่มจะเป็น Finish"
    ],
    "notes": [
     "ไกด์คือเส้นขอบตัวอักษรสีเทาจาง ๆ เมื่อใช้ 👁 Show guide คุณจะเขียนทับเส้นนั้นได้ เมื่อใช้ 🙈 Hide guide คุณจะเขียนจากความจำ",
     "ข้อความใหม่จะพาคุณกลับไปหน้าจอก่อนหน้า ซึ่งคุณเลือกคำ ตัวอักษร หรือประโยคใหม่ได้"
    ],
    "example": "Intensive Mode วัดการเขียนของคุณได้แม่นยำขึ้น และวิเคราะห์ตัวอักษร คำ และประโยคที่คุณรู้สึกว่ายาก",
    "action": "ลอง Intensive Mode"
   },
   "res_links": {
    "title": "แหล่งเรียนรู้",
    "what": "เว็บไซต์ วิดีโอ และแอปที่คัดมาแล้ว ให้เหมาะกับระดับและทักษะของคุณ",
    "steps": [
     "ดูการ์ดด้านล่าง (แต่ละการ์ดคือวิดีโอหรือเว็บไซต์) ซึ่งคัดมาให้เหมาะกับระดับของคุณ",
     "แตะปุ่ม Open บนการ์ดที่คุณชอบ",
     "ใช้ GAKU Reader บนหน้านั้นเพื่อค้นหาคำที่คุณไม่รู้"
    ],
    "example": "ตัวอย่าง: เปิดเว็บไซต์อ่านที่แนะนำ แล้วอ่านสั้น ๆ หนึ่งหน้า"
   },
   "res_content": {
    "title": "Create From Content",
    "what": "วางภาษาญี่ปุ่นที่คุณกำลังอ่านหรือดู แล้ว GAKU จะเปลี่ยนให้เป็นคำถามฝึกหัด",
    "steps": [
     "วางข้อความภาษาญี่ปุ่น (บทความ คำบรรยาย หรือข้อความแชท)",
     "แตะ Analyze เพื่อสร้างคำถาม",
     "ตอบคำถาม และเปิดฟุริงานะ / โรมาจิ / คำแปล ถ้าต้องการความช่วยเหลือ"
    ],
    "example": "ตัวอย่าง: วางประกาศของอพาร์ตเมนต์ → ได้คำถามเรื่องความหมาย คันจิ และไวยากรณ์จากประกาศนั้น"
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "เปิดวิดีโอจริงใกล้ไมค์ของคุณ GAKU จะฟัง แสดงประโยคจริง และช่วยให้คุณตอบกลับได้",
    "steps": [
     "แตะปุ่มฟัง แล้วเปิดวิดีโอภาษาญี่ปุ่นที่มีเสียง",
     "ประโยคที่ได้ยินแต่ละประโยคจะกลายเป็นการ์ด ถ้า GAKU จับประโยคไม่ได้ จะขอให้คุณฟังอีกครั้ง กรุณาเปิดวิดีโอหรือเสียงที่คุณกำลังฟังซ้ำ",
     "แตะ \"How would you respond?\" เพื่อฝึกตอบอย่างเป็นธรรมชาติ"
    ],
    "example": "ตัวอย่าง: เปิดบทสนทนาจาก YouTube → เลือกคำตอบที่ดีที่สุดจาก 4 ตัวเลือก",
    "intensive": "เมื่อคุณพูดตอบ GAKU จะตรวจภาษาญี่ปุ่นของคุณ Intensive Mode จะบันทึกว่าคำตอบที่พูดแต่ละครั้งถูกหรือไม่ และคุณผิดแบบไหน (คำช่วย รูปกริยา การเลือกคำ ลำดับคำ หรือการสะกด) รวมทั้งคำที่ผิดซ้ำ ๆ แล้วแนะนำว่าวันนี้ควรเน้นอะไร"
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "อ่านภาษาญี่ปุ่นออกเสียง (หรือฟังแล้วพูดตาม) และดูว่าการพูดของคุณใกล้เคียงแค่ไหน",
    "steps": [
     "วางข้อความภาษาญี่ปุ่นเพื่อรับวลี",
     "ฟัง แล้วอัดเสียงตัวเองพูด",
     "ดูผลของคุณ แล้วลองอีกครั้ง"
    ],
    "example": "ตัวอย่าง: วางท่อนเพลงสั้น ๆ → พูดตาม → ดูคะแนนของคุณ",
    "intensive": "Intensive Mode จะบันทึกผลของการลองออกเสียงทุกครั้ง (และคะแนนของคุณ) เพื่อหาวลีที่คุณพูดผิดบ่อย ๆ แล้วแนะนำให้ฝึกเพิ่ม"
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "ฝึกเขียนภาษาญี่ปุ่นด้วยการคัดข้อความ หรือตอบคำถาม",
    "steps": [
     "เลือกโหมด (Copying down หรือ Questions)",
     "เลือกข้อความ หรือเลือกคำจาก Library ของคุณ",
     "พิมพ์คำตอบของคุณแล้วตรวจสอบ"
    ],
    "example": "ตัวอย่าง: คัด 3 ประโยคจากฉากมังงะ แล้วตรวจสอบสิ่งที่คุณพิมพ์",
    "intensive": "Intensive Mode วัดความแม่นยำในการเขียนของคุณอย่างละเอียดขึ้น ในโหมด Copying down จะบันทึกทุกตัวอักษรและทุกขีด ในโหมด Questions GAKU จะตรวจคำตอบของคุณ และบันทึกประเภทของข้อผิดพลาด (คำช่วย รูปกริยา การเลือกคำ ลำดับคำ หรือการสะกด) และคำที่ผิด แล้วบอกว่าคุณผิดเรื่องไหนบ่อยที่สุด และวันนี้ควรฝึกอะไร"
   }
  }
 },
 "Malay": {
  "labels": {
   "how": "Cara menggunakan",
   "what": "Apakah ini?",
   "steps": "3 langkah",
   "close": "Tutup",
   "never": "Jangan tunjuk lagi",
   "tryIntensive": "Cuba Intensive Mode"
  },
  "firstSteps": {
   "title": "Langkah pertama anda",
   "sub": "Mengambil masa kira-kira 3 minit",
   "profile": "Sediakan profil anda",
   "content": "Cuba Create From Content (1 min)",
   "word": "Simpan perkataan pertama anda",
   "go": "Pergi →",
   "allDone": "🎉 Permulaan yang bagus! Anda sudah menyelesaikan langkah pertama anda.",
   "ok": "OK",
   "hide": "Sembunyikan",
   "progress": "{n} / {m} selesai"
  },
  "hints": {
   "vocab_search": "Taip satu perkataan dan cari — kemudian simpan ke Library anda.",
   "content_sample": "Kami telah menambah teks contoh untuk anda. Tekan butang di bawah — atau tampal teks anda sendiri.",
   "content_analyze": "Tekan di sini — aktiviti pertama anda akan siap dalam kira-kira satu minit."
  },
  "sections": {
   "schedule": {
    "title": "Jadual",
    "what": "Pelan belajar mingguan peribadi anda. Ia dibuat sekali sahaja untuk anda dan tidak akan berubah kecuali anda menekan \"Update my study guide\" dalam Edit Profile.",
    "steps": [
     "Buka tugasan hari ini dan lakukan satu demi satu mengikut urutan.",
     "Tekan pautan tugasan atau butang \"Go to…\" untuk membuka alat yang betul.",
     "Tandakan kotak apabila anda selesai — streak dan kemajuan anda akan bertambah."
    ],
    "example": "Contoh: \"Read a manga scene\" → tekan pautan → kembali → tandakan.",
    "intensive": "Di bahagian atas skrin ini, Intensive Mode menunjukkan sasaran harian (8 tindakan sehari) dan memberi amaran jika anda ketinggalan. Ia juga melihat pembelajaran anda sepanjang 14 hari lepas dan mencadangkan bahagian yang paling banyak anda buat kesilapan, supaya anda tahu apa yang perlu dilatih hari ini."
   },
   "vocabulary": {
    "title": "Perbendaharaan kata",
    "what": "Cari mana-mana perkataan dan simpan ke folder anda sendiri (Library) untuk diulang kaji kemudian.",
    "steps": [
     "Taip perkataan dalam bahasa Inggeris atau Jepun dan cari.",
     "Tekan Save dan pilih folder.",
     "Buka Library untuk mengulang kaji dengan flashcard atau dengar sebutan."
    ],
    "example": "Contoh: cari \"階段\" → Save → ulang kaji dalam folder \"Daily life\" anda."
   },
   "subtitles": {
    "title": "Sari kata",
    "what": "Simpan perkataan dan ayat daripada video yang anda tonton, supaya anda boleh belajar kemudian.",
    "steps": [
     "Tampal baris sari kata atau perkataan daripada video.",
     "Simpan ke senarai anda.",
     "Kembali untuk mengulang kaji baris yang anda simpan."
    ],
    "example": "Contoh: tampal satu baris daripada episod anime → simpan → ulang kaji esok."
   },
   "milestones": {
    "title": "Pencapaian",
    "what": "Peta jalan matlamat dan semakan kemajuan anda, supaya anda nampak sejauh mana anda sudah maju.",
    "steps": [
     "Baca langkah peta jalan untuk matlamat anda.",
     "Gunakan semakan kemajuan untuk melihat kedudukan anda.",
     "Teruskan streak anda untuk terus maju."
    ],
    "example": "Contoh: siapkan tugasan minggu ini untuk sampai ke pencapaian seterusnya."
   },
   "jlpt": {
    "title": "Keputusan JLPT",
    "what": "Keputusan diagnosis JLPT anda yang dihantar oleh guru anda akan muncul di sini.",
    "steps": [
     "Tunggu guru anda menghantar keputusan anda.",
     "Buka tab ini untuk melihatnya.",
     "Tekan Download PDF untuk menyimpannya."
    ],
    "example": "Contoh: selepas ujian percubaan anda, laporan keputusan anda muncul di sini."
   },
   "feedback": {
    "title": "Maklum balas",
    "what": "Beritahu kami apa yang perlu diperbaiki dalam GAKU Master.",
    "steps": [
     "Tulis idea atau masalah anda.",
     "Tekan Send.",
     "Sila bersopan — mesej kesat tidak diterima."
    ],
    "example": "Contoh: \"Tolong tambah lebih banyak soalan tatabahasa N4.\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "Cari mana-mana perkataan dan buka word card-nya — makna, bacaan dan contoh ayat.",
    "steps": [
     "Taip perkataan Inggeris atau Jepun (atau topik) dan tekan Search.",
     "Tekan satu hasil untuk membuka kadnya.",
     "Simpan ke folder supaya anda boleh mengulang kaji kemudian."
    ],
    "example": "Contoh: cari \"階段\" → buka kad → Save ke folder \"Daily life\" anda."
   },
   "vocab_library": {
    "title": "Library",
    "what": "Semua perkataan yang anda simpan, disusun dalam folder.",
    "steps": [
     "Tekan folder untuk melihat word card di dalamnya.",
     "Tekan 🔊 ▶ pada folder untuk mendengar semua perkataannya satu demi satu.",
     "Tekan \"Quick review with Flashcards\" untuk melatih perkataan anda."
    ],
    "example": "Tip: buat folder anda sendiri dengan \"New folder\" (contohnya, satu folder untuk setiap pelajaran)."
   },
   "vocab_folder": {
    "title": "Word card dalam folder ini",
    "what": "Setiap kotak di bawah ialah satu word card — perkataan yang anda simpan.",
    "steps": [
     "Tekan word card untuk membukanya: makna, bacaan dan contoh ayat.",
     "Tekan 🔊 untuk mendengar perkataan. Tekan 🔊 ▶ All (kanan atas) untuk mendengar setiap perkataan dalam folder ini.",
     "Tekan Go Flashcard untuk melatih perkataan itu sahaja. Tekan tong sampah untuk memadam kad."
    ],
    "example": "Tip: \"📋 Copy to folder\" menyalin perkataan ke folder lain (contohnya, folder pelajaran anda yang seterusnya)."
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "Latih perkataan yang anda simpan seperti flashcard kertas. Tekan kad untuk membaliknya dan semak jawapan.",
    "steps": [
     "Lihat perkataan dan cuba ingat maknanya. Tekan Hint jika anda perlukan bacaan, kemudian tekan kad untuk melihat jawapan.",
     "Jika anda tahu, tekan ✅ Understand. Perkataan itu berpindah ke folder \"Understood\", jadi anda boleh mengulang kaji hanya perkataan yang anda belum tahu. Ia masih tersimpan dalam Library anda — tiada apa yang hilang.",
     "Jika anda tidak tahu, jangan tekan apa-apa. Cuma tekan → untuk kad seterusnya; ia kekal dalam dek anda."
    ],
    "example": "Intensive Mode merekodkan betapa cepat anda membalik setiap kad dan berapa kali anda menekan Understand, dan menggunakannya untuk menunjukkan perkataan mana yang benar-benar anda tahu dan yang tidak.",
    "action": "Cuba Intensive Mode"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "Salin tulisan Jepun satu aksara demi satu, lukis setiap coretan dengan jari atau tetikus anda. GAKU menyemak urutan coretan dan bentuk anda.",
    "steps": [
     "Tampal ayat Jepun dalam kotak, atau tekan \"Choose words from your Library\" untuk menggunakan perkataan yang anda simpan.",
     "Tekan \"Start writing\".",
     "Tulis setiap aksara, satu coretan demi satu."
    ],
    "example": "Tip: sehingga 30 aksara dilatih pada satu masa."
   },
   "res_writing_copy_write": {
    "title": "Menulis satu aksara demi satu",
    "what": "Anda menulis, satu aksara demi satu, teks yang anda tampal atau perkataan yang anda pilih daripada Library anda.",
    "steps": [
     "Tulis aksara itu satu coretan demi satu, mengikut urutan yang betul. GAKU memberitahu anda apabila ada coretan yang salah.",
     "Tidak pasti cara menulisnya? Tekan ▶ Watch stroke order. Mahu cuba lagi? Tekan ↺ Try again.",
     "Apabila anda selesai satu aksara, tekan butang biru Next ▶. Pada aksara terakhir, ia tertulis Finish."
    ],
    "notes": [
     "Panduan ialah garis besar aksara yang kelabu pudar. Dengan 👁 Show guide anda boleh mengikut garisan itu; dengan 🙈 Hide guide anda menulis dari ingatan.",
     "Teks baharu membawa anda kembali ke skrin sebelumnya, di mana anda memilih perkataan, aksara atau ayat baharu."
    ],
    "example": "Intensive Mode mengukur tulisan anda dengan lebih tepat dan menganalisis aksara, perkataan dan ayat yang anda rasa sukar.",
    "action": "Cuba Intensive Mode"
   },
   "res_links": {
    "title": "Sumber",
    "what": "Laman web, video dan aplikasi pilihan untuk tahap dan kemahiran anda.",
    "steps": [
     "Lihat kad di bawah (setiap kad ialah video atau laman web). Kad ini dipilih mengikut tahap anda.",
     "Tekan butang Open pada kad yang anda suka.",
     "Gunakan GAKU Reader pada halaman itu untuk mencari perkataan yang anda tidak tahu."
    ],
    "example": "Contoh: buka laman bacaan yang disyorkan dan baca satu halaman pendek."
   },
   "res_content": {
    "title": "Create From Content",
    "what": "Tampal mana-mana teks Jepun yang anda baca atau tonton, dan GAKU menukarkannya menjadi soalan latihan.",
    "steps": [
     "Tampal teks Jepun (artikel, sari kata, mesej).",
     "Tekan Analyze untuk membuat soalan.",
     "Jawab soalan itu, dan hidupkan furigana / romaji / terjemahan jika anda perlukan bantuan."
    ],
    "example": "Contoh: tampal notis pangsapuri → dapatkan soalan makna, kanji dan tatabahasa daripadanya."
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "Mainkan video sebenar berhampiran mikrofon anda. GAKU mendengar, menunjukkan ayat sebenar, dan membantu anda membalas.",
    "steps": [
     "Tekan butang dengar dan mainkan video Jepun dengan bunyi.",
     "Setiap baris yang anda dengar menjadi satu kad. Jika GAKU tidak dapat menangkap sesuatu baris, ia akan meminta anda mendengar semula — sila mainkan semula video atau audio yang anda dengar.",
     "Tekan \"How would you respond?\" untuk melatih balasan yang semula jadi."
    ],
    "example": "Contoh: mainkan perbualan YouTube → pilih balasan terbaik daripada 4 pilihan.",
    "intensive": "Apabila anda menyebut balasan anda, GAKU menyemak bahasa Jepun anda. Intensive Mode merekodkan sama ada setiap jawapan lisan betul dan jenis kesilapan yang anda buat (partikel, bentuk kata kerja, pilihan perkataan, susunan perkataan atau ejaan), serta perkataan yang berulang kali salah. Kemudian ia mencadangkan apa yang perlu ditumpukan hari ini."
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "Baca bahasa Jepun dengan kuat (atau dengar dan ulang) dan lihat sejauh mana sebutan anda hampir betul.",
    "steps": [
     "Tampal teks Jepun untuk mendapatkan frasa.",
     "Dengar, kemudian rakam diri anda menyebutnya.",
     "Semak keputusan anda dan cuba lagi."
    ],
    "example": "Contoh: tampal satu baris lagu pendek → sebutkannya → lihat skor anda.",
    "intensive": "Intensive Mode merekodkan keputusan setiap percubaan sebutan (dan skor anda), supaya ia dapat mencari frasa yang anda sentiasa salah dan mencadangkannya untuk latihan tambahan."
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "Latih menulis bahasa Jepun dengan menyalin teks atau menjawab soalan.",
    "steps": [
     "Pilih mod (Copying down atau Questions).",
     "Pilih teks, atau pilih perkataan daripada Library anda.",
     "Taip jawapan anda dan semaknya."
    ],
    "example": "Contoh: salin 3 ayat daripada adegan manga, kemudian semak taipan anda.",
    "intensive": "Intensive Mode mengukur ketepatan tulisan anda dengan lebih teliti. Dalam Copying down, ia merekodkan setiap aksara dan coretan. Dalam mod Questions, GAKU menyemak jawapan anda dan merekodkan jenis kesilapan (partikel, bentuk kata kerja, pilihan perkataan, susunan perkataan atau ejaan) dan perkataan yang salah. Kemudian ia menunjukkan kesilapan yang paling kerap anda buat dan apa yang perlu dilatih hari ini."
   }
  }
 },
 "Indonesian": {
  "labels": {
   "how": "Cara menggunakan",
   "what": "Apa ini?",
   "steps": "3 langkah",
   "close": "Tutup",
   "never": "Jangan tampilkan lagi",
   "tryIntensive": "Coba Intensive Mode"
  },
  "firstSteps": {
   "title": "Langkah pertamamu",
   "sub": "Hanya sekitar 3 menit",
   "profile": "Atur profilmu",
   "content": "Coba Create From Content (1 menit)",
   "word": "Simpan kata pertamamu",
   "go": "Mulai →",
   "allDone": "🎉 Awal yang bagus! Kamu sudah menyelesaikan langkah pertamamu.",
   "ok": "OK",
   "hide": "Sembunyikan",
   "progress": "{n} / {m} selesai"
  },
  "hints": {
   "vocab_search": "Ketik satu kata lalu cari — kemudian simpan ke Library-mu.",
   "content_sample": "Kami sudah menambahkan teks contoh untukmu. Cukup ketuk tombol di bawah — atau tempel teksmu sendiri.",
   "content_analyze": "Ketuk di sini — aktivitas pertamamu akan siap dalam sekitar satu menit."
  },
  "sections": {
   "schedule": {
    "title": "Jadwal",
    "what": "Rencana belajar mingguan pribadimu. Rencana ini dibuat sekali untukmu dan tidak akan berubah kecuali kamu menekan \"Update my study guide\" di Edit Profile.",
    "steps": [
     "Buka tugas hari ini dan kerjakan satu per satu secara berurutan.",
     "Ketuk tautan tugas atau tombol \"Go to…\" untuk membuka alat yang tepat.",
     "Centang kotaknya saat selesai — streak dan kemajuanmu akan bertambah."
    ],
    "example": "Contoh: \"Read a manga scene\" → ketuk tautan → kembali → centang.",
    "intensive": "Di bagian atas layar ini, Intensive Mode menampilkan target harian (8 aksi per hari) dan memperingatkanmu jika kamu tertinggal. Fitur ini juga melihat belajarmu selama 14 hari terakhir dan menyarankan bagian yang paling sering kamu salahi, supaya kamu tahu apa yang perlu dilatih hari ini."
   },
   "vocabulary": {
    "title": "Kosakata",
    "what": "Cari kata apa saja dan simpan ke folder milikmu sendiri (Library) untuk diulang nanti.",
    "steps": [
     "Ketik kata dalam bahasa Inggris atau Jepang lalu cari.",
     "Ketuk Save dan pilih folder.",
     "Buka Library untuk mengulang dengan flashcard atau mendengarkan pelafalan."
    ],
    "example": "Contoh: cari \"階段\" → Save → ulangi di folder \"Daily life\" milikmu."
   },
   "subtitles": {
    "title": "Subtitle",
    "what": "Simpan kata dan kalimat dari video yang kamu tonton, supaya bisa kamu pelajari nanti.",
    "steps": [
     "Tempel satu baris subtitle atau kata dari video.",
     "Simpan ke daftarmu.",
     "Kembali lagi untuk mengulang baris yang sudah kamu simpan."
    ],
    "example": "Contoh: tempel satu baris dari episode anime → simpan → ulangi besok."
   },
   "milestones": {
    "title": "Tonggak pencapaian",
    "what": "Peta jalan tujuan dan pengecekan kemajuanmu, supaya kamu bisa melihat sejauh mana kamu sudah melangkah.",
    "steps": [
     "Baca langkah-langkah peta jalan untuk tujuanmu.",
     "Gunakan pengecekan kemajuan untuk melihat posisimu.",
     "Jaga streak-mu agar terus maju."
    ],
    "example": "Contoh: selesaikan tugas minggu ini untuk mencapai tonggak berikutnya."
   },
   "jlpt": {
    "title": "Hasil JLPT",
    "what": "Hasil diagnosis JLPT-mu yang dikirim oleh gurumu muncul di sini.",
    "steps": [
     "Tunggu gurumu mengirim hasilmu.",
     "Buka tab ini untuk melihatnya.",
     "Ketuk Download PDF untuk menyimpannya."
    ],
    "example": "Contoh: setelah tes cobamu, laporan hasilmu muncul di sini."
   },
   "feedback": {
    "title": "Masukan",
    "what": "Beri tahu kami apa yang perlu diperbaiki di GAKU Master.",
    "steps": [
     "Tulis ide atau masalahmu.",
     "Ketuk Send.",
     "Mohon bersikap baik — pesan kasar tidak diterima."
    ],
    "example": "Contoh: \"Tolong tambahkan lebih banyak soal tata bahasa N4.\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "Cari kata apa saja dan buka word card-nya — arti, cara baca, dan contoh kalimat.",
    "steps": [
     "Ketik kata bahasa Inggris atau Jepang (atau topik) lalu ketuk Search.",
     "Ketuk satu hasil untuk membuka kartunya.",
     "Simpan ke folder supaya bisa diulang nanti."
    ],
    "example": "Contoh: cari \"階段\" → buka kartu → Save ke folder \"Daily life\" milikmu."
   },
   "vocab_library": {
    "title": "Library",
    "what": "Semua kata yang kamu simpan, dikelompokkan dalam folder.",
    "steps": [
     "Ketuk folder untuk melihat word card di dalamnya.",
     "Ketuk 🔊 ▶ pada folder untuk mendengar semua katanya satu per satu.",
     "Ketuk \"Quick review with Flashcards\" untuk melatih kata-katamu."
    ],
    "example": "Tips: buat folder sendiri dengan \"New folder\" (misalnya, satu folder untuk setiap pelajaran)."
   },
   "vocab_folder": {
    "title": "Word card di folder ini",
    "what": "Setiap kotak di bawah adalah satu word card — kata yang kamu simpan.",
    "steps": [
     "Ketuk word card untuk membukanya: arti, cara baca, dan contoh kalimat.",
     "Ketuk 🔊 untuk mendengar katanya. Ketuk 🔊 ▶ All (kanan atas) untuk mendengar semua kata di folder ini.",
     "Ketuk Go Flashcard untuk melatih kata itu saja. Ketuk ikon tempat sampah untuk menghapus kartu."
    ],
    "example": "Tips: \"📋 Copy to folder\" menyalin kata ke folder lain (misalnya, folder pelajaran berikutnya)."
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "Latih kata-kata yang kamu simpan seperti flashcard kertas. Ketuk kartu untuk membaliknya dan memeriksa jawaban.",
    "steps": [
     "Lihat kata itu dan coba ingat artinya. Ketuk Hint jika butuh cara baca, lalu ketuk kartu untuk melihat jawaban.",
     "Jika kamu tahu, ketuk ✅ Understand. Kata itu pindah ke folder \"Understood\", jadi kamu bisa mengulang hanya kata yang belum kamu tahu. Kata itu tetap tersimpan di Library-mu — tidak ada yang hilang.",
     "Jika kamu tidak tahu, jangan tekan apa pun. Cukup ketuk → untuk kartu berikutnya; kartu itu tetap ada di dekmu."
    ],
    "example": "Intensive Mode mencatat seberapa cepat kamu membalik setiap kartu dan berapa kali kamu menekan Understand, lalu memakainya untuk menunjukkan kata mana yang benar-benar kamu tahu dan mana yang belum.",
    "action": "Coba Intensive Mode"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "Salin tulisan Jepang satu karakter demi satu karakter, gambar setiap goresan dengan jari atau mouse. GAKU memeriksa urutan goresan dan bentuknya.",
    "steps": [
     "Tempel kalimat Jepang di kotak, atau ketuk \"Choose words from your Library\" untuk memakai kata yang kamu simpan.",
     "Ketuk \"Start writing\".",
     "Tulis setiap karakter, satu goresan demi satu goresan."
    ],
    "example": "Tips: maksimal 30 karakter dilatih sekaligus."
   },
   "res_writing_copy_write": {
    "title": "Menulis satu karakter demi satu karakter",
    "what": "Kamu menulis, satu karakter demi satu karakter, teks yang kamu tempel atau kata yang kamu pilih dari Library-mu.",
    "steps": [
     "Tulis karakter itu satu goresan demi satu goresan, dengan urutan yang benar. GAKU memberi tahu jika ada goresan yang salah.",
     "Tidak tahu cara menulisnya? Ketuk ▶ Watch stroke order. Mau mencoba lagi? Ketuk ↺ Try again.",
     "Setelah selesai satu karakter, ketuk tombol biru Next ▶. Pada karakter terakhir, tombolnya bertuliskan Finish."
    ],
    "notes": [
     "Panduannya adalah garis luar karakter berwarna abu-abu samar. Dengan 👁 Show guide kamu bisa menjiplak di atasnya; dengan 🙈 Hide guide kamu menulis dari ingatan.",
     "Teks baru membawamu kembali ke layar sebelumnya, tempat kamu memilih kata, karakter, atau kalimat baru."
    ],
    "example": "Intensive Mode mengukur tulisanmu dengan lebih akurat dan menganalisis karakter, kata, dan kalimat yang sulit bagimu.",
    "action": "Coba Intensive Mode"
   },
   "res_links": {
    "title": "Sumber belajar",
    "what": "Situs web, video, dan aplikasi pilihan yang sesuai dengan level dan kemampuanmu.",
    "steps": [
     "Lihat kartu di bawah (setiap kartu berupa video atau situs web). Kartu-kartu ini dipilih sesuai levelmu.",
     "Ketuk tombol Open pada kartu yang kamu suka.",
     "Gunakan GAKU Reader di halaman itu untuk mencari kata yang belum kamu tahu."
    ],
    "example": "Contoh: buka situs bacaan yang direkomendasikan dan baca satu halaman pendek."
   },
   "res_content": {
    "title": "Create From Content",
    "what": "Tempel teks Jepang apa saja yang sedang kamu baca atau tonton, dan GAKU mengubahnya menjadi soal latihan.",
    "steps": [
     "Tempel teks Jepang (artikel, subtitle, pesan).",
     "Ketuk Analyze untuk membuat soal.",
     "Jawab soalnya, dan aktifkan furigana / romaji / terjemahan jika butuh bantuan."
    ],
    "example": "Contoh: tempel pengumuman apartemen → dapatkan soal arti, kanji, dan tata bahasa darinya."
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "Putar video asli di dekat mikrofonmu. GAKU mendengarkan, menampilkan kalimat aslinya, dan membantumu membalas.",
    "steps": [
     "Ketuk tombol dengar dan putar video bahasa Jepang dengan suara.",
     "Setiap baris yang kamu dengar menjadi satu kartu. Jika GAKU tidak bisa menangkap suatu baris, GAKU akan memintamu mendengarkan lagi — silakan putar ulang video atau audio yang tadi kamu dengarkan.",
     "Ketuk \"How would you respond?\" untuk melatih balasan yang alami."
    ],
    "example": "Contoh: putar percakapan YouTube → pilih balasan terbaik dari 4 pilihan.",
    "intensive": "Saat kamu mengucapkan balasanmu, GAKU memeriksa bahasa Jepangmu. Intensive Mode mencatat apakah setiap jawaban lisan benar dan jenis kesalahan yang kamu buat (partikel, bentuk kata kerja, pilihan kata, urutan kata, atau ejaan), serta kata-kata yang berulang kali salah. Lalu fitur ini menyarankan apa yang perlu difokuskan hari ini."
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "Bacalah bahasa Jepang dengan suara keras (atau dengarkan dan ulangi) dan lihat seberapa dekat ucapanmu.",
    "steps": [
     "Tempel teks Jepang untuk mendapatkan frasa.",
     "Dengarkan, lalu rekam dirimu mengucapkannya.",
     "Periksa hasilmu dan coba lagi."
    ],
    "example": "Contoh: tempel satu baris lagu pendek → ucapkan → lihat skormu.",
    "intensive": "Intensive Mode mencatat hasil setiap percobaan pelafalan (dan skormu), sehingga bisa menemukan frasa yang terus-menerus salah dan menyarankannya untuk latihan tambahan."
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "Latih menulis bahasa Jepang dengan menyalin teks atau menjawab pertanyaan.",
    "steps": [
     "Pilih mode (Copying down atau Questions).",
     "Pilih teks, atau pilih kata dari Library-mu.",
     "Ketik jawabanmu dan periksa."
    ],
    "example": "Contoh: salin 3 kalimat dari adegan manga, lalu periksa ketikanmu.",
    "intensive": "Intensive Mode mengukur ketepatan tulisanmu dengan lebih cermat. Di Copying down, fitur ini mencatat setiap karakter dan goresan. Di mode Questions, GAKU memeriksa jawabanmu dan mencatat jenis kesalahan (partikel, bentuk kata kerja, pilihan kata, urutan kata, atau ejaan) dan kata-kata yang salah. Lalu fitur ini menunjukkan kesalahan yang paling sering kamu buat dan apa yang perlu dilatih hari ini."
   }
  }
 },
 "Vietnamese": {
  "labels": {
   "how": "Cách dùng",
   "what": "Đây là gì?",
   "steps": "3 bước",
   "close": "Đóng",
   "never": "Không hiện lại",
   "tryIntensive": "Thử Intensive Mode"
  },
  "firstSteps": {
   "title": "Những bước đầu tiên của bạn",
   "sub": "Mất khoảng 3 phút",
   "profile": "Thiết lập hồ sơ của bạn",
   "content": "Thử Create From Content (1 phút)",
   "word": "Lưu từ đầu tiên của bạn",
   "go": "Đi thôi →",
   "allDone": "🎉 Khởi đầu tốt lắm! Bạn đã hoàn thành các bước đầu tiên.",
   "ok": "OK",
   "hide": "Ẩn",
   "progress": "Đã xong {n} / {m}"
  },
  "hints": {
   "vocab_search": "Gõ một từ rồi tìm kiếm, sau đó lưu từ đó vào Library của bạn.",
   "content_sample": "Chúng tôi đã thêm sẵn một đoạn văn mẫu cho bạn. Chỉ cần bấm nút bên dưới, hoặc dán văn bản của riêng bạn.",
   "content_analyze": "Bấm vào đây, các hoạt động đầu tiên của bạn sẽ sẵn sàng trong khoảng một phút."
  },
  "sections": {
   "schedule": {
    "title": "Lịch học",
    "what": "Kế hoạch học hằng tuần dành riêng cho bạn. Kế hoạch chỉ được tạo một lần và sẽ không thay đổi, trừ khi bạn bấm \"Update my study guide\" trong Edit Profile.",
    "steps": [
     "Mở các nhiệm vụ của hôm nay và làm theo thứ tự.",
     "Bấm vào liên kết của nhiệm vụ hoặc nút \"Go to…\" để mở đúng công cụ.",
     "Đánh dấu vào ô khi làm xong — chuỗi ngày học và tiến độ của bạn sẽ tăng lên."
    ],
    "example": "Ví dụ: \"Đọc một cảnh manga\" → bấm vào liên kết → quay lại → đánh dấu vào ô.",
    "intensive": "Ở đầu màn hình này, Intensive Mode hiển thị mục tiêu hằng ngày (8 hoạt động mỗi ngày) và nhắc bạn nếu bạn bị chậm. Nó cũng xem lại 14 ngày học gần nhất của bạn và gợi ý những phần bạn hay mắc lỗi nhất, để bạn biết hôm nay nên luyện gì."
   },
   "vocabulary": {
    "title": "Từ vựng",
    "what": "Tra bất kỳ từ nào và lưu vào các thư mục riêng của bạn (Library) để ôn lại sau.",
    "steps": [
     "Gõ một từ tiếng Anh hoặc tiếng Nhật rồi tìm kiếm.",
     "Bấm Save và chọn một thư mục.",
     "Mở Library để ôn bằng flashcards hoặc nghe phát âm."
    ],
    "example": "Ví dụ: tìm \"階段\" → Save → ôn lại trong thư mục \"Daily life\" của bạn."
   },
   "subtitles": {
    "title": "Phụ đề",
    "what": "Lưu từ và câu từ các video bạn xem để học sau.",
    "steps": [
     "Dán một câu phụ đề hoặc một từ từ video.",
     "Lưu vào danh sách của bạn.",
     "Quay lại để ôn những câu bạn đã lưu."
    ],
    "example": "Ví dụ: dán một câu từ một tập anime → lưu → ôn lại vào ngày mai."
   },
   "milestones": {
    "title": "Cột mốc",
    "what": "Lộ trình mục tiêu và phần kiểm tra tiến độ của bạn, để bạn thấy mình đã đi được bao xa.",
    "steps": [
     "Đọc các bước trong lộ trình cho mục tiêu của bạn.",
     "Dùng phần kiểm tra tiến độ để biết bạn đang ở đâu.",
     "Giữ chuỗi ngày học để tiến lên."
    ],
    "example": "Ví dụ: hoàn thành các nhiệm vụ của tuần này để đạt cột mốc tiếp theo."
   },
   "jlpt": {
    "title": "Kết quả JLPT",
    "what": "Kết quả chẩn đoán JLPT do giáo viên gửi cho bạn sẽ hiện ở đây.",
    "steps": [
     "Chờ giáo viên gửi kết quả cho bạn.",
     "Mở tab này để xem.",
     "Bấm Download PDF để lưu."
    ],
    "example": "Ví dụ: sau bài thi thử, báo cáo kết quả của bạn sẽ hiện ở đây."
   },
   "feedback": {
    "title": "Góp ý",
    "what": "Hãy cho chúng tôi biết cần cải thiện điều gì trong GAKU Master.",
    "steps": [
     "Viết ý tưởng hoặc vấn đề của bạn.",
     "Bấm Send.",
     "Xin hãy lịch sự — chúng tôi không nhận các tin nhắn xúc phạm."
    ],
    "example": "Ví dụ: \"Xin hãy thêm nhiều câu hỏi ngữ pháp N4 hơn.\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "Tìm bất kỳ từ nào và mở word card của nó — nghĩa, cách đọc và câu ví dụ.",
    "steps": [
     "Gõ một từ tiếng Anh hoặc tiếng Nhật (hoặc một chủ đề) rồi bấm Search.",
     "Bấm vào một kết quả để mở thẻ.",
     "Lưu vào một thư mục để ôn lại sau."
    ],
    "example": "Ví dụ: tìm \"階段\" → mở thẻ → Save vào thư mục \"Daily life\" của bạn."
   },
   "vocab_library": {
    "title": "Library",
    "what": "Tất cả các từ bạn đã lưu, được xếp vào các thư mục.",
    "steps": [
     "Bấm vào một thư mục để xem các word card bên trong.",
     "Bấm 🔊 ▶ trên một thư mục để nghe lần lượt tất cả các từ của nó.",
     "Bấm \"Quick review with Flashcards\" để luyện các từ của bạn."
    ],
    "example": "Mẹo: tạo thư mục riêng của bạn bằng \"New folder\" (ví dụ, mỗi bài học một thư mục)."
   },
   "vocab_folder": {
    "title": "Word cards trong thư mục này",
    "what": "Mỗi ô bên dưới là một word card — một từ bạn đã lưu.",
    "steps": [
     "Bấm vào một word card để mở: nghĩa, cách đọc và câu ví dụ.",
     "Bấm 🔊 để nghe từ. Bấm 🔊 ▶ All (góc trên bên phải) để nghe tất cả các từ trong thư mục này.",
     "Bấm Go Flashcard để luyện riêng từ đó. Bấm biểu tượng thùng rác để xóa thẻ."
    ],
    "example": "Mẹo: \"📋 Copy to folder\" sao chép các từ sang một thư mục khác (ví dụ, thư mục của bài học tiếp theo)."
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "Luyện các từ đã lưu như thẻ giấy. Bấm vào thẻ để lật và kiểm tra đáp án.",
    "steps": [
     "Nhìn từ và thử nhớ nghĩa. Bấm Hint nếu bạn cần cách đọc, rồi bấm vào thẻ để xem đáp án.",
     "Nếu bạn biết từ đó, bấm ✅ Understand. Từ đó sẽ chuyển sang thư mục \"Understood\", nên bạn chỉ cần ôn những từ chưa biết. Từ đó vẫn được lưu trong Library của bạn — không mất gì cả.",
     "Nếu bạn không biết, đừng bấm gì cả. Chỉ cần bấm → để sang thẻ tiếp theo; từ đó vẫn ở trong bộ thẻ của bạn."
    ],
    "example": "Intensive Mode ghi lại bạn lật mỗi thẻ nhanh thế nào và bạn bấm Understand bao nhiêu lần, rồi dùng thông tin đó để cho thấy từ nào bạn thật sự biết và từ nào chưa.",
    "action": "Thử Intensive Mode"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "Chép tiếng Nhật từng chữ một, vẽ từng nét bằng ngón tay hoặc chuột. GAKU kiểm tra thứ tự nét và hình dạng chữ của bạn.",
    "steps": [
     "Dán một câu tiếng Nhật vào ô, hoặc bấm \"Choose words from your Library\" để dùng các từ bạn đã lưu.",
     "Bấm \"Start writing\".",
     "Viết từng chữ, từng nét một."
    ],
    "example": "Mẹo: mỗi lần luyện tối đa 30 chữ."
   },
   "res_writing_copy_write": {
    "title": "Viết từng chữ một",
    "what": "Bạn viết từng chữ một của văn bản bạn đã dán hoặc các từ bạn chọn từ Library.",
    "steps": [
     "Viết chữ từng nét một, đúng thứ tự. GAKU sẽ báo cho bạn khi một nét bị sai.",
     "Không biết viết thế nào? Bấm ▶ Watch stroke order. Muốn thử lại? Bấm ↺ Try again.",
     "Khi viết xong một chữ, bấm nút Next ▶ màu xanh. Ở chữ cuối cùng, nút sẽ ghi Finish."
    ],
    "notes": [
     "Phần hướng dẫn là nét viền chữ màu xám nhạt. Với 👁 Show guide, bạn có thể tô theo nét đó; với 🙈 Hide guide, bạn viết theo trí nhớ.",
     "Văn bản mới sẽ đưa bạn về màn hình trước, nơi bạn chọn từ, chữ hoặc câu mới."
    ],
    "example": "Intensive Mode đo việc viết của bạn chính xác hơn và phân tích những chữ, từ và câu mà bạn thấy khó.",
    "action": "Thử Intensive Mode"
   },
   "res_links": {
    "title": "Tài nguyên",
    "what": "Các trang web, video và ứng dụng được chọn lọc cho trình độ và kỹ năng của bạn.",
    "steps": [
     "Xem các thẻ bên dưới (mỗi thẻ là một video hoặc một trang web). Chúng được chọn phù hợp với trình độ của bạn.",
     "Bấm nút Open trên thẻ bạn thích.",
     "Dùng GAKU Reader trên trang đó để tra những từ bạn chưa biết."
    ],
    "example": "Ví dụ: mở một trang đọc được gợi ý và đọc một trang ngắn."
   },
   "res_content": {
    "title": "Create From Content",
    "what": "Dán bất kỳ tiếng Nhật nào bạn đang đọc hoặc xem, và GAKU sẽ biến nó thành câu hỏi luyện tập.",
    "steps": [
     "Dán văn bản tiếng Nhật (một bài báo, phụ đề, một tin nhắn).",
     "Bấm Analyze để tạo câu hỏi.",
     "Trả lời các câu hỏi, và bật furigana / romaji / bản dịch nếu bạn cần trợ giúp."
    ],
    "example": "Ví dụ: dán một thông báo của căn hộ → nhận các câu hỏi về nghĩa, kanji và ngữ pháp từ đó."
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "Phát một video thật gần micro của bạn. GAKU lắng nghe, hiển thị các câu thật và giúp bạn đáp lại.",
    "steps": [
     "Bấm nút nghe và phát một video tiếng Nhật có âm thanh.",
     "Mỗi câu bạn nghe được sẽ thành một thẻ. Nếu GAKU không nghe được một câu, nó sẽ nhờ bạn nghe lại — hãy phát lại video hoặc âm thanh bạn đang nghe.",
     "Bấm \"How would you respond?\" để luyện cách đáp lại tự nhiên."
    ],
    "example": "Ví dụ: phát một đoạn hội thoại trên YouTube → chọn câu đáp lại tốt nhất trong 4 lựa chọn.",
    "intensive": "Khi bạn nói câu đáp lại, GAKU kiểm tra tiếng Nhật của bạn. Intensive Mode ghi lại mỗi câu trả lời nói có đúng không và bạn mắc loại lỗi nào (trợ từ, dạng động từ, chọn từ, thứ tự từ hoặc chính tả), cùng các từ sai lặp lại. Sau đó nó gợi ý bạn nên tập trung vào điều gì hôm nay."
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "Đọc to tiếng Nhật (hoặc nghe rồi nhắc lại) và xem bạn nói gần đúng đến mức nào.",
    "steps": [
     "Dán văn bản tiếng Nhật để lấy các cụm từ.",
     "Nghe, rồi ghi âm giọng bạn nói.",
     "Xem kết quả của bạn và thử lại."
    ],
    "example": "Ví dụ: dán một câu hát ngắn → nói theo → xem điểm của bạn.",
    "intensive": "Intensive Mode ghi lại kết quả của mỗi lần bạn thử phát âm (và điểm của bạn), để tìm ra những cụm từ bạn cứ nói sai và gợi ý luyện thêm."
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "Luyện viết tiếng Nhật bằng cách chép văn bản hoặc trả lời câu hỏi.",
    "steps": [
     "Chọn một chế độ (Copying down hoặc Questions).",
     "Chọn văn bản, hoặc chọn từ trong Library của bạn.",
     "Gõ câu trả lời của bạn và kiểm tra."
    ],
    "example": "Ví dụ: chép 3 câu từ một cảnh manga, rồi kiểm tra phần bạn đã gõ.",
    "intensive": "Intensive Mode đo độ chính xác khi viết của bạn kỹ hơn. Trong Copying down, nó ghi lại từng chữ và từng nét. Trong chế độ Questions, GAKU kiểm tra câu trả lời của bạn và ghi lại loại lỗi (trợ từ, dạng động từ, chọn từ, thứ tự từ hoặc chính tả) cùng các từ sai. Sau đó nó chỉ ra những lỗi bạn mắc nhiều nhất và hôm nay nên luyện gì."
   }
  }
 },
 "Hindi": {
  "labels": {
   "how": "इस्तेमाल कैसे करें",
   "what": "यह क्या है?",
   "steps": "3 स्टेप",
   "close": "बंद करें",
   "never": "दोबारा न दिखाएँ",
   "tryIntensive": "Intensive Mode आज़माएँ"
  },
  "firstSteps": {
   "title": "आपके पहले कदम",
   "sub": "लगभग 3 मिनट लगते हैं",
   "profile": "अपनी प्रोफ़ाइल बनाएँ",
   "content": "Create From Content आज़माएँ (1 मिनट)",
   "word": "अपना पहला शब्द सेव करें",
   "go": "चलें →",
   "allDone": "🎉 बढ़िया शुरुआत! आपने अपने पहले कदम पूरे कर लिए।",
   "ok": "OK",
   "hide": "छिपाएँ",
   "progress": "{n} / {m} पूरे"
  },
  "hints": {
   "vocab_search": "एक शब्द लिखें और खोजें — फिर उसे अपनी Library में सेव करें।",
   "content_sample": "हमने आपके लिए एक सैंपल टेक्स्ट जोड़ दिया है। बस नीचे दिया बटन दबाएँ — या अपना टेक्स्ट पेस्ट करें।",
   "content_analyze": "यहाँ दबाएँ — आपकी पहली गतिविधियाँ लगभग एक मिनट में तैयार हो जाएँगी।"
  },
  "sections": {
   "schedule": {
    "title": "शेड्यूल",
    "what": "आपकी अपनी साप्ताहिक पढ़ाई की योजना। यह आपके लिए एक बार बनती है और तब तक नहीं बदलती जब तक आप Edit Profile में \"Update my study guide\" न दबाएँ।",
    "steps": [
     "आज के कार्य खोलें और उन्हें क्रम से करें।",
     "सही टूल खोलने के लिए कार्य के लिंक या \"Go to…\" बटन को दबाएँ।",
     "काम पूरा होने पर बॉक्स पर टिक करें — आपकी स्ट्रीक और प्रगति बढ़ जाती है।"
    ],
    "example": "उदाहरण: \"Read a manga scene\" → लिंक दबाएँ → वापस आएँ → टिक करें।",
    "intensive": "इस स्क्रीन के ऊपर Intensive Mode रोज़ का एक लक्ष्य दिखाता है (दिन में 8 एक्शन) और अगर आप पीछे हैं तो आपको बताता है। यह आपकी पिछले 14 दिनों की पढ़ाई भी देखता है और वे क्षेत्र सुझाता है जहाँ आप सबसे ज़्यादा गलतियाँ करते हैं, ताकि आपको पता रहे कि आज क्या अभ्यास करना है।"
   },
   "vocabulary": {
    "title": "शब्दावली",
    "what": "कोई भी शब्द खोजें और बाद में दोहराने के लिए उसे अपने फ़ोल्डरों (Library) में सेव करें।",
    "steps": [
     "अंग्रेज़ी या जापानी में एक शब्द लिखें और खोजें।",
     "Save दबाएँ और एक फ़ोल्डर चुनें।",
     "फ़्लैशकार्ड से दोहराने या उच्चारण सुनने के लिए Library खोलें।"
    ],
    "example": "उदाहरण: \"階段\" खोजें → Save → अपने \"Daily life\" फ़ोल्डर में दोहराएँ।"
   },
   "subtitles": {
    "title": "सबटाइटल",
    "what": "आप जो वीडियो देखते हैं उनसे शब्द और वाक्य सेव करें, ताकि बाद में उन्हें पढ़ सकें।",
    "steps": [
     "वीडियो से कोई सबटाइटल लाइन या शब्द पेस्ट करें।",
     "उसे अपनी लिस्ट में सेव करें।",
     "सेव किए हुए वाक्य दोहराने के लिए वापस आएँ।"
    ],
    "example": "उदाहरण: किसी एनीमे एपिसोड से एक लाइन पेस्ट करें → सेव करें → कल उसे दोहराएँ।"
   },
   "milestones": {
    "title": "माइलस्टोन",
    "what": "आपके लक्ष्य का रोडमैप और प्रगति की जाँच, ताकि आप देख सकें कि आप कितना आगे आ गए हैं।",
    "steps": [
     "अपने लक्ष्य के रोडमैप के स्टेप पढ़ें।",
     "प्रगति की जाँच से देखें कि आप कहाँ हैं।",
     "आगे बढ़ने के लिए अपनी स्ट्रीक बनाए रखें।"
    ],
    "example": "उदाहरण: अगले माइलस्टोन तक पहुँचने के लिए इस हफ़्ते के कार्य पूरे करें।"
   },
   "jlpt": {
    "title": "JLPT परिणाम",
    "what": "आपके शिक्षक द्वारा भेजा गया आपका JLPT डायग्नोसिस परिणाम यहाँ दिखाई देता है।",
    "steps": [
     "अपने शिक्षक के परिणाम भेजने का इंतज़ार करें।",
     "उसे देखने के लिए यह टैब खोलें।",
     "सेव करने के लिए Download PDF दबाएँ।"
    ],
    "example": "उदाहरण: आपके मॉक टेस्ट के बाद, आपकी परिणाम रिपोर्ट यहाँ दिखाई देती है।"
   },
   "feedback": {
    "title": "फ़ीडबैक",
    "what": "हमें बताइए कि GAKU Master में क्या सुधारना चाहिए।",
    "steps": [
     "अपना विचार या समस्या लिखें।",
     "Send दबाएँ।",
     "कृपया शालीन रहें — अपमानजनक संदेश स्वीकार नहीं किए जाते।"
    ],
    "example": "उदाहरण: \"Please add more N4 grammar questions.\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "कोई भी शब्द खोजें और उसका वर्ड कार्ड खोलें — अर्थ, पढ़ने का तरीका और उदाहरण वाक्य।",
    "steps": [
     "अंग्रेज़ी या जापानी शब्द (या कोई विषय) लिखें और Search दबाएँ।",
     "उसका कार्ड खोलने के लिए किसी परिणाम को दबाएँ।",
     "बाद में दोहराने के लिए उसे किसी फ़ोल्डर में सेव करें।"
    ],
    "example": "उदाहरण: \"階段\" खोजें → कार्ड खोलें → अपने \"Daily life\" फ़ोल्डर में Save करें।"
   },
   "vocab_library": {
    "title": "Library",
    "what": "आपके सेव किए हुए सारे शब्द, फ़ोल्डरों में बँटे हुए।",
    "steps": [
     "अंदर के वर्ड कार्ड देखने के लिए किसी फ़ोल्डर को दबाएँ।",
     "किसी फ़ोल्डर के सारे शब्द एक-एक करके सुनने के लिए उस पर 🔊 ▶ दबाएँ।",
     "अपने शब्दों का अभ्यास करने के लिए \"Quick review with Flashcards\" दबाएँ।"
    ],
    "example": "टिप: \"New folder\" से अपने खुद के फ़ोल्डर बनाएँ (जैसे, हर पाठ के लिए एक फ़ोल्डर)।"
   },
   "vocab_folder": {
    "title": "इस फ़ोल्डर के वर्ड कार्ड",
    "what": "नीचे का हर बॉक्स एक वर्ड कार्ड है — यानी आपका सेव किया हुआ एक शब्द।",
    "steps": [
     "किसी वर्ड कार्ड को खोलने के लिए दबाएँ: अर्थ, पढ़ने का तरीका और उदाहरण वाक्य।",
     "शब्द सुनने के लिए 🔊 दबाएँ। इस फ़ोल्डर के हर शब्द को सुनने के लिए 🔊 ▶ All (ऊपर दाईं ओर) दबाएँ।",
     "सिर्फ़ उसी शब्द का अभ्यास करने के लिए Go Flashcard दबाएँ। कार्ड हटाने के लिए कूड़ेदान दबाएँ।"
    ],
    "example": "टिप: \"📋 Copy to folder\" शब्दों को दूसरे फ़ोल्डर में कॉपी करता है (जैसे, आपके अगले पाठ के फ़ोल्डर में)।"
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "अपने सेव किए शब्दों का अभ्यास कागज़ के फ़्लैशकार्ड की तरह करें। कार्ड को पलटने और जवाब देखने के लिए उसे दबाएँ।",
    "steps": [
     "शब्द देखें और उसका अर्थ याद करने की कोशिश करें। पढ़ने का तरीका चाहिए तो Hint दबाएँ, फिर जवाब देखने के लिए कार्ड दबाएँ।",
     "अगर आपको आता था, तो ✅ Understand दबाएँ। शब्द \"Understood\" फ़ोल्डर में चला जाता है, ताकि आप सिर्फ़ वे शब्द दोहरा सकें जो अभी नहीं आते। वह फिर भी आपकी Library में सेव रहता है — कुछ भी खोता नहीं।",
     "अगर नहीं आता था, तो कुछ न दबाएँ। अगले कार्ड के लिए बस → दबाएँ; वह शब्द आपके डेक में ही रहता है।"
    ],
    "example": "Intensive Mode रिकॉर्ड करता है कि आप हर कार्ड कितनी जल्दी पलटते हैं और कितनी बार Understand दबाते हैं, और इससे दिखाता है कि आपको कौन से शब्द सच में आते हैं और कौन से नहीं।",
    "action": "Intensive Mode आज़माएँ"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "जापानी एक-एक अक्षर करके कॉपी करें, हर स्ट्रोक अपनी उँगली या माउस से बनाएँ। GAKU आपका स्ट्रोक ऑर्डर और आकार जाँचता है।",
    "steps": [
     "बॉक्स में एक जापानी वाक्य पेस्ट करें, या अपने सेव किए शब्द इस्तेमाल करने के लिए \"Choose words from your Library\" दबाएँ।",
     "\"Start writing\" दबाएँ।",
     "हर अक्षर को एक-एक स्ट्रोक करके लिखें।"
    ],
    "example": "टिप: एक बार में 30 अक्षरों तक का अभ्यास होता है।"
   },
   "res_writing_copy_write": {
    "title": "एक बार में एक अक्षर लिखना",
    "what": "आपने जो टेक्स्ट पेस्ट किया या Library से जो शब्द चुने, उन्हें आप एक-एक अक्षर करके लिखते हैं।",
    "steps": [
     "अक्षर को सही क्रम में, एक-एक स्ट्रोक करके लिखें। कोई स्ट्रोक गलत होने पर GAKU आपको बताता है।",
     "पक्का नहीं पता कि कैसे लिखना है? ▶ Watch stroke order दबाएँ। फिर से कोशिश करनी है? ↺ Try again दबाएँ।",
     "एक अक्षर पूरा होने पर नीले Next ▶ बटन को दबाएँ। आख़िरी अक्षर पर इसमें Finish लिखा होता है।"
    ],
    "notes": [
     "गाइड अक्षर की हल्की स्लेटी रूपरेखा है। 👁 Show guide से आप उसके ऊपर लिख सकते हैं; 🙈 Hide guide से आप याद से लिखते हैं।",
     "नया टेक्स्ट आपको पिछली स्क्रीन पर ले जाता है, जहाँ आप नए शब्द, अक्षर या वाक्य चुनते हैं।"
    ],
    "example": "Intensive Mode आपकी लिखाई को ज़्यादा सटीक ढंग से मापता है और उन अक्षरों, शब्दों और वाक्यों का विश्लेषण करता है जो आपको मुश्किल लगते हैं।",
    "action": "Intensive Mode आज़माएँ"
   },
   "res_links": {
    "title": "संसाधन",
    "what": "आपके स्तर और कौशल के लिए चुनी हुई वेबसाइट, वीडियो और ऐप।",
    "steps": [
     "नीचे के कार्ड देखें (हर कार्ड एक वीडियो या वेबसाइट है)। ये आपके स्तर के अनुसार चुने गए हैं।",
     "जो कार्ड पसंद आए उस पर Open बटन दबाएँ।",
     "जो शब्द नहीं आते उन्हें देखने के लिए उस पेज पर GAKU Reader इस्तेमाल करें।"
    ],
    "example": "उदाहरण: कोई सुझाई गई रीडिंग वेबसाइट खोलें और एक छोटा पेज पढ़ें।"
   },
   "res_content": {
    "title": "Create From Content",
    "what": "आप जो भी जापानी पढ़ या देख रहे हैं उसे पेस्ट करें, और GAKU उसे अभ्यास के सवालों में बदल देता है।",
    "steps": [
     "जापानी टेक्स्ट पेस्ट करें (कोई लेख, सबटाइटल, कोई संदेश)।",
     "सवाल बनाने के लिए Analyze दबाएँ।",
     "उनके जवाब दें, और मदद चाहिए तो furigana / romaji / अनुवाद चालू करें।"
    ],
    "example": "उदाहरण: अपार्टमेंट की कोई सूचना पेस्ट करें → उससे अर्थ, कांजी और व्याकरण के सवाल पाएँ।"
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "अपने माइक के पास कोई असली वीडियो चलाएँ। GAKU सुनता है, असली वाक्य दिखाता है और जवाब देने में आपकी मदद करता है।",
    "steps": [
     "सुनने वाला बटन दबाएँ और आवाज़ के साथ कोई जापानी वीडियो चलाएँ।",
     "आप जो हर वाक्य सुनते हैं वह एक कार्ड बन जाता है। अगर GAKU कोई वाक्य नहीं पकड़ पाया, तो वह आपसे दोबारा सुनने को कहेगा — कृपया जो वीडियो या ऑडियो आप सुन रहे थे उसे फिर से चलाएँ।",
     "स्वाभाविक जवाब का अभ्यास करने के लिए \"How would you respond?\" दबाएँ।"
    ],
    "example": "उदाहरण: कोई YouTube बातचीत चलाएँ → 4 विकल्पों में से सबसे अच्छा जवाब चुनें।",
    "intensive": "जब आप अपना जवाब बोलते हैं, तो GAKU आपकी जापानी जाँचता है। Intensive Mode रिकॉर्ड करता है कि हर बोला गया जवाब सही था या नहीं और आपने किस तरह की गलती की (पार्टिकल, क्रिया के रूप, शब्द का चुनाव, शब्दों का क्रम या स्पेलिंग), और बार-बार गलत होने वाले शब्द भी। फिर वह सुझाता है कि आज किस पर ध्यान देना है।"
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "जापानी ज़ोर से पढ़ें (या सुनें और दोहराएँ) और देखें कि आपकी बोली कितनी सही थी।",
    "steps": [
     "वाक्यांश पाने के लिए जापानी टेक्स्ट पेस्ट करें।",
     "सुनें, फिर उसे बोलते हुए खुद को रिकॉर्ड करें।",
     "अपना परिणाम देखें और फिर से कोशिश करें।"
    ],
    "example": "उदाहरण: किसी गाने की एक छोटी लाइन पेस्ट करें → उसे बोलें → अपना स्कोर देखें।",
    "intensive": "Intensive Mode हर उच्चारण की कोशिश का परिणाम (और आपका स्कोर) रिकॉर्ड करता है, ताकि वह उन वाक्यांशों को ढूँढ सके जिन्हें आप बार-बार गलत बोलते हैं और उन्हें अतिरिक्त अभ्यास के लिए सुझा सके।"
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "टेक्स्ट कॉपी करके या सवालों के जवाब देकर जापानी लिखने का अभ्यास करें।",
    "steps": [
     "एक मोड चुनें (Copying down या Questions)।",
     "कोई टेक्स्ट चुनें, या अपनी Library से शब्द चुनें।",
     "अपना जवाब टाइप करें और उसे जाँचें।"
    ],
    "example": "उदाहरण: किसी मंगा सीन से 3 वाक्य कॉपी करें, फिर अपनी टाइपिंग जाँचें।",
    "intensive": "Intensive Mode आपकी लिखाई की सटीकता को ज़्यादा ध्यान से मापता है। Copying down में वह हर अक्षर और हर स्ट्रोक रिकॉर्ड करता है। Questions मोड में GAKU आपका जवाब जाँचता है और गलती का प्रकार (पार्टिकल, क्रिया के रूप, शब्द का चुनाव, शब्दों का क्रम या स्पेलिंग) और गलत शब्द रिकॉर्ड करता है। फिर वह बताता है कि आप सबसे ज़्यादा कौन सी गलतियाँ करते हैं और आज क्या अभ्यास करना है।"
   }
  }
 },
 "Turkish": {
  "labels": {
   "how": "Nasıl kullanılır",
   "what": "Bu nedir?",
   "steps": "3 adım",
   "close": "Kapat",
   "never": "Bir daha gösterme",
   "tryIntensive": "Intensive Mode'u dene"
  },
  "firstSteps": {
   "title": "İlk adımların",
   "sub": "Yaklaşık 3 dakika sürer",
   "profile": "Profilini oluştur",
   "content": "Create From Content'i dene (1 dk)",
   "word": "İlk kelimeni kaydet",
   "go": "Git →",
   "allDone": "🎉 Güzel başlangıç! İlk adımları tamamladın.",
   "ok": "OK",
   "hide": "Gizle",
   "progress": "{n} / {m} tamamlandı"
  },
  "hints": {
   "vocab_search": "Bir kelime yaz ve ara — sonra onu Library'ne kaydet.",
   "content_sample": "Senin için örnek bir metin ekledik. Aşağıdaki düğmeye dokun — ya da kendi metnini yapıştır.",
   "content_analyze": "Buraya dokun — ilk etkinliklerin yaklaşık bir dakika içinde hazır olacak."
  },
  "sections": {
   "schedule": {
    "title": "Program",
    "what": "Sana özel haftalık çalışma planın. Senin için bir kez hazırlanır ve Edit Profile içindeki \"Update my study guide\" düğmesine basmadıkça hiç değişmez.",
    "steps": [
     "Bugünün görevlerini aç ve sırayla yap.",
     "Doğru aracı açmak için görevin bağlantısına ya da \"Go to…\" düğmesine dokun.",
     "İşin bitince kutuyu işaretle — serin ve ilerlemen artar."
    ],
    "example": "Örnek: \"Read a manga scene\" → bağlantıya dokun → geri dön → işaretle.",
    "intensive": "Bu ekranın en üstünde Intensive Mode günlük bir hedef gösterir (günde 8 eylem) ve geride kalırsan seni uyarır. Ayrıca son 14 günlük çalışmana bakar ve en çok hata yaptığın alanları önerir; böylece bugün neyi çalışacağını bilirsin."
   },
   "vocabulary": {
    "title": "Kelime Bilgisi",
    "what": "Herhangi bir kelimeyi ara ve daha sonra tekrar etmek için kendi klasörlerine (Library) kaydet.",
    "steps": [
     "İngilizce ya da Japonca bir kelime yaz ve ara.",
     "Save'e dokun ve bir klasör seç.",
     "Flashcards ile tekrar etmek veya telaffuzu dinlemek için Library'yi aç."
    ],
    "example": "Örnek: \"階段\" ara → Save → \"Daily life\" klasöründe tekrar et."
   },
   "subtitles": {
    "title": "Altyazılar",
    "what": "İzlediğin videolardaki kelimeleri ve cümleleri kaydet, böylece daha sonra çalışabilirsin.",
    "steps": [
     "Videodan bir altyazı satırı ya da kelime yapıştır.",
     "Listene kaydet.",
     "Kaydettiğin cümleleri tekrar etmek için geri gel."
    ],
    "example": "Örnek: bir anime bölümünden bir cümle yapıştır → kaydet → yarın tekrar et."
   },
   "milestones": {
    "title": "Kilometre Taşları",
    "what": "Hedef yol haritan ve ilerleme kontrolün; ne kadar yol aldığını görebilirsin.",
    "steps": [
     "Hedefin için yol haritası adımlarını oku.",
     "Nerede olduğunu görmek için ilerleme kontrolünü kullan.",
     "İlerlemek için serini sürdür."
    ],
    "example": "Örnek: bir sonraki kilometre taşına ulaşmak için bu haftanın görevlerini bitir."
   },
   "jlpt": {
    "title": "JLPT sonuçları",
    "what": "Öğretmeninin gönderdiği JLPT tanı sonucun burada görünür.",
    "steps": [
     "Öğretmeninin sonucunu göndermesini bekle.",
     "Görmek için bu sekmeyi aç.",
     "Kaydetmek için Download PDF'e dokun."
    ],
    "example": "Örnek: deneme sınavından sonra sonuç raporun burada görünür."
   },
   "feedback": {
    "title": "Geri Bildirim",
    "what": "GAKU Master'da neyi geliştirmemiz gerektiğini bize söyle.",
    "steps": [
     "Fikrini ya da sorununu yaz.",
     "Send'e dokun.",
     "Lütfen nazik ol — hakaret içeren mesajlar kabul edilmez."
    ],
    "example": "Örnek: \"Please add more N4 grammar questions.\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "Herhangi bir kelimeyi ara ve kelime kartını aç — anlamı, okunuşu ve örnek cümleler.",
    "steps": [
     "İngilizce ya da Japonca bir kelime (veya bir konu) yaz ve Search'e dokun.",
     "Kartını açmak için bir sonuca dokun.",
     "Daha sonra tekrar etmek için bir klasöre kaydet."
    ],
    "example": "Örnek: \"階段\" ara → kartı aç → \"Daily life\" klasörüne Save et."
   },
   "vocab_library": {
    "title": "Library",
    "what": "Kaydettiğin tüm kelimeler, klasörlere ayrılmış hâlde.",
    "steps": [
     "İçindeki word card'ları görmek için bir klasöre dokun.",
     "Bir klasördeki tüm kelimeleri art arda dinlemek için klasörün üzerindeki 🔊 ▶ simgesine dokun.",
     "Kelimelerini çalışmak için \"Quick review with Flashcards\"a dokun."
    ],
    "example": "İpucu: \"New folder\" ile kendi klasörlerini oluştur (örneğin her ders için bir klasör)."
   },
   "vocab_folder": {
    "title": "Bu klasördeki word card'lar",
    "what": "Aşağıdaki her kutu bir word card'dır — kaydettiğin bir kelime.",
    "steps": [
     "Açmak için bir word card'a dokun: anlamı, okunuşu ve örnek cümleler.",
     "Kelimeyi dinlemek için 🔊'ya dokun. Bu klasördeki tüm kelimeleri dinlemek için 🔊 ▶ All'a (sağ üst) dokun.",
     "Sadece o kelimeyi çalışmak için Go Flashcard'a dokun. Kartı silmek için çöp kutusuna dokun."
    ],
    "example": "İpucu: \"📋 Copy to folder\" kelimeleri başka bir klasöre kopyalar (örneğin bir sonraki dersinin klasörüne)."
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "Kaydettiğin kelimeleri kâğıt kartlar gibi çalış. Kartı çevirmek ve cevabı kontrol etmek için karta dokun.",
    "steps": [
     "Kelimeye bak ve anlamını hatırlamaya çalış. Okunuşa ihtiyacın olursa Hint'e dokun, sonra cevabı görmek için karta dokun.",
     "Bildiysen ✅ Understand'e dokun. Kelime \"Understood\" klasörüne gider; böylece sadece henüz bilmediğin kelimeleri tekrar edebilirsin. Kelime yine Library'nde kayıtlı kalır — hiçbir şey kaybolmaz.",
     "Bilemediysen hiçbir şeye basma. Sadece sonraki kart için → simgesine dokun; kelime destende kalır."
    ],
    "example": "Intensive Mode her kartı ne kadar hızlı çevirdiğini ve Understand'e kaç kez bastığını kaydeder ve hangi kelimeleri gerçekten bildiğini, hangilerini bilmediğini göstermek için bunu kullanır.",
    "action": "Intensive Mode'u dene"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "Japonca'yı her seferinde bir karakter olarak kopyala; her çizgiyi parmağınla ya da fareyle çiz. GAKU çizgi sırasını ve şekli kontrol eder.",
    "steps": [
     "Kutuya bir Japonca cümle yapıştır ya da kaydettiğin kelimeleri kullanmak için \"Choose words from your Library\"ye dokun.",
     "\"Start writing\"a dokun.",
     "Her karakteri, her seferinde bir çizgi olacak şekilde yaz."
    ],
    "example": "İpucu: her seferinde en fazla 30 karakter çalışılır."
   },
   "res_writing_copy_write": {
    "title": "Her seferinde bir karakter yazmak",
    "what": "Yapıştırdığın metni ya da Library'nden seçtiğin kelimeleri, her seferinde bir karakter olarak yazarsın.",
    "steps": [
     "Karakteri doğru sırayla, her seferinde bir çizgi olacak şekilde yaz. Bir çizgi yanlışsa GAKU sana söyler.",
     "Nasıl yazılacağından emin değil misin? ▶ Watch stroke order'a dokun. Tekrar denemek ister misin? ↺ Try again'e dokun.",
     "Bir karakteri bitirince mavi Next ▶ düğmesine dokun. Son karakterde düğmede Finish yazar."
    ],
    "notes": [
     "Kılavuz, karakterin soluk gri taslağıdır. 👁 Show guide ile üzerinden geçebilirsin; 🙈 Hide guide ile ezberden yazarsın.",
     "Yeni metin seni önceki ekrana götürür; orada yeni kelimeler, karakterler ya da bir cümle seçersin."
    ],
    "example": "Intensive Mode yazışını daha doğru ölçer ve zorlandığın karakterleri, kelimeleri ve cümleleri analiz eder.",
    "action": "Intensive Mode'u dene"
   },
   "res_links": {
    "title": "Kaynaklar",
    "what": "Seviyene ve becerilerine göre elle seçilmiş web siteleri, videolar ve uygulamalar.",
    "steps": [
     "Aşağıdaki kartlara bak (her kart bir video ya da web sitesidir). Seviyene uygun seçilmişlerdir.",
     "Beğendiğin bir kartta Open düğmesine dokun.",
     "Bilmediğin kelimelere bakmak için o sayfada GAKU Reader'ı kullan."
    ],
    "example": "Örnek: önerilen bir okuma sitesini aç ve kısa bir sayfa oku."
   },
   "res_content": {
    "title": "Create From Content",
    "what": "Okuduğun ya da izlediğin herhangi bir Japonca metni yapıştır, GAKU onu alıştırma sorularına çevirsin.",
    "steps": [
     "Japonca metin yapıştır (bir makale, altyazılar, bir mesaj).",
     "Soruları oluşturmak için Analyze'a dokun.",
     "Soruları cevapla; yardıma ihtiyacın olursa furigana / romaji / çeviriyi aç."
    ],
    "example": "Örnek: bir apartman duyurusunu yapıştır → ondan anlam, kanji ve dilbilgisi soruları al."
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "Mikrofonunun yanında gerçek bir video oynat. GAKU dinler, gerçek cümleleri gösterir ve cevap vermene yardım eder.",
    "steps": [
     "Dinleme düğmesine dokun ve sesli bir Japonca video oynat.",
     "Duyduğun her cümle bir kart olur. GAKU bir cümleyi anlayamazsa seni tekrar dinlemeye çağırır — lütfen dinlediğin videoyu ya da sesi yeniden oynat.",
     "Doğal bir cevap çalışmak için \"How would you respond?\"a dokun."
    ],
    "example": "Örnek: bir YouTube konuşması oynat → 4 seçenek arasından en iyi cevabı seç.",
    "intensive": "Cevabını sesli söylediğinde GAKU Japoncanı kontrol eder. Intensive Mode her sesli cevabın doğru olup olmadığını, ne tür bir hata yaptığını (edatlar, fiil biçimleri, kelime seçimi, kelime sırası ya da yazım) ve tekrarlanan yanlış kelimeleri kaydeder. Sonra bugün nelere odaklanman gerektiğini önerir."
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "Japonca'yı yüksek sesle oku (ya da dinle ve tekrar et) ve konuşmanın ne kadar yakın olduğunu gör.",
    "steps": [
     "İfadeleri almak için Japonca metin yapıştır.",
     "Dinle, sonra söylerken kendini kaydet.",
     "Sonucuna bak ve tekrar dene."
    ],
    "example": "Örnek: kısa bir şarkı satırı yapıştır → söyle → puanını gör.",
    "intensive": "Intensive Mode her telaffuz denemesinin sonucunu (ve puanını) kaydeder; böylece sürekli yanlış yaptığın ifadeleri bulabilir ve ekstra çalışma için önerebilir."
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "Metin kopyalayarak ya da soruları cevaplayarak Japonca yazmayı çalış.",
    "steps": [
     "Bir mod seç (Copying down ya da Questions).",
     "Bir metin seç ya da Library'nden kelimeler seç.",
     "Cevabını yaz ve kontrol et."
    ],
    "example": "Örnek: bir manga sahnesinden 3 cümle kopyala, sonra yazdıklarını kontrol et.",
    "intensive": "Intensive Mode yazma doğruluğunu daha dikkatli ölçer. Copying down'da her karakteri ve her çizgiyi kaydeder. Questions modunda GAKU cevabını kontrol eder ve hatanın türünü (edatlar, fiil biçimleri, kelime seçimi, kelime sırası ya da yazım) ve yanlış kelimeleri kaydeder. Sonra en çok hangi hataları yaptığını ve bugün neyi çalışman gerektiğini gösterir."
   }
  }
 },
 "Nepali": {
  "labels": {
   "how": "कसरी प्रयोग गर्ने",
   "what": "यो के हो?",
   "steps": "३ चरण",
   "close": "बन्द गर्नुहोस्",
   "never": "फेरि नदेखाउनुहोस्",
   "tryIntensive": "Intensive Mode प्रयास गर्नुहोस्"
  },
  "firstSteps": {
   "title": "तपाईंका पहिला कदम",
   "sub": "लगभग ३ मिनेट लाग्छ",
   "profile": "आफ्नो प्रोफाइल सेट गर्नुहोस्",
   "content": "Create From Content प्रयास गर्नुहोस् (१ मिनेट)",
   "word": "आफ्नो पहिलो शब्द सेभ गर्नुहोस्",
   "go": "जानुहोस् →",
   "allDone": "🎉 राम्रो सुरुवात! तपाईंले पहिला कदमहरू पूरा गर्नुभयो।",
   "ok": "OK",
   "hide": "लुकाउनुहोस्",
   "progress": "{n} / {m} सकियो"
  },
  "hints": {
   "vocab_search": "एउटा शब्द टाइप गरेर खोज्नुहोस् — त्यसपछि आफ्नो Library मा सेभ गर्नुहोस्।",
   "content_sample": "हामीले तपाईंका लागि नमुना पाठ राखेका छौं। तलको बटन थिच्नुहोस् — वा आफ्नै पाठ पेस्ट गर्नुहोस्।",
   "content_analyze": "यहाँ थिच्नुहोस् — तपाईंका पहिला अभ्यासहरू लगभग एक मिनेटमा तयार हुनेछन्।"
  },
  "sections": {
   "schedule": {
    "title": "तालिका",
    "what": "तपाईंको आफ्नै साप्ताहिक अध्ययन योजना। यो तपाईंका लागि एक पटक मात्र बनाइन्छ र Edit Profile मा \"Update my study guide\" थिच्नुभएन भने कहिल्यै फेरिँदैन।",
    "steps": [
     "आजका कामहरू खोल्नुहोस् र क्रमैसँग गर्नुहोस्।",
     "सही टुल खोल्न कामको लिंक वा \"Go to…\" बटन थिच्नुहोस्।",
     "काम सकिएपछि बाकसमा टिक लगाउनुहोस् — तपाईंको स्ट्रिक र प्रगति बढ्छ।"
    ],
    "example": "उदाहरण: \"मंगाको एउटा दृश्य पढ्नुहोस्\" → लिंक थिच्नुहोस् → फर्कनुहोस् → टिक लगाउनुहोस्।",
    "intensive": "यो स्क्रिनको माथि, Intensive Mode ले दैनिक लक्ष्य (दिनमा ८ अभ्यास) देखाउँछ र तपाईं पछि पर्नुभयो भने चेतावनी दिन्छ। यसले तपाईंको पछिल्ला १४ दिनको अध्ययन पनि हेर्छ र तपाईंले सबैभन्दा धेरै गल्ती गर्ने क्षेत्रहरू सुझाव दिन्छ, ताकि आज के अभ्यास गर्ने भनेर तपाईंलाई थाहा होस्।"
   },
   "vocabulary": {
    "title": "शब्दावली",
    "what": "कुनै पनि शब्द खोज्नुहोस् र पछि दोहोर्याउन आफ्नै फोल्डरहरू (Library) मा सेभ गर्नुहोस्।",
    "steps": [
     "अंग्रेजी वा जापानी शब्द टाइप गरेर खोज्नुहोस्।",
     "Save थिच्नुहोस् र फोल्डर छान्नुहोस्।",
     "flashcards ले दोहोर्याउन वा उच्चारण सुन्न Library खोल्नुहोस्।"
    ],
    "example": "उदाहरण: \"階段\" खोज्नुहोस् → Save → आफ्नो \"Daily life\" फोल्डरमा दोहोर्याउनुहोस्।"
   },
   "subtitles": {
    "title": "सबटाइटल",
    "what": "तपाईंले हेर्ने भिडियोबाट शब्द र वाक्यहरू सेभ गर्नुहोस्, पछि पढ्नका लागि।",
    "steps": [
     "भिडियोबाट सबटाइटलको एउटा वाक्य वा शब्द पेस्ट गर्नुहोस्।",
     "आफ्नो सूचीमा सेभ गर्नुहोस्।",
     "सेभ गरेका वाक्यहरू दोहोर्याउन फर्कनुहोस्।"
    ],
    "example": "उदाहरण: एनिमेको एउटा एपिसोडबाट एउटा वाक्य पेस्ट गर्नुहोस् → सेभ गर्नुहोस् → भोलि दोहोर्याउनुहोस्।"
   },
   "milestones": {
    "title": "माइलस्टोन",
    "what": "तपाईंको लक्ष्यको नक्सा र प्रगति जाँच, ताकि तपाईं कति टाढा आइपुग्नुभयो भनेर देख्न सक्नुहोस्।",
    "steps": [
     "आफ्नो लक्ष्यका लागि रोडम्यापका चरणहरू पढ्नुहोस्।",
     "तपाईं कहाँ हुनुहुन्छ हेर्न प्रगति जाँच प्रयोग गर्नुहोस्।",
     "अगाडि बढ्न आफ्नो स्ट्रिक जारी राख्नुहोस्।"
    ],
    "example": "उदाहरण: अर्को माइलस्टोनमा पुग्न यो हप्ताका कामहरू पूरा गर्नुहोस्।"
   },
   "jlpt": {
    "title": "JLPT नतिजा",
    "what": "तपाईंका शिक्षकले पठाएको JLPT निदान नतिजा यहाँ देखिन्छ।",
    "steps": [
     "शिक्षकले तपाईंको नतिजा पठाउने प्रतीक्षा गर्नुहोस्।",
     "हेर्न यो ट्याब खोल्नुहोस्।",
     "सेभ गर्न Download PDF थिच्नुहोस्।"
    ],
    "example": "उदाहरण: मक टेस्टपछि, तपाईंको नतिजा रिपोर्ट यहाँ देखिन्छ।"
   },
   "feedback": {
    "title": "प्रतिक्रिया",
    "what": "GAKU Master मा के सुधार गर्नुपर्छ हामीलाई भन्नुहोस्।",
    "steps": [
     "आफ्नो विचार वा समस्या लेख्नुहोस्।",
     "Send थिच्नुहोस्।",
     "कृपया नम्र हुनुहोस् — अपशब्द भएका सन्देशहरू स्वीकार गरिँदैन।"
    ],
    "example": "उदाहरण: \"कृपया N4 व्याकरणका थप प्रश्नहरू थप्नुहोस्।\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "कुनै पनि शब्द खोज्नुहोस् र त्यसको word card खोल्नुहोस् — अर्थ, पढाइ र उदाहरण वाक्यहरू।",
    "steps": [
     "अंग्रेजी वा जापानी शब्द (वा विषय) टाइप गरेर Search थिच्नुहोस्।",
     "कार्ड खोल्न नतिजामा थिच्नुहोस्।",
     "पछि दोहोर्याउन फोल्डरमा सेभ गर्नुहोस्।"
    ],
    "example": "उदाहरण: \"階段\" खोज्नुहोस् → कार्ड खोल्नुहोस् → आफ्नो \"Daily life\" फोल्डरमा Save गर्नुहोस्।"
   },
   "vocab_library": {
    "title": "Library",
    "what": "तपाईंले सेभ गरेका सबै शब्दहरू, फोल्डरमा मिलाएर।",
    "steps": [
     "भित्रका word cards हेर्न फोल्डरमा थिच्नुहोस्।",
     "फोल्डरका सबै शब्द एकपछि अर्को सुन्न त्यसमा 🔊 ▶ थिच्नुहोस्।",
     "आफ्ना शब्दहरू अभ्यास गर्न \"Quick review with Flashcards\" थिच्नुहोस्।"
    ],
    "example": "सुझाव: \"New folder\" बाट आफ्नै फोल्डरहरू बनाउनुहोस् (उदाहरणका लागि, हरेक पाठका लागि एउटा फोल्डर)।"
   },
   "vocab_folder": {
    "title": "यो फोल्डरका Word cards",
    "what": "तलको हरेक बाकस एउटा word card हो — तपाईंले सेभ गरेको एउटा शब्द।",
    "steps": [
     "खोल्न word card मा थिच्नुहोस्: अर्थ, पढाइ र उदाहरण वाक्यहरू।",
     "शब्द सुन्न 🔊 थिच्नुहोस्। यो फोल्डरका सबै शब्द सुन्न 🔊 ▶ All (माथि दायाँ) थिच्नुहोस्।",
     "त्यही शब्द मात्र अभ्यास गर्न Go Flashcard थिच्नुहोस्। कार्ड मेटाउन फोहोर फाल्ने डस्टबिनमा थिच्नुहोस्।"
    ],
    "example": "सुझाव: \"📋 Copy to folder\" ले शब्दहरूलाई अर्को फोल्डरमा कपी गर्छ (उदाहरणका लागि, तपाईंको अर्को पाठको फोल्डर)।"
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "सेभ गरेका शब्दहरू कागजका फ्ल्यासकार्ड जस्तै अभ्यास गर्नुहोस्। उत्तर हेर्न कार्डमा थिचेर पल्टाउनुहोस्।",
    "steps": [
     "शब्द हेरेर अर्थ सम्झने प्रयास गर्नुहोस्। पढाइ चाहिए Hint थिच्नुहोस्, त्यसपछि उत्तर हेर्न कार्डमा थिच्नुहोस्।",
     "तपाईंलाई थाहा थियो भने ✅ Understand थिच्नुहोस्। शब्द \"Understood\" फोल्डरमा जान्छ, त्यसैले तपाईंले नजानेका शब्दहरू मात्र दोहोर्याउन सक्नुहुन्छ। यो अझै पनि तपाईंको Library मा सेभ छ — केही हराउँदैन।",
     "थाहा थिएन भने केही नथिच्नुहोस्। अर्को कार्डका लागि → थिच्नुहोस्; त्यो शब्द तपाईंको डेकमै रहन्छ।"
    ],
    "example": "Intensive Mode ले तपाईंले हरेक कार्ड कति छिटो पल्टाउनुभयो र Understand कति पटक थिच्नुभयो भनेर रेकर्ड गर्छ, र कुन शब्द साँच्चै थाहा छ र कुन छैन भनेर देखाउन त्यसको प्रयोग गर्छ।",
    "action": "Intensive Mode प्रयास गर्नुहोस्"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "औंला वा माउसले हरेक स्ट्रोक कोर्दै, एक-एक अक्षर गरी जापानी सार्नुहोस्। GAKU ले तपाईंको स्ट्रोक क्रम र आकार जाँच्छ।",
    "steps": [
     "बाकसमा जापानी वाक्य पेस्ट गर्नुहोस्, वा सेभ गरेका शब्द प्रयोग गर्न \"Choose words from your Library\" थिच्नुहोस्।",
     "\"Start writing\" थिच्नुहोस्।",
     "हरेक अक्षर, एक-एक स्ट्रोक गरी लेख्नुहोस्।"
    ],
    "example": "सुझाव: एक पटकमा ३० अक्षरसम्म अभ्यास गरिन्छ।"
   },
   "res_writing_copy_write": {
    "title": "एक-एक अक्षर लेख्ने",
    "what": "तपाईंले पेस्ट गरेको पाठ वा Library बाट छानेका शब्दहरू एक-एक अक्षर गरी लेख्नुहुन्छ।",
    "steps": [
     "अक्षर सही क्रममा एक-एक स्ट्रोक गरी लेख्नुहोस्। स्ट्रोक गलत भए GAKU ले भन्छ।",
     "कसरी लेख्ने थाहा छैन? ▶ Watch stroke order थिच्नुहोस्। फेरि प्रयास गर्न चाहनुहुन्छ? ↺ Try again थिच्नुहोस्।",
     "एउटा अक्षर सकिएपछि नीलो Next ▶ बटन थिच्नुहोस्। अन्तिम अक्षरमा यसले Finish भन्छ।"
    ],
    "notes": [
     "गाइड भनेको अक्षरको धमिलो खैरो रूपरेखा हो। 👁 Show guide ले तपाईं त्यसमाथि कोर्न सक्नुहुन्छ; 🙈 Hide guide ले सम्झेर लेख्नुहुन्छ।",
     "नयाँ पाठले तपाईंलाई अघिल्लो स्क्रिनमा फर्काउँछ, जहाँ तपाईं नयाँ शब्द, अक्षर वा वाक्य छान्नुहुन्छ।"
    ],
    "example": "Intensive Mode ले तपाईंको लेखाइ अझ सही रूपमा नाप्छ र तपाईंलाई गाह्रो लाग्ने अक्षर, शब्द र वाक्यहरूको विश्लेषण गर्छ।",
    "action": "Intensive Mode प्रयास गर्नुहोस्"
   },
   "res_links": {
    "title": "स्रोतहरू",
    "what": "तपाईंको स्तर र सीपका लागि छानिएका वेबसाइट, भिडियो र एपहरू।",
    "steps": [
     "तलका कार्डहरू हेर्नुहोस् (हरेक कार्ड एउटा भिडियो वा वेबसाइट हो)। ती तपाईंको स्तरअनुसार छानिएका हुन्।",
     "मन परेको कार्डमा Open बटन थिच्नुहोस्।",
     "नचिनेका शब्द खोज्न त्यो पेजमा GAKU Reader प्रयोग गर्नुहोस्।"
    ],
    "example": "उदाहरण: सिफारिस गरिएको पढ्ने साइट खोल्नुहोस् र एउटा छोटो पेज पढ्नुहोस्।"
   },
   "res_content": {
    "title": "Create From Content",
    "what": "तपाईंले पढिरहेको वा हेरिरहेको कुनै पनि जापानी पेस्ट गर्नुहोस्, र GAKU ले त्यसलाई अभ्यास प्रश्नहरूमा बदलिदिन्छ।",
    "steps": [
     "जापानी पाठ (लेख, सबटाइटल, सन्देश) पेस्ट गर्नुहोस्।",
     "प्रश्नहरू बनाउन Analyze थिच्नुहोस्।",
     "प्रश्नहरूको उत्तर दिनुहोस्, र मद्दत चाहिए furigana / romaji / अनुवाद खोल्नुहोस्।"
    ],
    "example": "उदाहरण: अपार्टमेन्टको सूचना पेस्ट गर्नुहोस् → त्यसबाट अर्थ, कान्जी र व्याकरणका प्रश्नहरू पाउनुहोस्।"
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "आफ्नो माइक नजिक एउटा वास्तविक भिडियो चलाउनुहोस्। GAKU ले सुन्छ, वास्तविक वाक्यहरू देखाउँछ, र जवाफ दिन मद्दत गर्छ।",
    "steps": [
     "सुन्ने बटन थिच्नुहोस् र आवाज सहितको जापानी भिडियो चलाउनुहोस्।",
     "तपाईंले सुनेको हरेक वाक्य एउटा कार्ड बन्छ। GAKU ले कुनै वाक्य बुझ्न सकेन भने, फेरि सुन्न भन्छ — कृपया सुनिरहनुभएको भिडियो वा अडियो फेरि चलाउनुहोस्।",
     "स्वाभाविक जवाफ अभ्यास गर्न \"How would you respond?\" थिच्नुहोस्।"
    ],
    "example": "उदाहरण: YouTube को कुराकानी चलाउनुहोस् → ४ विकल्पबाट सबैभन्दा राम्रो जवाफ छान्नुहोस्।",
    "intensive": "तपाईंले जवाफ बोल्दा GAKU ले तपाईंको जापानी जाँच्छ। Intensive Mode ले बोलेको हरेक जवाफ सही थियो कि थिएन र तपाईंले कस्तो गल्ती गर्नुभयो (कारक/पार्टिकल, क्रियाको रूप, शब्द छनोट, शब्द क्रम वा हिज्जे), र दोहोरिने गलत शब्दहरू रेकर्ड गर्छ। त्यसपछि आज केमा ध्यान दिने भनेर सुझाव दिन्छ।"
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "जापानी ठूलो स्वरले पढ्नुहोस् (वा सुनेर दोहोर्याउनुहोस्) र तपाईंको बोलाइ कति नजिक थियो हेर्नुहोस्।",
    "steps": [
     "वाक्यांशहरू पाउन जापानी पाठ पेस्ट गर्नुहोस्।",
     "सुन्नुहोस्, त्यसपछि आफू बोलेको रेकर्ड गर्नुहोस्।",
     "आफ्नो नतिजा हेर्नुहोस् र फेरि प्रयास गर्नुहोस्।"
    ],
    "example": "उदाहरण: गीतको एउटा छोटो लाइन पेस्ट गर्नुहोस् → बोल्नुहोस् → आफ्नो स्कोर हेर्नुहोस्।",
    "intensive": "Intensive Mode ले हरेक उच्चारण प्रयासको नतिजा (र तपाईंको स्कोर) रेकर्ड गर्छ, ताकि तपाईंले बारम्बार गल्ती गर्ने वाक्यांशहरू भेट्टाएर थप अभ्यासका लागि सुझाव दिन सकोस्।"
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "पाठ सारेर वा प्रश्नहरूको उत्तर दिएर जापानी लेख्ने अभ्यास गर्नुहोस्।",
    "steps": [
     "एउटा मोड छान्नुहोस् (Copying down वा Questions)।",
     "पाठ छान्नुहोस्, वा आफ्नो Library बाट शब्दहरू छान्नुहोस्।",
     "आफ्नो उत्तर टाइप गरेर जाँच्नुहोस्।"
    ],
    "example": "उदाहरण: मंगाको एउटा दृश्यबाट ३ वाक्य सार्नुहोस्, त्यसपछि आफ्नो टाइपिङ जाँच्नुहोस्।",
    "intensive": "Intensive Mode ले तपाईंको लेखाइको शुद्धता अझ ध्यानपूर्वक नाप्छ। Copying down मा, यसले हरेक अक्षर र स्ट्रोक रेकर्ड गर्छ। Questions मोडमा, GAKU ले तपाईंको उत्तर जाँच्छ र गल्तीको प्रकार (कारक/पार्टिकल, क्रियाको रूप, शब्द छनोट, शब्द क्रम वा हिज्जे) र गलत शब्दहरू रेकर्ड गर्छ। त्यसपछि तपाईंले सबैभन्दा धेरै कस्ता गल्ती गर्नुहुन्छ र आज के अभ्यास गर्ने भनेर देखाउँछ।"
   }
  }
 },
 "Filipino": {
  "labels": {
   "how": "Paano gamitin",
   "what": "Ano ito?",
   "steps": "3 hakbang",
   "close": "Isara",
   "never": "Huwag nang ipakita muli",
   "tryIntensive": "Subukan ang Intensive Mode"
  },
  "firstSteps": {
   "title": "Ang iyong mga unang hakbang",
   "sub": "Mga 3 minuto lang",
   "profile": "I-set up ang iyong profile",
   "content": "Subukan ang Create From Content (1 min)",
   "word": "I-save ang una mong salita",
   "go": "Simulan →",
   "allDone": "🎉 Magandang simula! Natapos mo na ang iyong mga unang hakbang.",
   "ok": "OK",
   "hide": "Itago",
   "progress": "{n} / {m} tapos na"
  },
  "hints": {
   "vocab_search": "Mag-type ng isang salita at hanapin ito — pagkatapos ay i-save sa iyong Library.",
   "content_sample": "Nagdagdag kami ng sample na teksto para sa iyo. I-tap lang ang button sa ibaba — o i-paste ang sarili mong teksto.",
   "content_analyze": "I-tap dito — handa na ang una mong mga aktibidad sa loob ng mga isang minuto."
  },
  "sections": {
   "schedule": {
    "title": "Iskedyul",
    "what": "Ang personal mong lingguhang plano sa pag-aaral. Isang beses lang ito ginagawa para sa iyo at hindi magbabago maliban kung pindutin mo ang \"Update my study guide\" sa Edit Profile.",
    "steps": [
     "Buksan ang mga gawain ngayong araw at gawin ang mga ito nang sunud-sunod.",
     "I-tap ang link ng gawain o ang button na \"Go to…\" para buksan ang tamang tool.",
     "I-tick ang kahon kapag tapos ka na — tataas ang iyong streak at progreso."
    ],
    "example": "Halimbawa: \"Read a manga scene\" → i-tap ang link → bumalik → i-tick.",
    "intensive": "Sa itaas ng screen na ito, ipinapakita ng Intensive Mode ang pang-araw-araw na goal (8 aksyon bawat araw) at binabalaan ka kung nahuhuli ka. Tinitingnan din nito ang pag-aaral mo sa nakaraang 14 na araw at iminumungkahi ang mga bahaging pinakamarami kang pagkakamali, para alam mo kung ano ang dapat sanayin ngayon."
   },
   "vocabulary": {
    "title": "Bokabularyo",
    "what": "Maghanap ng kahit anong salita at i-save ito sa sarili mong mga folder (Library) para balikan mamaya.",
    "steps": [
     "Mag-type ng salita sa Ingles o Hapon at hanapin ito.",
     "I-tap ang Save at pumili ng folder.",
     "Buksan ang Library para mag-review gamit ang flashcards o makinig sa bigkas."
    ],
    "example": "Halimbawa: hanapin ang \"階段\" → Save → i-review sa iyong \"Daily life\" folder."
   },
   "subtitles": {
    "title": "Subtitle",
    "what": "I-save ang mga salita at linya mula sa mga video na pinapanood mo, para mapag-aralan mo ito mamaya.",
    "steps": [
     "I-paste ang linya ng subtitle o salita mula sa video.",
     "I-save ito sa iyong listahan.",
     "Bumalik para i-review ang mga linyang na-save mo."
    ],
    "example": "Halimbawa: mag-paste ng linya mula sa episode ng anime → i-save → i-review bukas."
   },
   "milestones": {
    "title": "Mga milestone",
    "what": "Ang roadmap ng iyong goal at progress check, para makita mo kung gaano ka na kalayo.",
    "steps": [
     "Basahin ang mga hakbang ng roadmap para sa iyong goal.",
     "Gamitin ang progress check para makita kung nasaan ka na.",
     "Panatilihin ang iyong streak para patuloy na umasenso."
    ],
    "example": "Halimbawa: tapusin ang mga gawain ngayong linggo para maabot ang susunod na milestone."
   },
   "jlpt": {
    "title": "Resulta ng JLPT",
    "what": "Dito lalabas ang resulta ng iyong JLPT diagnosis na ipinadala ng iyong guro.",
    "steps": [
     "Hintayin na ipadala ng iyong guro ang resulta mo.",
     "Buksan ang tab na ito para makita ito.",
     "I-tap ang Download PDF para i-save ito."
    ],
    "example": "Halimbawa: pagkatapos ng mock test mo, lalabas dito ang ulat ng resulta mo."
   },
   "feedback": {
    "title": "Feedback",
    "what": "Sabihin sa amin kung ano ang dapat pagandahin sa GAKU Master.",
    "steps": [
     "Isulat ang iyong ideya o problema.",
     "I-tap ang Send.",
     "Maging magalang po — hindi tinatanggap ang mga mapanirang mensahe."
    ],
    "example": "Halimbawa: \"Pakidagdagan po ng mas maraming tanong sa grammar ng N4.\""
   },
   "vocab_wordcards": {
    "title": "Word Cards",
    "what": "Maghanap ng kahit anong salita at buksan ang word card nito — kahulugan, basa, at mga halimbawang pangungusap.",
    "steps": [
     "Mag-type ng salitang Ingles o Hapon (o paksa) at i-tap ang Search.",
     "I-tap ang isang resulta para buksan ang card nito.",
     "I-save ito sa folder para ma-review mo mamaya."
    ],
    "example": "Halimbawa: hanapin ang \"階段\" → buksan ang card → Save sa iyong \"Daily life\" folder."
   },
   "vocab_library": {
    "title": "Library",
    "what": "Lahat ng salitang na-save mo, nakaayos sa mga folder.",
    "steps": [
     "I-tap ang folder para makita ang mga word card sa loob.",
     "I-tap ang 🔊 ▶ sa folder para pakinggan ang lahat ng salita nito nang sunud-sunod.",
     "I-tap ang \"Quick review with Flashcards\" para magsanay sa mga salita mo."
    ],
    "example": "Tip: gumawa ng sarili mong mga folder gamit ang \"New folder\" (halimbawa, isang folder para sa bawat aralin)."
   },
   "vocab_folder": {
    "title": "Mga word card sa folder na ito",
    "what": "Ang bawat kahon sa ibaba ay isang word card — isang salitang na-save mo.",
    "steps": [
     "I-tap ang word card para buksan ito: kahulugan, basa, at mga halimbawang pangungusap.",
     "I-tap ang 🔊 para pakinggan ang salita. I-tap ang 🔊 ▶ All (itaas na kanan) para pakinggan ang bawat salita sa folder na ito.",
     "I-tap ang Go Flashcard para magsanay sa salitang iyon lang. I-tap ang basurahan para burahin ang card."
    ],
    "example": "Tip: ang \"📋 Copy to folder\" ay kumokopya ng mga salita sa ibang folder (halimbawa, sa folder ng susunod mong aralin)."
   },
   "vocab_flashcard": {
    "title": "Flashcards",
    "what": "Magsanay sa mga na-save mong salita na parang papel na flashcard. I-tap ang card para baligtarin ito at tingnan ang sagot.",
    "steps": [
     "Tingnan ang salita at subukang alalahanin ang kahulugan. I-tap ang Hint kung kailangan mo ang basa, tapos i-tap ang card para makita ang sagot.",
     "Kung alam mo ito, i-tap ang ✅ Understand. Lilipat ang salita sa folder na \"Understood\", kaya puwede mong i-review ang mga salitang hindi mo pa alam. Nasa Library mo pa rin ito — walang mawawala.",
     "Kung hindi mo alam, huwag pindutin ang kahit ano. I-tap lang ang → para sa susunod na card; mananatili ito sa iyong deck."
    ],
    "example": "Itinatala ng Intensive Mode kung gaano kabilis mong binabaligtad ang bawat card at ilang beses mong pinindot ang Understand, at ginagamit ito para ipakita kung aling mga salita ang talagang alam mo at alin ang hindi pa.",
    "action": "Subukan ang Intensive Mode"
   },
   "res_writing_copy": {
    "title": "Writing Practice — Copying down",
    "what": "Kopyahin ang Hapon nang isang karakter bawat beses, at iguhit ang bawat stroke gamit ang daliri o mouse. Sinusuri ng GAKU ang pagkakasunod-sunod at hugis ng mga stroke mo.",
    "steps": [
     "I-paste ang pangungusap na Hapon sa kahon, o i-tap ang \"Choose words from your Library\" para gamitin ang mga na-save mong salita.",
     "I-tap ang \"Start writing\".",
     "Isulat ang bawat karakter, isang stroke bawat beses."
    ],
    "example": "Tip: hanggang 30 karakter ang sinasanay sa isang pagkakataon."
   },
   "res_writing_copy_write": {
    "title": "Pagsulat ng isang karakter bawat beses",
    "what": "Isusulat mo, isang karakter bawat beses, ang teksto na ipinaste mo o ang mga salitang pinili mo mula sa iyong Library.",
    "steps": [
     "Isulat ang karakter nang isang stroke bawat beses, sa tamang pagkakasunod-sunod. Sasabihin ng GAKU kapag mali ang isang stroke.",
     "Hindi sigurado kung paano ito isulat? I-tap ang ▶ Watch stroke order. Gusto mong ulitin? I-tap ang ↺ Try again.",
     "Kapag tapos ka na sa isang karakter, i-tap ang asul na button na Next ▶. Sa huling karakter, Finish ang nakasulat."
    ],
    "notes": [
     "Ang guide ay ang mahinang kulay-abong balangkas ng karakter. Sa 👁 Show guide, puwede mo itong sundan; sa 🙈 Hide guide, isusulat mo ito mula sa memorya.",
     "Ibabalik ka ng bagong teksto sa nakaraang screen, kung saan pipili ka ng bagong mga salita, karakter, o pangungusap."
    ],
    "example": "Mas tumpak na sinusukat ng Intensive Mode ang pagsulat mo at sinusuri ang mga karakter, salita, at pangungusap na nahihirapan ka.",
    "action": "Subukan ang Intensive Mode"
   },
   "res_links": {
    "title": "Mga resources",
    "what": "Mga piniling website, video, at app para sa iyong level at kakayahan.",
    "steps": [
     "Tingnan ang mga card sa ibaba (ang bawat card ay video o website). Pinili ang mga ito ayon sa level mo.",
     "I-tap ang button na Open sa card na gusto mo.",
     "Gamitin ang GAKU Reader sa pahinang iyon para hanapin ang mga salitang hindi mo alam."
    ],
    "example": "Halimbawa: buksan ang isang inirerekomendang reading site at magbasa ng isang maikling pahina."
   },
   "res_content": {
    "title": "Create From Content",
    "what": "I-paste ang kahit anong Hapon na binabasa o pinapanood mo, at gagawin ito ng GAKU na mga tanong pang-praktis.",
    "steps": [
     "I-paste ang tekstong Hapon (artikulo, subtitle, mensahe).",
     "I-tap ang Analyze para gumawa ng mga tanong.",
     "Sagutin ang mga ito, at i-on ang furigana / romaji / salin kung kailangan mo ng tulong."
    ],
    "example": "Halimbawa: mag-paste ng paalala ng apartment → makakuha ng mga tanong sa kahulugan, kanji, at grammar mula rito."
   },
   "res_conversation": {
    "title": "Conversation Practice",
    "what": "Magpatugtog ng totoong video malapit sa mic mo. Nakikinig ang GAKU, ipinapakita ang mga totoong linya, at tinutulungan kang sumagot.",
    "steps": [
     "I-tap ang listen button at magpatugtog ng video na Hapon na may tunog.",
     "Bawat linyang narinig mo ay nagiging card. Kung hindi nakuha ng GAKU ang isang linya, hihilingin nitong makinig ka ulit — pakitugtog muli ang video o audio na pinakinggan mo.",
     "I-tap ang \"How would you respond?\" para magsanay ng natural na sagot."
    ],
    "example": "Halimbawa: magpatugtog ng usapan sa YouTube → piliin ang pinakamagandang sagot mula sa 4 na pagpipilian.",
    "intensive": "Kapag sinabi mo ang sagot mo, sinusuri ng GAKU ang iyong Hapon. Itinatala ng Intensive Mode kung tama ang bawat sagot na binigkas at kung anong uri ng pagkakamali ang nagawa mo (particle, anyo ng pandiwa, pagpili ng salita, pagkakasunod ng salita, o baybay), pati ang mga salitang paulit-ulit na mali. Pagkatapos, iminumungkahi nito kung ano ang dapat pagtuunan ngayon."
   },
   "res_pronunciation": {
    "title": "Pronunciation Practice",
    "what": "Basahin nang malakas ang Hapon (o making at ulitin) at tingnan kung gaano kalapit ang pagbigkas mo.",
    "steps": [
     "I-paste ang tekstong Hapon para makakuha ng mga parirala.",
     "Making, tapos i-record ang sarili mong binibigkas ito.",
     "Tingnan ang resulta mo at subukan ulit."
    ],
    "example": "Halimbawa: mag-paste ng maikling linya ng kanta → bigkasin → tingnan ang iyong score.",
    "intensive": "Itinatala ng Intensive Mode ang resulta ng bawat pagsubok sa pagbigkas (at ang iyong score), para mahanap nito ang mga pariralang palagi mong nagkakamali at imungkahi ang mga ito para sa dagdag na praktis."
   },
   "res_writing": {
    "title": "Writing Practice",
    "what": "Magsanay sa pagsulat ng Hapon sa pamamagitan ng pagkopya ng teksto o pagsagot sa mga tanong.",
    "steps": [
     "Pumili ng mode (Copying down o Questions).",
     "Pumili ng teksto, o pumili ng mga salita mula sa iyong Library.",
     "I-type ang sagot mo at suriin ito."
    ],
    "example": "Halimbawa: kopyahin ang 3 pangungusap mula sa eksena ng manga, tapos suriin ang pagta-type mo.",
    "intensive": "Mas maingat na sinusukat ng Intensive Mode ang katumpakan ng pagsulat mo. Sa Copying down, itinatala nito ang bawat karakter at stroke. Sa Questions mode, sinusuri ng GAKU ang sagot mo at itinatala ang uri ng pagkakamali (particle, anyo ng pandiwa, pagpili ng salita, pagkakasunod ng salita, o baybay) at ang mga maling salita. Pagkatapos, itinuturo nito kung aling mga pagkakamali ang pinakamadalas mong gawin at kung ano ang dapat sanayin ngayon."
   }
  }
 }
};
export default HELP_I18N;

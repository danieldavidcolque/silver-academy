/* ==========================================================
   Contenido inicial (seed). Se carga al primer arranque y
   queda editable por el profesor. Todo persiste en localStorage.
   ========================================================== */
window.SEED = (() => {
  const now = Date.now();

  const LEVELS = [
    { code: 'A1', name: 'Principiante', desc: 'Frases básicas, presentarse.', color: '#5E5D91' },
    { code: 'A2', name: 'Elemental',    desc: 'Rutinas y necesidades simples.', color: '#3C3B6E' },
    { code: 'B1', name: 'Intermedio',   desc: 'Situaciones cotidianas y viajes.', color: '#D93A4F' },
    { code: 'B2', name: 'Intermedio+',  desc: 'Ideas abstractas y opiniones.', color: '#B22234' },
    { code: 'C1', name: 'Avanzado',     desc: 'Fluidez y matices.', color: '#25254A' },
    { code: 'C2', name: 'Maestría',     desc: 'Nivel casi nativo.', color: '#1A1A2E' },
  ];

  /* Cada lección tiene una lista de ejercicios (steps).
     Tipos soportados:
      - "choice"     : elige la traducción / opción correcta
      - "translate"  : ordena palabras para formar la oración
      - "match"      : arrastrable (aquí implementado como tap-to-pair)
      - "listen"     : escucha (usa speechSynthesis) y elige
      - "type"       : escribe la traducción
  */

  const lessons = [
    /* ==========================================================
       LEVEL A1 — BEGINNER (temario Silver English Coach)
       Gramática + Vocabulario. Cada lección con 4–5 ejercicios.
       ========================================================== */

    /* -------- GRAMMAR -------- */

    { id: 'a1-01-pronouns', level: 'A1', title: 'Personal Pronouns', icon: '👤', xp: 20, steps: [
      { type: 'choice', prompt: '"Yo" en inglés', options: ['You','I','He','She'], answer: 1 },
      { type: 'choice', prompt: '"Ella" en inglés', options: ['He','It','She','They'], answer: 2 },
      { type: 'choice', prompt: '"Nosotros" en inglés', options: ['We','You','They','Us'], answer: 0 },
      { type: 'listen', prompt: 'Escuchá el pronombre', speak: 'they', options: ['She','They','We','He'], answer: 1 },
      { type: 'type', prompt: 'Escribí en inglés: "Ustedes / Vosotros"', answer: 'you' },
    ]},

    { id: 'a1-02-to-be', level: 'A1', title: 'Verb "to be" — am / is / are', icon: '🅱️', xp: 25, steps: [
      { type: 'choice', prompt: 'I ___ a student.', options: ['am','is','are','be'], answer: 0 },
      { type: 'choice', prompt: 'She ___ my sister.', options: ['am','are','is','be'], answer: 2 },
      { type: 'choice', prompt: 'They ___ from Argentina.', options: ['is','am','be','are'], answer: 3 },
      { type: 'translate', prompt: 'Ordená: "I am a teacher"', tokens: ['am','a','I','teacher'], answer: [2,0,1,3] },
      { type: 'type', prompt: 'Traducí: "Nosotros somos amigos"', answer: 'we are friends' },
    ]},

    { id: 'a1-03-to-be-neg', level: 'A1', title: '"to be" — negativo y preguntas', icon: '❓', xp: 25, steps: [
      { type: 'choice', prompt: '"Ella no es mi hermana"', options: ["She isn't my sister","She not my sister","She don't my sister","She no is my sister"], answer: 0 },
      { type: 'choice', prompt: '"¿Sos vos Ana?"', options: ['You are Ana?','Are you Ana?','You is Ana?','Is you Ana?'], answer: 1 },
      { type: 'translate', prompt: 'Ordená: "Are they at home?"', tokens: ['at','they','Are','home?'], answer: [2,1,0,3] },
      { type: 'type', prompt: 'Traducí: "No soy médico"', answer: "i am not a doctor" },
    ]},

    { id: 'a1-04-demonstratives', level: 'A1', title: 'This / That / These / Those', icon: '👉', xp: 20, steps: [
      { type: 'choice', prompt: '"Este libro" (cerca)', options: ['That book','This book','These book','Those book'], answer: 1 },
      { type: 'choice', prompt: '"Aquellos autos" (lejos, plural)', options: ['This cars','That cars','These cars','Those cars'], answer: 3 },
      { type: 'choice', prompt: '"Estas mesas"', options: ['These tables','This tables','Those tables','That tables'], answer: 0 },
      { type: 'translate', prompt: 'Ordená: "That is my house"', tokens: ['my','That','house','is'], answer: [1,3,0,2] },
    ]},

    { id: 'a1-05-poss-adj', level: 'A1', title: 'Adjetivos posesivos (my, your, his…)', icon: '🔑', xp: 25, steps: [
      { type: 'choice', prompt: '"Mi casa"', options: ['I house','My house','Me house','Mine house'], answer: 1 },
      { type: 'choice', prompt: '"Su casa (de él)"', options: ['Her house','Its house','His house','Their house'], answer: 2 },
      { type: 'choice', prompt: '"Nuestro auto"', options: ['Our car','Us car','Ours car','We car'], answer: 0 },
      { type: 'translate', prompt: 'Ordená: "Their dog is big"', tokens: ['is','Their','dog','big'], answer: [1,2,0,3] },
      { type: 'type', prompt: 'Traducí: "tu (de vos) libro"', answer: 'your book' },
    ]},

    { id: 'a1-06-articles', level: 'A1', title: 'Artículos: a / an / the', icon: '🔤', xp: 20, steps: [
      { type: 'choice', prompt: '___ apple (una manzana)', options: ['a','an','the','—'], answer: 1 },
      { type: 'choice', prompt: '___ dog is in the garden.', options: ['A','An','The','—'], answer: 2 },
      { type: 'choice', prompt: 'I have ___ car.', options: ['an','the','a','—'], answer: 2 },
      { type: 'choice', prompt: 'She is ___ engineer.', options: ['a','an','the','—'], answer: 1 },
      { type: 'translate', prompt: 'Ordená: "The book is on the table"', tokens: ['on','book','The','the','is','table'], answer: [2,1,4,0,3,5] },
    ]},

    { id: 'a1-07-plurals', level: 'A1', title: 'Plural de sustantivos', icon: '📚', xp: 20, steps: [
      { type: 'choice', prompt: 'Plural de "child"', options: ['childs','children','childes','child'], answer: 1 },
      { type: 'choice', prompt: 'Plural de "box"', options: ['boxs','boxies','boxes','box'], answer: 2 },
      { type: 'choice', prompt: 'Plural de "man"', options: ['mans','men','manes','man'], answer: 1 },
      { type: 'choice', prompt: 'Plural de "baby"', options: ['babys','babies','babyes','baby'], answer: 1 },
      { type: 'type', prompt: 'Escribí el plural: "foot"', answer: 'feet' },
    ]},

    { id: 'a1-08-adjectives', level: 'A1', title: 'Adjetivos', icon: '✨', xp: 20, steps: [
      { type: 'choice', prompt: 'Orden correcto:', options: ['A car red','A red car','Red a car','Car a red'], answer: 1 },
      { type: 'choice', prompt: '"Una casa vieja"', options: ['A house old','An old house','A old house','The old house'], answer: 1 },
      { type: 'translate', prompt: 'Ordená: "She is a beautiful girl"', tokens: ['a','She','girl','beautiful','is'], answer: [1,4,0,3,2] },
      { type: 'type', prompt: 'Traducí: "Un perro pequeño"', answer: 'a small dog' },
    ]},

    { id: 'a1-09-present-simple', level: 'A1', title: 'Present Simple (afirmativo)', icon: '⏰', xp: 25, steps: [
      { type: 'choice', prompt: 'She ___ coffee every day.', options: ['drink','drinks','drinking','drinked'], answer: 1 },
      { type: 'choice', prompt: 'They ___ in London.', options: ['lives','live','living','lived'], answer: 1 },
      { type: 'choice', prompt: 'He ___ TV at night.', options: ['watch','watchs','watches','watching'], answer: 2 },
      { type: 'translate', prompt: 'Ordená: "I work in an office"', tokens: ['in','I','office','an','work'], answer: [1,4,0,3,2] },
      { type: 'type', prompt: 'Traducí: "Ella juega al tenis"', answer: 'she plays tennis' },
    ]},

    { id: 'a1-10-ps-neg', level: 'A1', title: 'Present Simple (negativo y preguntas)', icon: '🤔', xp: 25, steps: [
      { type: 'choice', prompt: '"Yo no fumo"', options: ["I no smoke","I not smoke","I don't smoke","I doesn't smoke"], answer: 2 },
      { type: 'choice', prompt: '"Ella no come carne"', options: ["She don't eat meat","She doesn't eat meat","She not eats meat","She no eat meat"], answer: 1 },
      { type: 'choice', prompt: '"¿Vos hablás inglés?"', options: ['You speak English?','Do you speak English?','Are you speak English?','Does you speak English?'], answer: 1 },
      { type: 'choice', prompt: '"¿Él vive acá?"', options: ['Do he live here?','Does he lives here?','Does he live here?','He lives here?'], answer: 2 },
    ]},

    { id: 'a1-11-question-words', level: 'A1', title: 'Question words (WH-)', icon: '❔', xp: 20, steps: [
      { type: 'choice', prompt: '"¿Qué?"', options: ['Where','What','When','Who'], answer: 1 },
      { type: 'choice', prompt: '"¿Dónde?"', options: ['Why','How','Where','When'], answer: 2 },
      { type: 'choice', prompt: '"¿Cuándo?"', options: ['When','Where','Who','Which'], answer: 0 },
      { type: 'choice', prompt: '"¿Por qué?"', options: ['How','Who','What','Why'], answer: 3 },
      { type: 'listen', prompt: 'Escuchá y elegí', speak: 'How old are you?', options: ['How old are you?','Where are you from?','What is your name?'], answer: 0 },
    ]},

    { id: 'a1-12-word-order', level: 'A1', title: 'Orden de palabras (SVO)', icon: '📐', xp: 25, steps: [
      { type: 'translate', prompt: 'Ordená: "I read books every day"', tokens: ['every','books','I','day','read'], answer: [2,4,1,0,3] },
      { type: 'translate', prompt: 'Ordená: "She goes to school by bus"', tokens: ['by','goes','She','school','bus','to'], answer: [2,1,5,3,0,4] },
      { type: 'choice', prompt: 'Orden correcto:', options: ['Yesterday I went to the park','I went yesterday to the park','I to the park went yesterday','Went I to the park yesterday'], answer: 0 },
    ]},

    { id: 'a1-13-freq-adv', level: 'A1', title: 'Adverbios de frecuencia', icon: '🔁', xp: 25, steps: [
      { type: 'choice', prompt: '"siempre"', options: ['never','always','sometimes','often'], answer: 1 },
      { type: 'choice', prompt: '"nunca"', options: ['always','usually','never','rarely'], answer: 2 },
      { type: 'choice', prompt: 'Posición correcta:', options: ['I always go to gym','I go always to gym','Always I go to gym','Go I always to gym'], answer: 0 },
      { type: 'translate', prompt: 'Ordená: "She usually drinks tea"', tokens: ['drinks','usually','She','tea'], answer: [2,1,0,3] },
      { type: 'type', prompt: 'Traducí: "a veces"', answer: 'sometimes' },
    ]},

    { id: 'a1-14-present-cont', level: 'A1', title: 'Present Continuous', icon: '🏃', xp: 25, steps: [
      { type: 'choice', prompt: '"Estoy comiendo"', options: ['I eat','I am eating','I eating','I am eat'], answer: 1 },
      { type: 'choice', prompt: 'She ___ a book now.', options: ['read','is reading','reading','reads'], answer: 1 },
      { type: 'choice', prompt: 'They ___ football.', options: ['is playing','are playing','playing','play'], answer: 1 },
      { type: 'translate', prompt: 'Ordená: "He is watching TV"', tokens: ['TV','is','He','watching'], answer: [2,1,3,0] },
      { type: 'type', prompt: 'Traducí: "Estamos estudiando inglés"', answer: 'we are studying english' },
    ]},

    { id: 'a1-15-ps-vs-pc', level: 'A1', title: 'Present Simple vs Continuous', icon: '↔️', xp: 25, steps: [
      { type: 'choice', prompt: 'Every morning I ___ coffee.', options: ['drink','am drinking','drinks','drinking'], answer: 0 },
      { type: 'choice', prompt: 'Look! It ___.', options: ['rains','is raining','rain','raining'], answer: 1 },
      { type: 'choice', prompt: 'She usually ___ to work by bike.', options: ['is going','goes','going','go'], answer: 1 },
      { type: 'choice', prompt: 'Right now they ___ dinner.', options: ['have','are having','has','having'], answer: 1 },
    ]},

    { id: 'a1-16-object-pron', level: 'A1', title: 'Object pronouns (me, him, her…)', icon: '🎯', xp: 20, steps: [
      { type: 'choice', prompt: 'She loves ___. (yo)', options: ['I','me','my','mine'], answer: 1 },
      { type: 'choice', prompt: 'I can see ___. (él)', options: ['he','his','him','himself'], answer: 2 },
      { type: 'choice', prompt: 'They know ___. (nosotros)', options: ['we','our','us','ours'], answer: 2 },
      { type: 'choice', prompt: 'Give ___ the book. (a ella)', options: ['her','she','hers','herself'], answer: 0 },
      { type: 'type', prompt: 'Traducí: "Yo los conozco (a ellos)"', answer: 'i know them' },
    ]},

    { id: 'a1-17-possessive-s', level: 'A1', title: "'S Possessive + Whose", icon: '🗝️', xp: 20, steps: [
      { type: 'choice', prompt: '"El auto de Peter"', options: ["Peter's car",'Car of Peter','The Peter car','Peter car'], answer: 0 },
      { type: 'choice', prompt: '"El libro de los chicos" (plural)', options: ["The boys's book","The boys' book",'The boy book','The book of boys'], answer: 1 },
      { type: 'choice', prompt: '"¿De quién es este bolso?"', options: ["Who's bag is this?","Whose bag is this?",'Who bag is this?','Whose is this bag of?'], answer: 1 },
      { type: 'translate', prompt: 'Ordená: "This is Mary\'s house"', tokens: ["Mary's",'This','house','is'], answer: [1,3,0,2] },
    ]},

    { id: 'a1-18-prep-time', level: 'A1', title: 'Prepositions of time (at / in / on)', icon: '🕰️', xp: 25, steps: [
      { type: 'choice', prompt: '___ Monday', options: ['at','in','on','—'], answer: 2 },
      { type: 'choice', prompt: '___ 8 o\'clock', options: ['at','in','on','—'], answer: 0 },
      { type: 'choice', prompt: '___ July', options: ['at','in','on','—'], answer: 1 },
      { type: 'choice', prompt: '___ the morning', options: ['at','in','on','—'], answer: 1 },
      { type: 'choice', prompt: '___ night', options: ['at','in','on','—'], answer: 0 },
    ]},

    { id: 'a1-19-prep-place', level: 'A1', title: 'Prepositions of place (at / in / on)', icon: '📍', xp: 20, steps: [
      { type: 'choice', prompt: '___ home', options: ['at','in','on','—'], answer: 0 },
      { type: 'choice', prompt: '___ the table', options: ['at','in','on','—'], answer: 2 },
      { type: 'choice', prompt: '___ London', options: ['at','in','on','—'], answer: 1 },
      { type: 'choice', prompt: '___ the bus', options: ['at','in','on','—'], answer: 2 },
    ]},

    { id: 'a1-20-prep-place-2', level: 'A1', title: 'Prep. de lugar: under, next to, behind…', icon: '🗺️', xp: 25, steps: [
      { type: 'choice', prompt: '"debajo de"', options: ['on','under','above','behind'], answer: 1 },
      { type: 'choice', prompt: '"detrás de"', options: ['in front of','next to','behind','opposite'], answer: 2 },
      { type: 'choice', prompt: '"al lado de"', options: ['next to','between','over','below'], answer: 0 },
      { type: 'choice', prompt: '"entre" (dos cosas)', options: ['behind','under','between','above'], answer: 2 },
      { type: 'type', prompt: 'Traducí: "frente a (enfrente de)"', answer: 'opposite' },
    ]},

    { id: 'a1-21-can', level: 'A1', title: 'Modal: Can (poder / saber)', icon: '💪', xp: 20, steps: [
      { type: 'choice', prompt: '"Puedo nadar"', options: ['I can to swim','I can swim','I cans swim','I can swimming'], answer: 1 },
      { type: 'choice', prompt: '"Ella no puede venir"', options: ["She can not comes","She can't come","She doesn't can come","She no can come"], answer: 1 },
      { type: 'choice', prompt: '"¿Podés ayudarme?"', options: ['Can you help me?','You can help me?','Do you can help me?','You help me can?'], answer: 0 },
      { type: 'type', prompt: 'Traducí: "Puedo hablar inglés"', answer: 'i can speak english' },
    ]},

    { id: 'a1-22-should-would', level: 'A1', title: 'Should / Would / Shall', icon: '💡', xp: 25, steps: [
      { type: 'choice', prompt: '"Deberías estudiar"', options: ['You would study','You should study','You shall study','You can study'], answer: 1 },
      { type: 'choice', prompt: '"¿Te gustaría un café?"', options: ['Do you like a coffee?','Would you like a coffee?','Should you like a coffee?','Are you like a coffee?'], answer: 1 },
      { type: 'choice', prompt: '"¿Salimos?" (propuesta formal)', options: ['Shall we go out?','Will we go out?','Do we go out?','Are we go out?'], answer: 0 },
      { type: 'type', prompt: 'Traducí: "No deberías fumar"', answer: "you shouldn't smoke" },
    ]},

    { id: 'a1-23-imperative', level: 'A1', title: 'El imperativo', icon: '✋', xp: 20, steps: [
      { type: 'choice', prompt: '"¡Abrí la puerta!"', options: ['You open the door','Open the door','To open the door','Opens the door'], answer: 1 },
      { type: 'choice', prompt: '"No corran"', options: ["Don't run","No run","Not run","Don't running"], answer: 0 },
      { type: 'choice', prompt: '"¡Sean amables!"', options: ['You are nice','Be nice','Being nice','Are nice'], answer: 1 },
      { type: 'translate', prompt: 'Ordená: "Please sit down"', tokens: ['down','Please','sit'], answer: [1,2,0] },
    ]},

    { id: 'a1-24-past-to-be', level: 'A1', title: 'Pasado del verbo "to be" (was/were)', icon: '⏮️', xp: 25, steps: [
      { type: 'choice', prompt: 'I ___ at home yesterday.', options: ['were','was','am','be'], answer: 1 },
      { type: 'choice', prompt: 'They ___ tired.', options: ['was','were','is','are'], answer: 1 },
      { type: 'choice', prompt: 'She ___ not happy.', options: ['were','was','are','is'], answer: 1 },
      { type: 'choice', prompt: '"¿Estuviste ahí?"', options: ['Were you there?','Was you there?','Did you were there?','You were there?'], answer: 0 },
      { type: 'type', prompt: 'Traducí: "Éramos amigos"', answer: 'we were friends' },
    ]},

    { id: 'a1-25-past-simple', level: 'A1', title: 'Past Simple (regular e irregular)', icon: '📅', xp: 30, steps: [
      { type: 'choice', prompt: 'Pasado de "go"', options: ['goed','went','gone','goes'], answer: 1 },
      { type: 'choice', prompt: 'Pasado de "eat"', options: ['eated','eaten','ate','eat'], answer: 2 },
      { type: 'choice', prompt: 'Pasado de "play"', options: ['played','plaid','plays','playing'], answer: 0 },
      { type: 'choice', prompt: '"Yo no lo vi"', options: ["I didn't saw it","I not see it","I didn't see it","I no see it"], answer: 2 },
      { type: 'choice', prompt: '"¿Estudiaste ayer?"', options: ['Did you study yesterday?','You studied yesterday?','Were you study yesterday?','Do you studied yesterday?'], answer: 0 },
    ]},

    { id: 'a1-26-past-cont', level: 'A1', title: 'Past Continuous (was/were + -ing)', icon: '🎬', xp: 25, steps: [
      { type: 'choice', prompt: '"Estaba durmiendo"', options: ['I sleeped','I was sleeping','I were sleeping','I am sleeping'], answer: 1 },
      { type: 'choice', prompt: 'They ___ TV at 9 pm.', options: ['was watching','watched','were watching','are watching'], answer: 2 },
      { type: 'translate', prompt: 'Ordená: "She was cooking dinner"', tokens: ['cooking','was','She','dinner'], answer: [2,1,0,3] },
      { type: 'type', prompt: 'Traducí: "Estábamos hablando"', answer: 'we were talking' },
    ]},

    { id: 'a1-27-past-simple-vs-cont', level: 'A1', title: 'Past Simple vs Continuous', icon: '🔀', xp: 25, steps: [
      { type: 'choice', prompt: 'While I ___ TV, the phone rang.', options: ['watched','was watching','watch','were watching'], answer: 1 },
      { type: 'choice', prompt: 'When she arrived, we ___ dinner.', options: ['had','were having','have','are having'], answer: 1 },
      { type: 'choice', prompt: 'Yesterday I ___ to the cinema.', options: ['was going','go','went','were going'], answer: 2 },
    ]},

    { id: 'a1-28-have-got', level: 'A1', title: 'Have / Have got', icon: '🎒', xp: 20, steps: [
      { type: 'choice', prompt: '"Tengo dos hermanos"', options: ['I have got two brothers','I got two brothers','I am two brothers','I has two brothers'], answer: 0 },
      { type: 'choice', prompt: '"Ella no tiene auto"', options: ["She hasn't got a car","She don't have a car","She no has a car","She isn't have a car"], answer: 0 },
      { type: 'choice', prompt: '"¿Tenés hijos?"', options: ['Have you children?','Do you have got children?','Have you got children?','Are you have children?'], answer: 2 },
      { type: 'type', prompt: 'Traducí: "Él tiene un perro"', answer: 'he has got a dog' },
    ]},

    { id: 'a1-29-count-uncount', level: 'A1', title: 'Countables / Uncountables + some/any/no', icon: '🧮', xp: 25, steps: [
      { type: 'choice', prompt: 'There is ___ milk in the fridge.', options: ['some','any','no','a'], answer: 0 },
      { type: 'choice', prompt: 'I don\'t have ___ money.', options: ['some','any','no','the'], answer: 1 },
      { type: 'choice', prompt: 'There are ___ apples on the table.', options: ['any','a','some','much'], answer: 2 },
      { type: 'choice', prompt: 'Es incontable:', options: ['book','water','apple','chair'], answer: 1 },
      { type: 'choice', prompt: '"No queda pan"', options: ['There is no bread','There is any bread','There is some bread','There is not bread'], answer: 0 },
    ]},

    { id: 'a1-30-quantifiers', level: 'A1', title: 'Little / few / much / many / a lot', icon: '⚖️', xp: 25, steps: [
      { type: 'choice', prompt: 'How ___ water do you drink?', options: ['many','much','few','little'], answer: 1 },
      { type: 'choice', prompt: 'How ___ books do you have?', options: ['much','many','little','few'], answer: 1 },
      { type: 'choice', prompt: 'I have ___ friends. (varios pero no muchos)', options: ['a few','few','a little','little'], answer: 0 },
      { type: 'choice', prompt: 'She has ___ time. (casi nada)', options: ['a little','little','a few','few'], answer: 1 },
      { type: 'choice', prompt: 'We have ___ homework.', options: ['many','a lot of','few','a few'], answer: 1 },
    ]},

    { id: 'a1-31-there-is', level: 'A1', title: 'There is / are / was / were', icon: '🏘️', xp: 25, steps: [
      { type: 'choice', prompt: 'There ___ a book on the desk.', options: ['is','are','was','were'], answer: 0 },
      { type: 'choice', prompt: 'There ___ many people at the party.', options: ['is','are','was','were'], answer: 1 },
      { type: 'choice', prompt: 'Yesterday there ___ a storm.', options: ['is','are','was','were'], answer: 2 },
      { type: 'choice', prompt: 'There ___ two cats in the garden last night.', options: ['is','are','was','were'], answer: 3 },
      { type: 'translate', prompt: 'Ordená: "There is a chair here"', tokens: ['a','There','here','chair','is'], answer: [1,4,0,3,2] },
    ]},

    { id: 'a1-32-comparatives', level: 'A1', title: 'Comparativos y superlativos', icon: '🏆', xp: 25, steps: [
      { type: 'choice', prompt: 'Comparativo de "big"', options: ['biger','bigger','more big','biggest'], answer: 1 },
      { type: 'choice', prompt: 'Superlativo de "good"', options: ['the goodest','the best','the better','the more good'], answer: 1 },
      { type: 'choice', prompt: 'Comparativo de "beautiful"', options: ['beautifuler','more beautiful','beautifullest','the most beautiful'], answer: 1 },
      { type: 'choice', prompt: '"El más rápido"', options: ['the faster','the fastest','the most fast','more fast'], answer: 1 },
      { type: 'type', prompt: 'Traducí: "Ella es más alta que yo"', answer: 'she is taller than me' },
    ]},

    { id: 'a1-33-conjunctions', level: 'A1', title: 'Conjunciones (and, but, or, so, because)', icon: '🔗', xp: 20, steps: [
      { type: 'choice', prompt: 'I like tea ___ coffee. (ambos)', options: ['but','or','and','so'], answer: 2 },
      { type: 'choice', prompt: 'I am tired ___ I will sleep.', options: ['but','because','or','so'], answer: 3 },
      { type: 'choice', prompt: 'I stayed home ___ it was raining.', options: ['because','so','but','and'], answer: 0 },
      { type: 'choice', prompt: '"Té ___ café" (uno u otro)', options: ['and','but','or','so'], answer: 2 },
    ]},

    { id: 'a1-34-inf-ing', level: 'A1', title: 'Verbs + to + inf / + -ing', icon: '🎓', xp: 25, steps: [
      { type: 'choice', prompt: 'I want ___ home.', options: ['go','going','to go','goes'], answer: 2 },
      { type: 'choice', prompt: 'She enjoys ___ music.', options: ['listen','to listen','listening','listens'], answer: 2 },
      { type: 'choice', prompt: 'I would like ___ you.', options: ['meet','to meet','meeting','meets'], answer: 1 },
      { type: 'choice', prompt: 'He hates ___ up early.', options: ['get','to get','getting','gets'], answer: 2 },
    ]},

    { id: 'a1-35-will', level: 'A1', title: 'Futuro con "will"', icon: '🔮', xp: 25, steps: [
      { type: 'choice', prompt: '"Te llamaré mañana"', options: ['I call you tomorrow','I will call you tomorrow','I am calling you tomorrow','I called you tomorrow'], answer: 1 },
      { type: 'choice', prompt: 'She ___ come to the party.', options: ['wills','will','will to','is will'], answer: 1 },
      { type: 'choice', prompt: '"No lloveré" — Correcto:', options: ["It won't rain","It don't will rain","It not will rain","It doesn't will rain"], answer: 0 },
      { type: 'translate', prompt: 'Ordená: "I will help you"', tokens: ['help','I','you','will'], answer: [1,3,0,2] },
    ]},

    { id: 'a1-36-going-to', level: 'A1', title: 'Futuro con "going to"', icon: '🎯', xp: 25, steps: [
      { type: 'choice', prompt: '"Voy a estudiar esta noche"', options: ["I go study tonight","I'm going to study tonight","I will study going tonight","I study going tonight"], answer: 1 },
      { type: 'choice', prompt: 'They ___ move next month.', options: ['going to','are going to','will going to','go to'], answer: 1 },
      { type: 'choice', prompt: 'Look at those clouds! It ___ rain.', options: ['will','is going to','goes to','rains'], answer: 1 },
      { type: 'type', prompt: 'Traducí: "Ella va a viajar mañana"', answer: 'she is going to travel tomorrow' },
    ]},

    /* -------- VOCABULARY -------- */

    { id: 'a1-v01-days', level: 'A1', title: 'Vocab: Días de la semana', icon: '📆', xp: 20, steps: [
      { type: 'choice', prompt: '"Lunes"', options: ['Monday','Sunday','Tuesday','Friday'], answer: 0 },
      { type: 'choice', prompt: '"Miércoles"', options: ['Wednesday','Thursday','Tuesday','Wensday'], answer: 0 },
      { type: 'choice', prompt: '"Sábado"', options: ['Saterday','Saturday','Satday','Sunday'], answer: 1 },
      { type: 'listen', prompt: 'Escuchá el día', speak: 'Friday', options: ['Monday','Friday','Sunday','Thursday'], answer: 1 },
      { type: 'type', prompt: 'Traducí: "Domingo"', answer: 'sunday' },
    ]},

    { id: 'a1-v02-months', level: 'A1', title: 'Vocab: Meses del año', icon: '🗓️', xp: 20, steps: [
      { type: 'choice', prompt: '"Enero"', options: ['June','January','July','August'], answer: 1 },
      { type: 'choice', prompt: '"Agosto"', options: ['April','August','October','August'], answer: 1 },
      { type: 'choice', prompt: '"Diciembre"', options: ['November','September','December','October'], answer: 2 },
      { type: 'listen', prompt: 'Escuchá el mes', speak: 'March', options: ['May','March','April','August'], answer: 1 },
      { type: 'type', prompt: 'Traducí: "Febrero"', answer: 'february' },
    ]},

    { id: 'a1-v03-time', level: 'A1', title: 'Vocab: La hora', icon: '⏱️', xp: 25, steps: [
      { type: 'choice', prompt: '"Son las 3 en punto"', options: ["It's 3 clock","It's 3 o'clock","It's the 3","There is 3 clock"], answer: 1 },
      { type: 'choice', prompt: '"7 y media"', options: ["Half past seven","Seven half","Seven and half","Half to seven"], answer: 0 },
      { type: 'choice', prompt: '"5 y cuarto"', options: ["Five quarter","Quarter past five","Quarter to five","Five and quarter"], answer: 1 },
      { type: 'choice', prompt: '"Cuarto para las 8"', options: ["Quarter past eight","Quarter to eight","Eight quarter","Eight to quarter"], answer: 1 },
      { type: 'type', prompt: '"¿Qué hora es?"', answer: 'what time is it' },
    ]},

    { id: 'a1-v04-date', level: 'A1', title: 'Vocab: La fecha', icon: '📅', xp: 25, steps: [
      { type: 'choice', prompt: '"1° de mayo"', options: ['May the first','May one','First May','May at first'], answer: 0 },
      { type: 'choice', prompt: '"¿Cuál es la fecha de hoy?"', options: ["What is the date today?","What's the day?","When is today?","How day is?"], answer: 0 },
      { type: 'listen', prompt: 'Escuchá', speak: 'March the fifth', options: ['March 5th','May 3rd','March 15th','May 5th'], answer: 0 },
      { type: 'type', prompt: 'Traducí: "3 de julio"', answer: 'july the third' },
    ]},

    { id: 'a1-v05-routine-verbs', level: 'A1', title: 'Vocab: Verbos de rutina', icon: '🌞', xp: 25, steps: [
      { type: 'choice', prompt: '"levantarse"', options: ['sleep','wake up','get up','stand'], answer: 2 },
      { type: 'choice', prompt: '"desayunar"', options: ['have breakfast','have dinner','make lunch','eat food'], answer: 0 },
      { type: 'choice', prompt: '"cepillarse los dientes"', options: ['wash face','brush teeth','clean mouth','shave teeth'], answer: 1 },
      { type: 'choice', prompt: '"ir a dormir"', options: ['go bed','go to bed','get to bed','sleep bed'], answer: 1 },
      { type: 'type', prompt: 'Traducí: "ducharse"', answer: 'take a shower' },
    ]},

    { id: 'a1-v06-school', level: 'A1', title: 'Vocab: Útiles escolares', icon: '✏️', xp: 20, steps: [
      { type: 'choice', prompt: '"lápiz"', options: ['pen','pencil','paper','ruler'], answer: 1 },
      { type: 'choice', prompt: '"goma de borrar"', options: ['glue','sharpener','eraser','marker'], answer: 2 },
      { type: 'choice', prompt: '"regla"', options: ['ruler','rule','rubber','stapler'], answer: 0 },
      { type: 'choice', prompt: '"mochila"', options: ['backpack','handbag','pocket','bag pack'], answer: 0 },
      { type: 'type', prompt: 'Traducí: "cuaderno"', answer: 'notebook' },
    ]},

    { id: 'a1-v07-house', level: 'A1', title: 'Vocab: Partes de la casa', icon: '🏠', xp: 20, steps: [
      { type: 'choice', prompt: '"cocina"', options: ['bedroom','kitchen','bathroom','garage'], answer: 1 },
      { type: 'choice', prompt: '"dormitorio"', options: ['living room','bathroom','bedroom','kitchen'], answer: 2 },
      { type: 'choice', prompt: '"baño"', options: ['bath','bathroom','washroom','toilet room'], answer: 1 },
      { type: 'choice', prompt: '"living / sala"', options: ['living room','sitting','saloon','lounge room'], answer: 0 },
      { type: 'type', prompt: 'Traducí: "jardín"', answer: 'garden' },
    ]},

    { id: 'a1-v08-cardinal', level: 'A1', title: 'Vocab: Números cardinales', icon: '1️⃣', xp: 25, steps: [
      { type: 'choice', prompt: '"catorce"', options: ['fourteen','forty','forteen','four'], answer: 0 },
      { type: 'choice', prompt: '"cuarenta"', options: ['fourteen','forty','fourty','four'], answer: 1 },
      { type: 'choice', prompt: '"cien"', options: ['a hundred','one hundred','one hundreds','hundreds'], answer: 1 },
      { type: 'listen', prompt: 'Escuchá el número', speak: 'seventy-three', options: ['73','37','63','13'], answer: 0 },
      { type: 'type', prompt: 'Escribí: "mil"', answer: 'one thousand' },
    ]},

    { id: 'a1-v09-ordinal', level: 'A1', title: 'Vocab: Números ordinales', icon: '🥇', xp: 25, steps: [
      { type: 'choice', prompt: '"primero"', options: ['oneth','first','one','firsty'], answer: 1 },
      { type: 'choice', prompt: '"segundo"', options: ['twond','secondo','second','twoth'], answer: 2 },
      { type: 'choice', prompt: '"tercero"', options: ['threeth','thirst','third','tird'], answer: 2 },
      { type: 'choice', prompt: '"noveno"', options: ['nineth','ninth','nith','nineth'], answer: 1 },
      { type: 'type', prompt: 'Traducí: "vigésimo"', answer: 'twentieth' },
    ]},

    { id: 'a1-v10-family', level: 'A1', title: 'Vocab: La familia', icon: '👨‍👩‍👧', xp: 20, steps: [
      { type: 'choice', prompt: '"madre"', options: ['sister','mother','aunt','daughter'], answer: 1 },
      { type: 'choice', prompt: '"tío"', options: ['uncle','cousin','nephew','grandfather'], answer: 0 },
      { type: 'choice', prompt: '"prima"', options: ['sister','aunt','cousin','niece'], answer: 2 },
      { type: 'choice', prompt: '"abuela"', options: ['grandmother','godmother','greatmother','mother-in-law'], answer: 0 },
      { type: 'type', prompt: 'Traducí: "hijo"', answer: 'son' },
    ]},

    { id: 'a1-v11-body', level: 'A1', title: 'Vocab: Partes del cuerpo', icon: '🧍', xp: 20, steps: [
      { type: 'choice', prompt: '"cabeza"', options: ['hand','head','hair','face'], answer: 1 },
      { type: 'choice', prompt: '"mano"', options: ['foot','hand','arm','finger'], answer: 1 },
      { type: 'choice', prompt: '"ojos"', options: ['ears','arms','eyes','elbows'], answer: 2 },
      { type: 'choice', prompt: '"rodilla"', options: ['knee','ankle','neck','nose'], answer: 0 },
      { type: 'type', prompt: 'Traducí: "espalda"', answer: 'back' },
    ]},

    { id: 'a1-v12-jobs', level: 'A1', title: 'Vocab: Profesiones y oficios', icon: '👷', xp: 25, steps: [
      { type: 'choice', prompt: '"docente / maestro"', options: ['doctor','teacher','engineer','waiter'], answer: 1 },
      { type: 'choice', prompt: '"médico"', options: ['nurse','doctor','dentist','vet'], answer: 1 },
      { type: 'choice', prompt: '"abogado"', options: ['judge','police','lawyer','writer'], answer: 2 },
      { type: 'choice', prompt: '"mozo / camarero"', options: ['waiter','writer','worker','baker'], answer: 0 },
      { type: 'listen', prompt: 'Escuchá la profesión', speak: 'engineer', options: ['engineer','architect','manager','driver'], answer: 0 },
      { type: 'type', prompt: 'Traducí: "enfermero/a"', answer: 'nurse' },
    ]},

    /* ---------------- A2 ---------------- */
    { id: 'a2-1', level: 'A2', title: 'En el café', icon: '☕', xp: 25, steps: [
      { type: 'choice', prompt: '"Quisiera un café, por favor"', options: ["I'd like a coffee, please", 'I want to eat', 'Give me tea', 'Where is coffee'], answer: 0 },
      { type: 'translate', prompt: 'Ordená: "How much is it?"', tokens: ['is','How','it','much'], answer: [1,3,0,2] },
      { type: 'listen', prompt: 'Escuchá', speak: 'Can I have the bill, please?', options: ['Can I have the bill, please?', 'Where is the toilet?', 'This is very good'], answer: 0 },
      { type: 'type', prompt: 'Traducí: "La cuenta, por favor"', answer: 'the bill please' },
    ]},
    { id: 'a2-2', level: 'A2', title: 'Rutina diaria', icon: '🌅', xp: 25, steps: [
      { type: 'choice', prompt: '"Me levanto a las 7"', options: ['I sleep at 7','I wake up at 7','I eat at 7','I run at 7'], answer: 1 },
      { type: 'translate', prompt: 'Ordená: "She goes to work"', tokens: ['to','goes','She','work'], answer: [2,1,0,3] },
      { type: 'type', prompt: 'Traducí: "desayuno"', answer: 'breakfast' },
    ]},

    /* ---------------- B1 ---------------- */
    { id: 'b1-1', level: 'B1', title: 'Viajes', icon: '✈️', xp: 30, steps: [
      { type: 'choice', prompt: '"Perdí mi maleta"', options: ["I lost my suitcase",'I have my suitcase','My suitcase is red','Where is the airport'], answer: 0 },
      { type: 'translate', prompt: 'Ordená: "The flight has been delayed"', tokens: ['has','delayed','The','been','flight'], answer: [2,4,0,3,1] },
      { type: 'listen', prompt: 'Escuchá', speak: 'The gate closes in ten minutes', options: ['The gate closes in ten minutes','See you in the morning','Please turn off your phone'], answer: 0 },
    ]},
    { id: 'b1-2', level: 'B1', title: 'Opiniones', icon: '💭', xp: 30, steps: [
      { type: 'choice', prompt: '"Creo que tienes razón"', options: ["I think you are right","You are wrong",'I know everything','Tell me later'], answer: 0 },
      { type: 'type', prompt: 'Traducí: "En mi opinión"', answer: 'in my opinion' },
    ]},

    /* ---------------- B2 ---------------- */
    { id: 'b2-1', level: 'B2', title: 'Trabajo', icon: '💼', xp: 35, steps: [
      { type: 'choice', prompt: '"Tengo una entrevista mañana"', options: ["I have an interview tomorrow", 'I saw an interview today', 'The interview was fine'], answer: 0 },
      { type: 'translate', prompt: 'Ordená: "If I had time, I would help"', tokens: ['had','time,','If','I','would','I','help'], answer: [2,3,0,1,5,4,6] },
    ]},

    /* ---------------- C1 ---------------- */
    { id: 'c1-1', level: 'C1', title: 'Debate', icon: '⚖️', xp: 40, steps: [
      { type: 'choice', prompt: '"Habría preferido que me avisaran"', options: ['I would have preferred to be told','I prefer to tell','I told them yesterday'], answer: 0 },
      { type: 'type', prompt: 'Traducí: "por otro lado"', answer: 'on the other hand' },
    ]},

    /* ---------------- C2 ---------------- */
    { id: 'c2-1', level: 'C2', title: 'Matices', icon: '🎭', xp: 45, steps: [
      { type: 'choice', prompt: '"Es más fácil decirlo que hacerlo"', options: ["Easier said than done", "Speak now or later", "Better late than sorry"], answer: 0 },
      { type: 'type', prompt: 'Traducí: "de una vez por todas"', answer: 'once and for all' },
    ]},
  ];

  /* profesor y estudiante demo */
  const users = [
    { id: 'u_teach', email: 'profe@silveracademy.app', pass: '1234', name: 'Prof. Marta', role: 'teacher', avatar: '👩‍🏫', createdAt: now },
    { id: 'u_demo',  email: 'demo@silveracademy.app', pass: '1234', name: 'Vos', role: 'student', avatar: '🦊', createdAt: now, plan: 'free', streak: 3, xp: 240, gems: 15, hearts: 5, targetLevel: 'A1' },
    { id: 'u_maria', email: 'maria@silveracademy.app', pass: '1234', name: 'María', role: 'student', avatar: '🐼', createdAt: now, plan: 'plus', streak: 12, xp: 1240, gems: 80, hearts: 5, targetLevel: 'B1' },
    { id: 'u_leo',   email: 'leo@silveracademy.app',   pass: '1234', name: 'Leo',   role: 'student', avatar: '🐨', createdAt: now, plan: 'free', streak: 5, xp: 620, gems: 24, hearts: 4, targetLevel: 'A2' },
    { id: 'u_ana',   email: 'ana@silveracademy.app',   pass: '1234', name: 'Ana',   role: 'student', avatar: '🐧', createdAt: now, plan: 'premium', streak: 30, xp: 2860, gems: 220, hearts: 5, targetLevel: 'C1' },
  ];

  const plans = [
    { id: 'free',    name: 'Gratis',  price: 0,    period: 'siempre',
      perks: ['Todas las lecciones', 'Máx. 5 corazones', 'Con anuncios'], color: '#7A7A85' },
    { id: 'plus',    name: 'Plus',    price: 9.99, period: 'mes',
      perks: ['Sin anuncios', 'Corazones ilimitados', '2 clases 1-a-1 / mes'], highlight: true, color: '#3C3B6E' },
    { id: 'premium', name: 'Premium', price: 19.99,period: 'mes',
      perks: ['Todo lo de Plus', '8 clases 1-a-1 / mes', 'Certificado mensual', 'Prioridad en soporte'], color: '#B22234' },
  ];

  /* Slots del profesor (huecos abiertos para reserva).
     status: 'open' | 'booked'
     Vamos a generar unos huecos futuros automáticamente. */
  const slots = [];
  const today = new Date();
  for (let d = 1; d <= 14; d++) {
    const day = new Date(today);
    day.setDate(today.getDate() + d);
    day.setHours(0,0,0,0);
    // Sesiones lun a sáb (0=dom)
    if (day.getDay() === 0) continue;
    ['10:00','11:30','15:00','16:30','18:00'].forEach((h,i) => {
      const [hh,mm] = h.split(':').map(Number);
      const start = new Date(day); start.setHours(hh, mm, 0, 0);
      slots.push({
        id: 's_' + d + '_' + i,
        teacherId: 'u_teach',
        startISO: start.toISOString(),
        durationMin: 30,
        status: 'open',
        studentId: null,
        note: null,
      });
    });
  }

  return { LEVELS, lessons, users, plans, slots };
})();

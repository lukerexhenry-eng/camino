import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Flame, Star, Volume2, Mic, Check, Lock, ChevronRight, Trophy, ArrowLeft, Sparkles, Wand2, Loader2, Zap, Play, Link2, Film, ArrowRight, GraduationCap, Globe, BookOpen, X, Award, BarChart3, StickyNote, Trash2, Users, Square, ChevronDown, Headphones, FileText } from 'lucide-react';

const STORAGE_KEY = 'camino_progress_v1';
const loadSaved = () => { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; } };

const LIME = '#9FCB40';
const LIME_DK = '#6FA01E';
const CORAL = '#FF7A59';
const CREAM = '#FFF9F0';
const SKY = '#EAF4FF';
const INK = '#2A2A28';

const G = { hero: 'linear-gradient(160deg, #A8D55E 0%, #7FB22E 100%)', warm: 'linear-gradient(160deg, #FFB36B, #FF7A59)', dusk: 'linear-gradient(160deg, #7FB22E, #4F7A14)' };

const WORLDS = [
  { id: 'faith', name: 'Faith', es: 'Fe', emoji: '✝️', g1: '#A8D55E', g2: '#7FB22E', desc: 'Church & daily faith' },
  { id: 'family', name: 'Family', es: 'Familia', emoji: '👨‍👩‍👧', g1: '#FFB36B', g2: '#F2823C', desc: 'Family & love' },
  { id: 'food', name: 'Food', es: 'Comida', emoji: '🫓', g1: '#FF9FAF', g2: '#E8607A', desc: 'Colombian flavours' },
  { id: 'culture', name: 'Culture', es: 'Cultura', emoji: '🇨🇴', g1: '#86C9FF', g2: '#4FA3E0', desc: 'Slang & culture' },
  { id: 'career', name: 'Career', es: 'Trabajo', emoji: '💼', g1: '#C9A6FF', g2: '#9B6BE0', desc: 'Work & ambition' },
];

const FOUNDATIONS = [
  { id: 'fnd-1', n: 1, name: 'First Words', es: 'Primeras palabras', xp: 20, desc: 'Greet & be polite from minute one', cards: [
    { es: 'Hola', en: 'Hello', hook: '"OH-la" — the h is silent', note: '' }, { es: 'Buenos días', en: 'Good morning', hook: '"BWE-nos DEE-as"', note: 'Until midday' },
    { es: 'Buenas tardes', en: 'Good afternoon', hook: 'afternoon/evening', note: '' }, { es: 'Por favor', en: 'Please', hook: '"por fa-VOR"', note: 'Politeness opens doors' },
    { es: 'Gracias', en: 'Thank you', hook: 'like "gracious"', note: '' }, { es: 'De nada', en: "You're welcome", hook: '"of nothing"', note: '' }] },
  { id: 'fnd-2', n: 2, name: 'You & Me', es: 'Tú y yo', xp: 20, desc: 'The pronouns everything hangs on', cards: [
    { es: 'yo', en: 'I', hook: '"yo"', note: '' }, { es: 'tú', en: 'you (friendly)', hook: '"too"', note: 'For friends & family' },
    { es: 'usted', en: 'you (respectful)', hook: '"oo-STED"', note: 'Colombians use this a lot, even warmly' }, { es: 'él / ella', en: 'he / she', hook: '"el / EH-ya"', note: '' },
    { es: 'nosotros', en: 'we', hook: '"no-SO-tros"', note: '' }] },
  { id: 'fnd-3', n: 3, name: 'To Be (I am)', es: 'Ser', xp: 30, desc: 'The single most useful verb', cards: [
    { es: 'soy', en: 'I am', hook: '"soy" → Soy Luke', note: 'Permanent things: who you are' }, { es: 'eres', en: 'you are', hook: '"EH-res"', note: '' },
    { es: 'es', en: 'he/she/it is', hook: '"es"', note: '' }, { es: 'Soy de Londres', en: "I'm from London", hook: 'Soy + de + place', note: 'Your first real sentence!' },
    { es: 'somos', en: 'we are', hook: '"SO-mos"', note: '' }] },
  { id: 'fnd-4', n: 4, name: 'Feelings (I feel)', es: 'Estar', xp: 30, desc: 'The other "to be" — moods & places', cards: [
    { es: 'estoy', en: 'I am (right now)', hook: '"es-TOY"', note: 'Temporary: feelings & location' }, { es: 'estás', en: 'you are', hook: '"es-TAS"', note: '' },
    { es: '¿Cómo estás?', en: 'How are you?', hook: 'your everyday greeting', note: '' }, { es: 'Estoy bien', en: "I'm well", hook: '"es-TOY bee-EN"', note: '' },
    { es: 'Estoy cansado', en: "I'm tired", hook: 'cansado = tired', note: '' }] },
  { id: 'fnd-5', n: 5, name: 'Numbers 1–10', es: 'Números', xp: 20, desc: 'Count, prices, time', cards: [
    { es: 'uno, dos, tres', en: '1, 2, 3', hook: '"OO-no, dos, tres"', note: '' }, { es: 'cuatro, cinco', en: '4, 5', hook: '"KWA-tro, SEEN-co"', note: '' },
    { es: 'seis, siete', en: '6, 7', hook: '"saze, see-EH-te"', note: '' }, { es: 'ocho, nueve, diez', en: '8, 9, 10', hook: '"O-cho, NWE-ve, dee-ES"', note: '' }] },
  { id: 'fnd-6', n: 6, name: 'I Want', es: 'Querer', xp: 35, desc: 'Ask for anything', cards: [
    { es: 'quiero', en: 'I want', hook: '"kee-EH-ro"', note: 'Your power verb' }, { es: 'quieres', en: 'you want', hook: '"kee-EH-res"', note: '' },
    { es: 'Quiero un café', en: 'I want a coffee', hook: 'quiero + thing', note: 'Order anything!' }, { es: '¿Quieres...?', en: 'Do you want...?', hook: 'invite someone', note: '' },
    { es: 'No quiero', en: "I don't want", hook: 'No + verb', note: 'Negatives are easy!' }] },
  { id: 'fnd-7', n: 7, name: 'I Have', es: 'Tener', xp: 35, desc: 'Possession, age & needs', cards: [
    { es: 'tengo', en: 'I have', hook: '"TEN-go"', note: '' }, { es: 'tienes', en: 'you have', hook: '"tee-EH-nes"', note: '' },
    { es: 'Tengo 30 años', en: "I'm 30 years old", hook: 'lit. "I have 30 years"', note: 'Age uses tener!' }, { es: 'Tengo que...', en: 'I have to...', hook: 'tengo que + verb', note: 'Obligations' },
    { es: 'Tengo hambre', en: "I'm hungry", hook: '"I have hunger"', note: '' }] },
  { id: 'fnd-8', n: 8, name: 'I Go', es: 'Ir', xp: 35, desc: 'Movement & the easy future', cards: [
    { es: 'voy', en: "I go / I'm going", hook: '"voy"', note: '' }, { es: 'Voy a...', en: "I'm going to...", hook: 'voy a + verb = future!', note: 'The easy future' },
    { es: 'Voy a comer', en: "I'm going to eat", hook: 'voy a + comer', note: '' }, { es: '¿Vamos?', en: 'Shall we go?', hook: '"VA-mos"', note: 'Super common' },
    { es: 'vamos', en: "let's go", hook: '', note: '' }] },
  { id: 'fnd-9', n: 9, name: 'Asking Questions', es: 'Preguntas', xp: 30, desc: 'The question words', cards: [
    { es: '¿Qué?', en: 'What?', hook: '"keh"', note: '' }, { es: '¿Dónde?', en: 'Where?', hook: '"DON-de"', note: '' },
    { es: '¿Cuándo?', en: 'When?', hook: '"KWAN-do"', note: '' }, { es: '¿Cómo?', en: 'How?', hook: '"KO-mo"', note: '' },
    { es: '¿Por qué?', en: 'Why?', hook: '"por KEH"', note: '' }, { es: '¿Cuánto?', en: 'How much?', hook: '"KWAN-to"', note: '' }] },
  { id: 'fnd-10', n: 10, name: 'Joining Words', es: 'Conectores', xp: 30, desc: 'Glue your sentences together', cards: [
    { es: 'y', en: 'and', hook: '"ee"', note: '' }, { es: 'pero', en: 'but', hook: '"PEH-ro"', note: '' },
    { es: 'porque', en: 'because', hook: '"POR-keh"', note: '' }, { es: 'también', en: 'also / too', hook: '"tam-bee-EN"', note: '' },
    { es: 'muy', en: 'very', hook: '"mooy"', note: 'muy bien = very good' }, { es: 'un poco', en: 'a little', hook: '"oon PO-co"', note: '' }] },
  { id: 'fnd-11', n: 11, name: 'Doing Things', es: 'Verbos -ar', xp: 35, desc: 'Conjugate any -ar verb', cards: [
    { es: 'hablo', en: 'I speak', hook: '"AH-blo" — habl + o', note: '' }, { es: 'hablas', en: 'you speak', hook: '"AH-blas" — habl + as', note: '' },
    { es: 'habla', en: 'he/she speaks', hook: '"AH-bla" — habl + a', note: '' }, { es: 'trabajo', en: 'I work', hook: '"tra-BA-ho"', note: 'Same pattern as hablo!' },
    { es: 'Hablo español', en: 'I speak Spanish', hook: 'put it together', note: '' }] },
  { id: 'fnd-12', n: 12, name: 'More Verbs', es: 'Verbos -er/-ir', xp: 35, desc: 'The other two verb families', cards: [
    { es: 'como', en: 'I eat', hook: '"KO-mo" (comer)', note: '-er verb' }, { es: 'comes', en: 'you eat', hook: '"KO-mes"', note: '' },
    { es: 'vivo', en: 'I live', hook: '"VEE-vo" (vivir)', note: '-ir verb' }, { es: 'vives', en: 'you live', hook: '"VEE-ves"', note: '' },
    { es: 'Vivo en Londres', en: 'I live in London', hook: 'vivo + en + place', note: 'Your second real sentence!' }] },
  { id: 'fnd-13', n: 13, name: 'Days & Time', es: 'Días y la hora', xp: 30, desc: 'Plan anything', cards: [
    { es: 'lunes, martes', en: 'Monday, Tuesday', hook: '"LOO-nes, MAR-tes"', note: '' }, { es: 'miércoles, jueves', en: 'Wednesday, Thursday', hook: '"mee-ER-co-les, HWE-ves"', note: '' },
    { es: 'viernes, sábado, domingo', en: 'Friday, Saturday, Sunday', hook: '"vee-ER-nes, SA-ba-do, do-MEEN-go"', note: '' },
    { es: '¿Qué hora es?', en: 'What time is it?', hook: '"keh OR-ah es"', note: '' }, { es: 'Son las tres', en: "It's three o'clock", hook: 'son las + number', note: '' }] },
  { id: 'fnd-14', n: 14, name: 'Describing Things', es: 'Adjetivos', xp: 30, desc: 'Say what something is like', cards: [
    { es: 'bueno / buena', en: 'good', hook: '"BWE-no"', note: '-o for masc, -a for fem' }, { es: 'malo / mala', en: 'bad', hook: '"MAH-lo"', note: '' },
    { es: 'grande', en: 'big', hook: '"GRAN-de"', note: 'Same for both genders' }, { es: 'pequeño / pequeña', en: 'small', hook: '"peh-KEH-nyo"', note: '' },
    { es: 'bonito / bonita', en: 'pretty / nice', hook: '"bo-NEE-to"', note: '' }] },
  { id: 'fnd-15', n: 15, name: 'Colors', es: 'Colores', xp: 25, desc: 'Describe the world around you', cards: [
    { es: 'rojo, azul', en: 'red, blue', hook: '"RO-ho, ah-SOOL"', note: '' }, { es: 'verde, amarillo', en: 'green, yellow', hook: '"VER-de, ah-ma-REE-yo"', note: 'verde — like your brand!' },
    { es: 'negro, blanco', en: 'black, white', hook: '"NEH-gro, BLAN-co"', note: '' }, { es: 'café', en: 'brown', hook: 'literally "coffee"', note: '' }] },
  { id: 'fnd-16', n: 16, name: 'Yesterday', es: 'Ayer', xp: 35, desc: 'A gentle first taste of the past', cards: [
    { es: 'ayer', en: 'yesterday', hook: '"ah-YEHR"', note: '' }, { es: 'Fui a la iglesia', en: 'I went to church', hook: 'fui = went (irregular)', note: 'Common & useful' },
    { es: 'Comí arepa', en: 'I ate arepa', hook: 'comí = ate', note: '' }, { es: '¿Qué hiciste ayer?', en: 'What did you do yesterday?', hook: 'a great question to ask', note: '' }] },
];

const BRIDGE = [
  { id: 'bridge-tion', rule: '-tion → -ción', xp: 30, big: 'You know ~2,500 words',
    teach: 'Almost every English word ending in -tion becomes -ción. Same meaning. Just say "see-ON" at the end.',
    why: 'Both languages inherited this ending from Latin "-tio/-tionem". English kept it closer to French spelling; Spanish simplified the sound to "-ción". Same ancestor word, two descendants.',
    examples: [
      { en: 'information', es: 'información', enSeg: [{t:'informa',c:false},{t:'tion',c:true}], esSeg: [{t:'informa',c:false},{t:'ción',c:true}] },
      { en: 'education', es: 'educación', enSeg: [{t:'educa',c:false},{t:'tion',c:true}], esSeg: [{t:'educa',c:false},{t:'ción',c:true}] },
      { en: 'celebration', es: 'celebración', enSeg: [{t:'celebra',c:false},{t:'tion',c:true}], esSeg: [{t:'celebra',c:false},{t:'ción',c:true}] },
    ],
    deepDive: { pause: "Before I explain further — pause for a second. Why might English keep the 't' in '-tion', while Spanish writes 'ción' instead?",
      reveal: "It comes down to how 'ti' behaved next to a vowel back in Latin. Over centuries that 'ti' sound softened — French (which shaped a lot of English spelling) kept the old 't' on the page even though the sound had changed; Spanish spelling followed the new softened sound and wrote it as 'ción'. Same word, same sound-change — just captured differently in writing.",
      check: { en: 'population', es: 'población' } },
    quiz: [{ en: 'situation', es: 'situación' }, { en: 'conversation', es: 'conversación' }, { en: 'attention', es: 'atención' }] },
  { id: 'bridge-ant', rule: '-ant/-ent → -ante/-ente', xp: 30, big: 'Hundreds more, instantly',
    teach: 'English words ending in -ant or -ent usually just add an -e. Important → importante.',
    why: 'Spanish almost never ends a word in a hard consonant like "t" — it likes to "open" the sound with a final vowel. So English -ant/-ent picks up a closing -e in Spanish: same root, softer landing.',
    examples: [
      { en: 'important', es: 'importante', enSeg: [{t:'import',c:false},{t:'ant',c:false},{t:'',c:false}], esSeg: [{t:'import',c:false},{t:'ant',c:false},{t:'e',c:true}] },
      { en: 'different', es: 'diferente', enSeg: [{t:'differ',c:false},{t:'ent',c:false},{t:'',c:false}], esSeg: [{t:'difer',c:false},{t:'ent',c:false},{t:'e',c:true}] },
      { en: 'patient', es: 'paciente', enSeg: [{t:'pa',c:false},{t:'ti',c:true},{t:'ent',c:false},{t:'',c:false}], esSeg: [{t:'pa',c:false},{t:'ci',c:true},{t:'ent',c:false},{t:'e',c:true}] },
    ],
    deepDive: { pause: "Pause here — 'patient' has an extra change beyond just adding '-e'. Can you spot it before I point it out?",
      reveal: "Look at the middle: 'patient' has 'ti', but 'paciente' has 'ci'. That's the exact same Latin sound-softening from the -tion rule — it's just hiding inside the word this time instead of at the end. Once you notice it once, you'll start spotting it everywhere.",
      check: { en: 'efficient', es: 'eficiente' } },
    quiz: [{ en: 'restaurant', es: 'restaurante' }, { en: 'elephant', es: 'elefante' }, { en: 'president', es: 'presidente' }] },
  { id: 'bridge-ar', rule: 'The verb engine: -ar', xp: 40, big: 'Build sentences, not words',
    teach: 'Many English verbs become Spanish -ar verbs. Add "Quiero..." (I want to) and you can speak. Quiero visitar = I want to visit.',
    why: 'Spanish sorts almost all verbs into three families by their ending: -ar, -er, -ir. Once you can spot "-ar", you instantly know how the verb will behave in every tense — it is the single biggest unlock in the language.',
    examples: [
      { en: 'to visit', es: 'visitar', enSeg: [{t:'to ',c:false},{t:'visit',c:false},{t:'',c:false}], esSeg: [{t:'visit',c:false},{t:'ar',c:true}] },
      { en: 'to prepare', es: 'preparar', enSeg: [{t:'to ',c:false},{t:'prepar',c:false},{t:'e',c:false}], esSeg: [{t:'prepar',c:false},{t:'ar',c:true}] },
      { en: 'to celebrate', es: 'celebrar', enSeg: [{t:'to ',c:false},{t:'celebr',c:false},{t:'ate',c:false}], esSeg: [{t:'celebr',c:false},{t:'ar',c:true}] },
    ],
    deepDive: { pause: "Pause and have a guess — if 'visitar' means 'to visit', what do you think 'invitar' means, just from its shape?",
      reveal: "Exactly — 'invitar' means 'to invite'. The moment you trust the -ar pattern, you stop memorising verbs one at a time and start recognising a whole family at once. That's the real unlock here.",
      check: { en: 'to organize', es: 'organizar' } },
    quiz: [{ en: 'to invite', es: 'invitar' }, { en: 'to confirm', es: 'confirmar' }, { en: 'I want to prepare', es: 'Quiero preparar' }] },
  { id: 'bridge-ty', rule: '-ty → -dad', xp: 30, big: 'Hundreds of abstract words',
    teach: 'English words ending in -ty often become -dad in Spanish. University → universidad. City → ciudad.',
    why: 'Both come from the Latin ending "-tas/-tatem". English shortened it to "-ty"; Spanish kept more of the original sound as "-dad". Same Latin parent, two different children.',
    examples: [
      { en: 'university', es: 'universidad', enSeg: [{t:'universi',c:false},{t:'ty',c:true}], esSeg: [{t:'universi',c:false},{t:'dad',c:true}] },
      { en: 'city', es: 'ciudad', enSeg: [{t:'ci',c:false},{t:'ty',c:true}], esSeg: [{t:'ci',c:false},{t:'udad',c:true}] },
      { en: 'liberty', es: 'libertad', enSeg: [{t:'liber',c:false},{t:'ty',c:true}], esSeg: [{t:'liber',c:false},{t:'tad',c:true}] },
    ],
    deepDive: { pause: "Quick pause — 'liberty' becomes 'libertad'. So what do you think 'identity' becomes? Try it before reading on.",
      reveal: "If you guessed 'identidad' — that's it exactly. Notice what just happened: you weren't recalling a word you'd memorised, you were generating a new one from a pattern. That's the whole point of the Bridge.",
      check: { en: 'activity', es: 'actividad' } },
    quiz: [{ en: 'reality', es: 'realidad' }, { en: 'nationality', es: 'nacionalidad' }, { en: 'identity', es: 'identidad' }] },
  { id: 'bridge-ous', rule: '-ous → -oso/-osa', xp: 30, big: 'Describe anything vividly',
    teach: 'English adjectives ending in -ous often become -oso (masculine) or -osa (feminine) in Spanish. Famous → famoso. Curious → curioso.',
    why: 'Latin "-osus" meant "full of" — English borrowed it through French as "-ous", Spanish kept it almost untouched as "-oso/-osa". Spanish just stayed closer to the original.',
    examples: [
      { en: 'famous', es: 'famoso', enSeg: [{t:'fam',c:false},{t:'ous',c:true}], esSeg: [{t:'fam',c:false},{t:'oso',c:true}] },
      { en: 'curious', es: 'curioso', enSeg: [{t:'curi',c:false},{t:'ous',c:true}], esSeg: [{t:'curi',c:false},{t:'oso',c:true}] },
      { en: 'delicious', es: 'delicioso', enSeg: [{t:'delici',c:false},{t:'ous',c:true}], esSeg: [{t:'delici',c:false},{t:'oso',c:true}] },
    ],
    deepDive: { pause: "One more pause — 'famous' becomes 'famoso'. So what would 'dangerous' become? Have a guess before reading on.",
      reveal: "Good instinct if you guessed something close — but the real word is 'peligroso', and it doesn't even look like 'dangerous' in English at all! That's an important honest reminder: this pattern works beautifully most of the time, but not every word has a matching Latin root. Trust the pattern — and stay flexible when a word surprises you.",
      check: { en: 'numerous', es: 'numeroso' } },
    quiz: [{ en: 'nervous', es: 'nervioso' }, { en: 'generous', es: 'generoso' }, { en: 'religious', es: 'religioso' }] },
];

const DIALOGUES = [
  { id: 'dlg-meet', title: 'Meet someone', emoji: '👋', desc: 'A real first conversation, step by step', unlock: { lessons: 0, hours: 0 }, steps: [
    { from: 'them', es: '¡Hola! ¿Cómo te llamas?', en: "Hi! What's your name?" },
    { from: 'you', prompt: 'Introduce yourself', es: 'Me llamo Luke.', en: 'My name is Luke.' },
    { from: 'them', es: 'Mucho gusto, Luke. ¿Cómo estás?', en: 'Nice to meet you, Luke. How are you?' },
    { from: 'you', prompt: 'Say you are well', es: 'Estoy bien, gracias. ¿Y tú?', en: "I'm well, thanks. And you?" },
    { from: 'them', es: 'Muy bien también. ¿De dónde eres?', en: 'Very well too. Where are you from?' },
    { from: 'you', prompt: 'Say where you are from', es: 'Soy de Londres.', en: "I'm from London." },
    { from: 'them', es: '¡Qué bueno! Bienvenido.', en: "That's great! Welcome." },
  ]},
  { id: 'dlg-food', title: 'Order food', emoji: '🫓', desc: 'Practice ordering like a local', unlock: { lessons: 3, hours: 1 }, steps: [
    { from: 'them', es: 'Hola, bienvenido. ¿Qué va a pedir?', en: 'Hi, welcome. What will you have?' },
    { from: 'you', prompt: 'Say what you want', es: 'Quiero una arepa, por favor.', en: 'I want an arepa, please.' },
    { from: 'them', es: '¿Algo de tomar?', en: 'Something to drink?' },
    { from: 'you', prompt: 'Order a coffee', es: 'Un café, por favor.', en: 'A coffee, please.' },
    { from: 'them', es: 'Perfecto. ¿Algo más?', en: 'Perfect. Anything else?' },
    { from: 'you', prompt: "Say that's all", es: 'No, eso es todo, gracias.', en: "No, that's all, thanks." },
    { from: 'them', es: '¡Buen provecho!', en: 'Enjoy your meal!' },
  ]},
  { id: 'dlg-family', title: 'Talk about family', emoji: '👨‍👩‍👧', desc: 'Share who you are with', unlock: { lessons: 5, hours: 2 }, steps: [
    { from: 'them', es: '¿Tienes familia aquí?', en: 'Do you have family here?' },
    { from: 'you', prompt: 'Say you have a brother', es: 'Tengo un hermano.', en: 'I have a brother.' },
    { from: 'them', es: '¿Y tus padres?', en: 'And your parents?' },
    { from: 'you', prompt: 'Say where they live', es: 'Mis padres viven en Londres.', en: 'My parents live in London.' },
    { from: 'them', es: '¡Qué bueno! ¿Los ves seguido?', en: 'That\'s nice! Do you see them often?' },
    { from: 'you', prompt: 'Say yes, every Sunday', es: 'Sí, cada domingo.', en: 'Yes, every Sunday.' },
    { from: 'them', es: 'Eso es bonito.', en: "That's lovely." },
  ]},
  { id: 'dlg-job', title: 'Talk about your work', emoji: '💼', desc: 'Explain your career change', unlock: { lessons: 8, hours: 4 }, steps: [
    { from: 'them', es: '¿En qué trabajas?', en: 'What do you do for work?' },
    { from: 'you', prompt: 'Say you are learning plumbing', es: 'Estoy aprendiendo plomería.', en: "I'm learning plumbing." },
    { from: 'them', es: '¿Por qué cambiaste de carrera?', en: 'Why did you change careers?' },
    { from: 'you', prompt: 'Say you wanted something new', es: 'Quería algo nuevo.', en: 'I wanted something new.' },
    { from: 'them', es: '¡Qué valiente! Te va a ir bien.', en: "That's brave! You'll do well." },
    { from: 'you', prompt: 'Thank them', es: 'Gracias, eso espero.', en: 'Thanks, I hope so.' },
    { from: 'them', es: '¡Seguro que sí!', en: 'For sure!' },
  ]},
];

const VIDEO_TIERS = [
  { minLevel: 1, tier: 'Superbeginner', emoji: '🌱', desc: 'Slow, clear, with drawings. From zero.', url: 'https://app.dreaming.com/spanish/browse?level=superbeginner' },
  { minLevel: 3, tier: 'Beginner', emoji: '🌿', desc: 'Slightly faster, still gentle.', url: 'https://app.dreaming.com/spanish/browse?level=beginner' },
  { minLevel: 6, tier: 'Intermediate', emoji: '🌳', desc: 'Real conversations. Your stretch.', url: 'https://app.dreaming.com/spanish/browse?level=intermediate' },
];

const COLOMBIA_DATES = {
  '1-1': "It's New Year's Day — ask what traditions their family follows (many Colombians eat grapes at midnight for luck!).",
  '7-20': "It's Colombian Independence Day 🇨🇴 — ask how their family celebrates it.",
  '8-7': "It's Battle of Boyacá day — ask if they learned about it in school growing up.",
  '12-7': "It's Día de las Velitas — ask if their family still lights candles tonight.",
  '12-25': "It's Navidad — ask what Christmas looks like in their hometown.",
};
const WORLD_SUGGESTIONS = {
  faith: ["Ask if their family has a saint or tradition they celebrate every year.", "Ask what role faith plays in a typical Colombian Christmas.", "Ask what 'Dios te bendiga' means to them personally."],
  family: ["Ask where in Colombia their grandparents are from.", "Ask what a typical Sunday looks like with their family.", "Ask if they have a favourite family nickname (apodo)."],
  food: ["Ask them to teach you how to make arepas properly.", "Ask what dish reminds them most of home.", "Ask how food differs between the coast and the Andes in Colombia."],
  culture: ["Ask them to teach you one slang word only their region uses.", "Ask what 'parce' really means to them, beyond the dictionary.", "Ask about a local celebration from their hometown you've never heard of."],
  career: ["Ask what work culture is like in Colombia compared to here.", "Ask if they have any advice for learning a trade like plumbing."],
};
const GENERAL_SUGGESTIONS = [
  "Ask them what song instantly makes them think of home.",
  "Ask them to send you a voice note saying something in their accent.",
  "Ask what they miss most about Colombia.",
  "Ask them about Feria de las Flores — Medellín's flower festival.",
  "Ask if they've ever danced cumbia, and get them to show you a step.",
  "Ask what 'tinto' means and why Colombians drink so much of it.",
  "Ask them to correct your pronunciation on one word, out loud.",
  "Ask what their hometown is famous for.",
];

const REVIEW_INTERVALS = [1, 1, 2, 4, 8, 16];

// Five genuinely different textures, one per Bridge card — not just a colour swap.
const BRIDGE_PATTERNS = [
  { backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 2px, transparent 2px, transparent 11px)' },
  { backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 1.4px, transparent 1.6px)', backgroundSize: '9px 9px' },
  { backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1.5px, transparent 1.5px, transparent 9px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1.5px, transparent 1.5px, transparent 9px)' },
  { backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 2px, transparent 2px, transparent 12px)' },
  { backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 2px, transparent 2.2px)', backgroundSize: '15px 15px' },
];

const BASE_CURRICULUM = {
  faith: [
    { id: 'faith-1', name: 'Words of Faith', es: 'Palabras de fe', xp: 20, cards: [
      { es: 'Dios', en: 'God', hook: '"Dee-ohs"', note: 'The foundation' }, { es: 'Gracias a Dios', en: 'Thank God', hook: '"Gracias" = thanks', note: 'Heard constantly' },
      { es: 'la iglesia', en: 'the church', hook: 'think "ecclesia"', note: '' }, { es: 'la oración', en: 'the prayer', hook: 'like "oration"', note: '' }, { es: 'Amén', en: 'Amen', hook: 'Almost identical', note: 'Easy win!' }] },
    { id: 'faith-2', name: 'At Church', es: 'En la iglesia', xp: 25, cards: [
      { es: 'la fe', en: 'the faith', hook: 'like "faith" trimmed', note: '' }, { es: 'rezar', en: 'to pray', hook: '"reh-SAR"', note: '' },
      { es: 'la bendición', en: 'the blessing', hook: 'hear "benediction"', note: '' }, { es: 'Que Dios te bendiga', en: 'May God bless you', hook: '"That God blesses you"', note: 'Beautiful' }] },
    { id: 'faith-3', name: 'Gratitude & Worship', es: 'Gratitud y adoración', xp: 25, cards: [
      { es: 'alabar', en: 'to praise', hook: '"ah-lah-BAR"', note: '' }, { es: 'el cielo', en: 'heaven / the sky', hook: '"see-EH-lo"', note: '' },
      { es: 'el espíritu', en: 'the spirit', hook: 'like "spirit"', note: '' }, { es: 'Dios te ama', en: 'God loves you', hook: 'te ama = loves you', note: 'A beautiful truth' }] },
  ],
  family: [
    { id: 'family-1', name: 'My Family', es: 'Mi familia', xp: 20, cards: [
      { es: 'la familia', en: 'the family', hook: 'Almost the same', note: 'Easy win!' }, { es: 'mamá', en: 'mom', hook: 'Like English', note: '' },
      { es: 'papá', en: 'dad', hook: 'Like English', note: '' }, { es: 'el hermano', en: 'brother', hook: '"er-MAH-no"', note: '' }, { es: 'la hermana', en: 'sister', hook: '-a = female', note: '' }] },
    { id: 'family-2', name: 'Love', es: 'El amor', xp: 25, cards: [
      { es: 'el amor', en: 'love', hook: 'think "amorous"', note: '' }, { es: 'la novia', en: 'girlfriend', hook: '"NOH-vee-ah"', note: '' },
      { es: 'te quiero', en: 'I love you', hook: '"I want you" → love', note: 'For family & partners' }, { es: 'mi amor', en: 'my love', hook: '"mee ah-MOR"', note: 'Affection' }] },
    { id: 'family-3', name: 'Extended Family', es: 'Familia extendida', xp: 25, cards: [
      { es: 'el abuelo', en: 'grandfather', hook: '"ah-BWE-lo"', note: '' }, { es: 'la abuela', en: 'grandmother', hook: '"ah-BWE-la"', note: '' },
      { es: 'el tío / la tía', en: 'uncle / aunt', hook: '"TEE-o / TEE-ah"', note: '' }, { es: 'el primo / la prima', en: 'cousin', hook: '"PREE-mo"', note: '' }] },
  ],
  food: [
    { id: 'food-1', name: 'At the Restaurant', es: 'En el restaurante', xp: 20, cards: [
      { es: 'la comida', en: 'the food', hook: '"co-MEE-da"', note: '' }, { es: 'el agua', en: 'the water', hook: 'think "aqua"', note: '' },
      { es: 'Quiero...', en: 'I want...', hook: '"kee-EH-ro"', note: 'Power phrase' }, { es: 'la cuenta', en: 'the bill', hook: 'think "count"', note: '' }, { es: '¡Buen provecho!', en: 'Enjoy your meal!', hook: 'before eating', note: '' }] },
    { id: 'food-2', name: 'Flavours of Colombia', es: 'Sabores de Colombia', xp: 25, cards: [
      { es: 'la arepa', en: 'arepa', hook: 'a corn cake', note: 'Colombian staple!' }, { es: 'el café', en: 'the coffee', hook: 'like "cafe"', note: 'Colombia runs on it' },
      { es: 'delicioso', en: 'delicious', hook: 'Almost the same', note: '' }, { es: 'Tengo hambre', en: "I'm hungry", hook: '"I have hunger"', note: '' }] },
    { id: 'food-3', name: 'Ordering Like a Local', es: 'Pedir como un local', xp: 25, cards: [
      { es: '¿Qué me recomienda?', en: 'What do you recommend?', hook: 'recomienda = recommend', note: 'Sounds confident' }, { es: 'Para mí...', en: 'For me...', hook: 'order phrase', note: '' },
      { es: 'sin...', en: 'without...', hook: '"seen" — sin cebolla = without onion', note: '' }, { es: '¡Qué rico!', en: 'How tasty!', hook: 'a very common compliment', note: 'Use this constantly' }] },
  ],
  culture: [
    { id: 'culture-1', name: 'Colombian Slang', es: 'Jerga colombiana', xp: 30, cards: [
      { es: 'parce', en: 'buddy / mate', hook: 'short for "parcero"', note: 'Most Colombian word' }, { es: 'bacano', en: 'cool / awesome', hook: '"ba-CAH-no"', note: '' },
      { es: '¡Qué chimba!', en: 'How awesome!', hook: 'very casual', note: 'Friends only' }, { es: 'chévere', en: 'cool / great', hook: '"CHEH-veh-reh"', note: '' }, { es: '¿Todo bien?', en: 'All good?', hook: '"all well?"', note: '' }] },
    { id: 'culture-2', name: 'Everyday Expressions', es: 'Expresiones del día a día', xp: 30, cards: [
      { es: '¡Dale!', en: 'Go for it! / Sure!', hook: '"DAH-leh" — used constantly', note: 'Used everywhere in Colombia' }, { es: 'no más', en: 'just / only', hook: 'softens a request', note: 'Regáleme uno no más' },
      { es: '¡Eso!', en: "That's it! / Exactly!", hook: '"EH-so"', note: '' }, { es: '¿Qué más?', en: "What's up?", hook: 'a common greeting', note: '' }] },
  ],
  career: [
    { id: 'career-1', name: 'My Work', es: 'Mi trabajo', xp: 20, cards: [
      { es: 'el trabajo', en: 'the work / job', hook: '"tra-BA-ho"', note: '' }, { es: 'trabajar', en: 'to work', hook: 'verb of trabajo', note: '' },
      { es: 'Soy diseñador', en: "I'm a designer", hook: '"Soy" = I am', note: 'Your background!' }, { es: 'la carrera', en: 'the career', hook: 'Almost the same', note: '' }] },
    { id: 'career-2', name: 'Talking About Your Job', es: 'Hablando de tu trabajo', xp: 25, cards: [
      { es: 'la entrevista', en: 'the interview', hook: 'like "interview"', note: '' }, { es: 'el jefe / la jefa', en: 'the boss', hook: '"HEH-feh"', note: '' },
      { es: 'Estoy aprendiendo plomería', en: "I'm learning plumbing", hook: 'aprendiendo = learning', note: 'Your real journey!' }, { es: 'el oficio', en: 'the trade / craft', hook: '"o-FEE-see-o"', note: '' }] },
  ],
};

const EXAM = { title: 'Checkpoint 1', passMark: 3, questions: [
  { prompt: 'How do you say "the family"?', answer: 'la familia', options: ['la familia', 'el trabajo', 'la comida'] },
  { prompt: 'What does "Tengo hambre" mean?', answer: "I'm hungry", options: ["I'm tired", "I'm hungry", "I'm happy"] },
  { prompt: 'Say "I want..." in Spanish', answer: 'Quiero', speak: true },
  { prompt: 'How do you say "thank God"?', answer: 'Gracias a Dios', options: ['Buen provecho', 'Gracias a Dios', 'Mi amor'] },
  { prompt: 'Say "the coffee" in Spanish', answer: 'el café', speak: true },
]};

// ===== Grammar Glue — the small connecting words that hold sentences together =====
const GLUE_CATEGORIES = [
  { title: 'Subject pronouns', es: 'Pronombres', emoji: '🙋',
    note: 'In Bogotá these are often dropped — the verb ending already tells you who. "Hablo español" already means "I speak Spanish" without needing "yo."',
    items: [
      { term: 'yo', meaning: 'I' }, { term: 'tú', meaning: 'you (friendly)' },
      { term: 'usted', meaning: 'you (respectful — used warmly in Colombia, not just formally)' },
      { term: 'él', meaning: 'he' }, { term: 'ella', meaning: 'she' },
      { term: 'nosotros', meaning: 'we' }, { term: 'ellos', meaning: 'they (masc./mixed)' }, { term: 'ellas', meaning: 'they (fem.)' },
    ] },
  { title: 'My / your / their', es: 'Posesivos', emoji: '🏠',
    note: 'These change with the noun they describe, not with how much you mean it. "mis" because the next word is plural — not "more mine."',
    items: [
      { term: 'mi', meaning: 'my (before a singular noun)' }, { term: 'mis', meaning: 'my (before a plural noun)' },
      { term: 'tu', meaning: 'your (singular noun)' }, { term: 'tus', meaning: 'your (plural noun)' },
      { term: 'su', meaning: "his / her / their / your (formal) — singular noun" }, { term: 'sus', meaning: "his / her / their / your (formal) — plural noun" },
    ] },
  { title: 'Me / you / it', es: 'Objetos', emoji: '👉',
    note: 'These usually come before the verb — the opposite order from English. "Lo veo" = "I see it," not "It I see."',
    items: [
      { term: 'me', meaning: 'me / to me' }, { term: 'te', meaning: 'you / to you' },
      { term: 'lo', meaning: 'it / him (direct object)' }, { term: 'la', meaning: 'it / her (direct object)' },
      { term: 'le', meaning: 'to him / to her / to you (indirect object)' },
    ] },
  { title: 'Little connectors', es: 'Conectores', emoji: '🔗', note: 'Tiny words, huge job — they\'re what makes vocab sound like a real sentence.',
    items: [
      { term: 'y', meaning: 'and' }, { term: 'pero', meaning: 'but' }, { term: 'porque', meaning: 'because' },
      { term: 'entonces', meaning: 'so / then' }, { term: 'también', meaning: 'also / too' },
    ] },
  { title: 'A / with / without', es: 'Preposiciones', emoji: '📍', note: '',
    items: [
      { term: 'para', meaning: 'for / in order to' }, { term: 'con', meaning: 'with' }, { term: 'sin', meaning: 'without' },
      { term: 'de', meaning: 'of / from' }, { term: 'en', meaning: 'in / on / at' }, { term: 'a', meaning: 'to / at' },
    ] },
  { title: 'Ser vs estar — both mean "to be"', es: 'Ser y estar', emoji: '🌀',
    note: 'ser = what something IS (permanent — identity, origin). estar = how something is RIGHT NOW (temporary — mood, location).',
    items: [
      { term: 'soy', meaning: '(ser) I am — permanent: "Soy de Londres"' }, { term: 'eres', meaning: '(ser) you are — permanent' },
      { term: 'es', meaning: '(ser) he/she/it is — permanent' },
      { term: 'estoy', meaning: '(estar) I am — right now: "Estoy bien"' }, { term: 'estás', meaning: '(estar) you are — right now' },
      { term: 'está', meaning: '(estar) he/she/it is — right now' },
    ] },
  { title: 'The, a', es: 'Artículos', emoji: '📖', note: 'Spanish nouns are masculine or feminine, and the article has to match.',
    items: [
      { term: 'el', meaning: 'the (masc.)' }, { term: 'la', meaning: 'the (fem.)' },
      { term: 'los', meaning: 'the, plural (masc.)' }, { term: 'las', meaning: 'the, plural (fem.)' },
      { term: 'un', meaning: 'a / an (masc.)' }, { term: 'una', meaning: 'a / an (fem.)' },
    ] },
  { title: 'Power verbs', es: 'Verbos clave', emoji: '⚡', note: 'Three verbs that unlock most everyday sentences.',
    items: [
      { term: 'tengo', meaning: 'I have' }, { term: 'tienes', meaning: 'you have' },
      { term: 'quiero', meaning: 'I want' }, { term: 'quieres', meaning: 'you want' },
      { term: 'puedo', meaning: 'I can' }, { term: 'puedes', meaning: 'you can' },
    ] },
  { title: 'When little words fuse together', es: 'Contracciones', emoji: '🧷',
    note: 'Spanish has exactly two real contractions — and a couple of fixed "with me/you" forms. Tap any one below.',
    items: [
      { term: 'al', meaning: 'a + el (to the) — the only two contractions in Spanish are al and del' },
      { term: 'del', meaning: 'de + el (of/from the)' },
      { term: 'conmigo', meaning: 'con + mí (with me) — irregular fixed form, not "con mí"' },
      { term: 'contigo', meaning: 'con + ti (with you) — irregular fixed form, not "con tú"' },
    ],
    extra: 'There\'s a third pattern worth knowing, but it can\'t be reliably tagged word-by-word here: pronouns glue onto the end of infinitives, gerunds, and commands — decir + lo → decirlo ("to say it"), dar + me + lo → dármelo ("give it to me"), di + lo → dilo ("say it"). The ending looks like an ordinary word, so spotting it depends on context, not the letters alone.' },
];
const GLUE_LOOKUP = {};
GLUE_CATEGORIES.forEach(cat => { cat.items.forEach(item => { const key = item.term.toLowerCase(); if (!GLUE_LOOKUP[key]) GLUE_LOOKUP[key] = { meaning: item.meaning, category: cat.title }; }); });
const stripPunct = (w) => w.replace(/^[¿¡"'(]+|[?!"'.,;:)]+$/g, '');

const CamiFace = ({ mood, s }) => {
  const cheer = mood === 'cheer' || mood === 'proud'; const think = mood === 'think'; const listen = mood === 'listen';
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <defs><radialGradient id="empanadaGrad" cx="35%" cy="25%" r="80%"><stop offset="0%" stopColor="#F0C36A" /><stop offset="60%" stopColor="#D89A3E" /><stop offset="100%" stopColor="#A8651F" /></radialGradient></defs>
      <ellipse cx="17" cy="64" rx="5.5" ry="9" fill="url(#empanadaGrad)" transform="rotate(25 17 64)" />
      <ellipse cx="83" cy="64" rx="5.5" ry="9" fill="url(#empanadaGrad)" transform="rotate(-25 83 64)" />
      <path d="M16 72 Q14 28 50 17 Q86 28 84 72 Q84 80 74 80 L26 80 Q16 80 16 72 Z" fill="url(#empanadaGrad)" />
      <path d="M21 34 Q26 27 31 34 Q36 27 41 34 Q46 27 51 34 Q56 27 61 34 Q66 27 71 34 Q76 27 79 33" stroke="#A8651F" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="38" cy="32" rx="11" ry="7" fill="#fff" opacity="0.22" />
      <rect x="27" y="44" width="17" height="12" rx="5.5" fill="#1A1310" />
      <rect x="56" y="44" width="17" height="12" rx="5.5" fill="#1A1310" />
      <rect x="44" y="47" width="12" height="3" rx="1.5" fill="#1A1310" />
      <path d="M30 47 L36 52" stroke="#fff" strokeWidth="1.6" opacity="0.4" strokeLinecap="round" />
      <path d="M59 47 L65 52" stroke="#fff" strokeWidth="1.6" opacity="0.4" strokeLinecap="round" />
      {cheer ? <path d="M34 66 Q50 79 66 66 Q50 72 34 66 Z" fill="#5A3010" />
        : think ? <path d="M37 66 Q48 64 60 69" stroke="#5A3010" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        : listen ? <ellipse cx="50" cy="67" rx="3.2" ry="3.8" fill="#5A3010" />
        : <path d="M36 66 Q50 73 64 66" stroke="#5A3010" strokeWidth="2.8" fill="none" strokeLinecap="round" />}
    </svg>
  );
};
// Real artwork, with a guaranteed-safe fallback to the SVG empanada if a file isn't there yet or fails to load.
const CAMI_IMAGES = {
  happy: '/cami/happy.jpg',
  wave: '/cami/wave.jpg',
  listen: '/cami/listen.jpg',
  cheer: '/cami/cheer.jpg',
  proud: '/cami/proud.jpg',
  think: '/cami/think.jpg',
};
const Camilo = ({ mood = 'happy', size = 96 }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const imgSrc = CAMI_IMAGES[mood];
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `linear-gradient(135deg, ${LIME}, ${LIME_DK})`, padding: size * 0.06 }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#FFFDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {imgSrc && !imgFailed ? (
            <img src={imgSrc} alt="" onError={() => setImgFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <CamiFace mood={mood} s={size * 0.92} />
          )}
        </div>
      </div>
    </div>
  );
};
const camiSay = { greetNew: "¡Hola! I'm Camilo. We'll do this together — un paso a la vez.", greetBack: "¡Qué bueno verte! Ready when you are.", correct: ["¡Eso es! 🎉", "¡Perfecto!", "¡Muy bien!", "¡Eso, eso!"], close: "¡Casi! So close — try once more.", encourage: "Tranquilo — we'll get it. Try again." };

const Keyframes = () => (<style>{`
  @keyframes glowPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(159,203,64,0); transform: scale(1); } 50% { box-shadow: 0 0 0 8px rgba(159,203,64,0.25); transform: scale(1.04); } }
  @keyframes countUp { 0% { transform: scale(1); } 40% { transform: scale(1.4); } 100% { transform: scale(1); } }
  @keyframes cardRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes badgeBurst { 0% { transform: scale(0) rotate(-10deg); opacity: 0; } 55% { transform: scale(1.15); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
  @keyframes recPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes typingDot { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
  @keyframes solidify { 0% { transform: scale(1); } 35% { transform: scale(1.18); } 100% { transform: scale(1); } }
  .anim-solidify { animation: solidify 0.5s ease-out; }
  .anim-glow { animation: glowPulse 1.4s ease-in-out 2; } .anim-count { animation: countUp 0.7s ease-out; } .anim-card-rise { animation: cardRise 0.4s ease-out both; } .anim-badge { animation: badgeBurst 0.6s cubic-bezier(.34,1.56,.64,1) both; } .anim-rec { animation: recPulse 1s ease-in-out infinite; }
  .flip-card { perspective: 800px; background: transparent; border: none; padding: 0; }
  .flip-inner { position: relative; width: 100%; height: 100%; min-height: 64px; transition: transform 0.45s; transform-style: preserve-3d; }
  .flip-inner.is-flipped { transform: rotateY(180deg); }
  .flip-face { position: absolute; inset: 0; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; }
  .flip-face.flip-back { transform: rotateY(180deg); }
  .swipe-row { display: flex; gap: 10px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 4px; }
  .swipe-row::-webkit-scrollbar { display: none; }
  .swipe-card { scroll-snap-align: start; flex: 0 0 auto; }
  .glue-pager { scrollbar-width: none; }
  .glue-pager::-webkit-scrollbar { display: none; }
`}</style>);

const PageArc = ({ base = CREAM, circle = LIME }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', inset: 0, background: base }} />
    <div style={{ position: 'absolute', left: '50%', top: '55%', width: 700, height: 700, marginLeft: -350, borderRadius: '50%', background: circle, opacity: 0.1 }} />
  </div>
);

const SegWord = ({ segs, color }) => (<span>{segs.map((s, i) => <span key={i} style={{ color: s.c ? color : INK, fontWeight: s.c ? 900 : 700 }}>{s.t}</span>)}</span>);

// Renders a Spanish phrase with any "glue" words (mi, tus, le, porque...) tappable for a one-line why-explanation.
const TappableEs = ({ text, sentenceKey, activeKey, onTap, color }) => {
  const words = text.split(' ');
  return (
    <span>
      {words.map((w, i) => {
        const key = `${sentenceKey}-${i}`;
        const clean = stripPunct(w).toLowerCase();
        const entry = GLUE_LOOKUP[clean];
        const isActive = activeKey === key;
        return (
          <React.Fragment key={key}>
            {entry ? (
              <span
                onClick={(e) => { e.stopPropagation(); onTap(isActive ? null : { key, word: w, ...entry }); }}
                style={{ textDecoration: 'underline dotted', textDecorationColor: isActive ? CORAL : (color || '#C2B8A8'), textUnderlineOffset: 3, cursor: 'pointer' }}
              >{w}</span>
            ) : w}
            {i < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      })}
    </span>
  );
};
const GlueExplain = ({ active }) => active ? (
  <div className="rounded-xl px-3 py-2 mt-1.5 anim-card-rise" style={{ background: '#FFF3D6', border: '1px solid #E5B84B' }}>
    <span className="text-sm font-black" style={{ color: '#8A6A1E' }}>{active.word}</span>
    <span className="text-sm ml-1" style={{ color: '#6E5A2E' }}>— {active.meaning}</span>
  </div>
) : null;

const RecordPlayback = ({ recordedUrl, onPlay }) => (
  recordedUrl ? (
    <button onClick={onPlay} className="w-full mt-2 rounded-xl py-2.5 flex items-center justify-center gap-2 text-base font-bold transition-all active:scale-[0.98]" style={{ background: '#fff', border: '1px solid #EFE6D8', color: INK }}>
      <Play size={14} /> Hear yourself say it
    </button>
  ) : null
);

export default function Camino() {
  const saved = loadSaved();
  const [tab, setTab] = useState('learn');
  const [view, setView] = useState('tabs');
  const [activeWorld, setActiveWorld] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [phase, setPhase] = useState('see');
  const [sessionXp, setSessionXp] = useState(0);
  const [nextSuggestion, setNextSuggestion] = useState(null);

  const [activeBridge, setActiveBridge] = useState(null);
  const [bridgeStage, setBridgeStage] = useState('teach');
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [bdRevealed, setBdRevealed] = useState(false);
  const [bdCheckRevealed, setBdCheckRevealed] = useState(false);

  const [activeDialogue, setActiveDialogue] = useState(null);
  const [dlgIdx, setDlgIdx] = useState(0);
  const [dlgRevealed, setDlgRevealed] = useState(false);
  const [revealedEn, setRevealedEn] = useState({});
  const [glueActive, setGlueActive] = useState(null);
  const [glueIdx, setGlueIdx] = useState(0);
  const glueScrollRef = useRef(null);
  const [themTyping, setThemTyping] = useState(false);
  const threadEndRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState('');
  const [matchResult, setMatchResult] = useState(null);

  const [recordedUrl, setRecordedUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioCtxRef = useRef(null);
  const sessionStartRef = useRef(Date.now());

  const [customLessons, setCustomLessons] = useState(saved.customLessons || []);
  const [createInput, setCreateInput] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createListening, setCreateListening] = useState(false);
  const [correctedFrom, setCorrectedFrom] = useState(null);

  const [notes, setNotes] = useState(saved.notes || []);
  const [noteInput, setNoteInput] = useState('');
  const [noteListening, setNoteListening] = useState(false);

  const [links, setLinks] = useState(saved.links || []);
  const [linkInput, setLinkInput] = useState('');

  const [convoDate, setConvoDate] = useState(saved.convoDate || null);
  const [convoName, setConvoName] = useState(saved.convoName || '');
  const [showConvoModal, setShowConvoModal] = useState(false);
  const [examIdx, setExamIdx] = useState(0);
  const [examScore, setExamScore] = useState(0);
  const [examAnswered, setExamAnswered] = useState(null);
  const [examPassed, setExamPassed] = useState(false);
  const [certificates, setCertificates] = useState(saved.certificates || []);

  const [stats, setStats] = useState(saved.stats || { xp: 0, streak: 0, completedLessons: [], level: 1 });
  const [fndExpanded, setFndExpanded] = useState(false);

  // Repaso — spaced, interleaved review with three faces: flashcard, memory match, quick tap.
  const [reviewItems, setReviewItems] = useState(saved.reviewItems || []);
  const [reviewMode, setReviewMode] = useState('flashcard');
  const [reviewQueue, setReviewQueue] = useState([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewRevealed, setReviewRevealed] = useState(false);
  const [tapQueue, setTapQueue] = useState([]);
  const [tapAnswered, setTapAnswered] = useState(null);
  const [matchItems, setMatchItems] = useState([]);
  const [matchCards, setMatchCards] = useState([]);
  const [matchFirst, setMatchFirst] = useState(null);
  const [matchBusy, setMatchBusy] = useState(false);

  // Real input-hours tracking — self-logged from Watch & Absorb, feeds the progress chart.
  const [inputMinutes, setInputMinutes] = useState(saved.inputMinutes || 0);
  const [inputLog, setInputLog] = useState(saved.inputLog || []);
  const [justLogged, setJustLogged] = useState(null);
  const [uiLang, setUiLang] = useState(saved.uiLang || 'en');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ stats, certificates, notes, links, convoDate, convoName, customLessons, reviewItems, inputMinutes, inputLog, uiLang })); } catch (e) {}
  }, [stats, certificates, notes, links, convoDate, convoName, customLessons, reviewItems, inputMinutes, inputLog, uiLang]);

  const [progressBarsReady, setProgressBarsReady] = useState(false);
  useEffect(() => {
    if (view === 'progress') { setProgressBarsReady(false); const t = setTimeout(() => setProgressBarsReady(true), 60); return () => clearTimeout(t); }
  }, [view]);

  useEffect(() => { threadEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [dlgIdx, dlgRevealed, themTyping]);

  const levelFromXp = (xp) => Math.floor(xp / 100) + 1;
  const xpInLevel = (xp) => xp % 100;
  const daysUntil = (iso) => { if (!iso) return null; return Math.round((new Date(iso).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86400000); };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const speak = (text) => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'es-CO'; u.rate = 0.8; window.speechSynthesis.speak(u); } };
  const speakEn = (text) => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-GB'; u.rate = 0.95; window.speechSynthesis.speak(u); } };

  // Tiny synthesized sound effects — no external audio files, so nothing to license or host.
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtxRef.current = new AC();
    }
    return audioCtxRef.current;
  };
  const playTone = (ctx, freq, startTime, duration, gainPeak = 0.16) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq;
    osc.connect(gain); gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.start(startTime); osc.stop(startTime + duration + 0.02);
  };
  const playCorrectSound = () => {
    const ctx = getAudioCtx(); if (!ctx) return;
    const now = ctx.currentTime;
    playTone(ctx, 587.33, now, 0.14);        // D5
    playTone(ctx, 880.00, now + 0.09, 0.18); // A5 — quick cheerful two-note rise
  };
  const playIncorrectSound = () => {
    const ctx = getAudioCtx(); if (!ctx) return;
    playTone(ctx, 220, ctx.currentTime, 0.22, 0.11); // single soft low tone — gentle, not a buzzer
  };

  const lev = (a, b) => { const m = [...Array(a.length + 1)].map((_, i) => [i, ...Array(b.length).fill(0)]); for (let j = 0; j <= b.length; j++) m[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i-1][j]+1, m[i][j-1]+1, m[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1)); return m[a.length][b.length]; };

  const startBackgroundRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => { const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' }); setRecordedUrl(URL.createObjectURL(blob)); stream.getTracks().forEach(t => t.stop()); };
      mediaRecorderRef.current = mr; mr.start();
    } catch (e) { /* mic permission denied or unsupported — speech recognition can still proceed without it */ }
  };
  const stopBackgroundRecording = () => { if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop(); };

  const listen = (target, cb) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setHeard('Mic not available — use "Can\'t use the mic?" below'); setMatchResult('try'); return; }
    const rec = new SR(); rec.lang = 'es-CO'; rec.interimResults = false; rec.maxAlternatives = 3;
    setListening(true); setHeard(''); setMatchResult(null); setRecordedUrl(null);
    startBackgroundRecording();
    rec.onresult = (e) => {
      const said = e.results[0][0].transcript; setHeard(said);
      const norm = (s) => s.toLowerCase().replace(/[^a-záéíóúñü ]/g, '').trim();
      const a = norm(said), b = norm(target);
      const ok = a === b || lev(a, b) <= 1; const close = a.includes(b) || b.includes(a) || lev(a, b) <= 3;
      const result = ok ? 'good' : close ? 'close' : 'try';
      setMatchResult(result);
      if (result === 'try') playIncorrectSound(); else playCorrectSound();
      cb && cb(ok || close);
    };
    rec.onerror = () => { setListening(false); setHeard('Didn\'t catch that — tap to retry'); stopBackgroundRecording(); };
    rec.onend = () => { setListening(false); stopBackgroundRecording(); };
    rec.start();
  };
  const skipVoice = (cb) => { setHeard('(skipped — typed/attempted silently)'); setMatchResult('good'); cb && cb(true); };

  const onGlueScroll = () => {
    const el = glueScrollRef.current;
    if (!el || el.clientWidth === 0) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== glueIdx && idx >= 0 && idx < GLUE_CATEGORIES.length) setGlueIdx(idx);
  };
  const jumpToGlue = (i) => {
    const el = glueScrollRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    setGlueIdx(i);
  };

  const playRecording = () => { if (!recordedUrl) return; const audio = new Audio(recordedUrl); audio.play().catch(() => setHeard('Couldn\'t play that recording — try recording again')); };
  const resetRecording = () => { setRecordedUrl(null); };

  const listenForCreate = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setCreateError('Voice not available here — just type instead!'); return; }
    const rec = new SR(); rec.lang = 'es-CO'; rec.interimResults = true;
    setCreateListening(true); setCreateError('');
    rec.onresult = (e) => setCreateInput(Array.from(e.results).map(r => r[0].transcript).join(''));
    rec.onerror = () => setCreateListening(false); rec.onend = () => setCreateListening(false);
    rec.start();
  };

  const listenForNote = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR(); rec.lang = 'es-CO'; rec.interimResults = true;
    setNoteListening(true);
    rec.onresult = (e) => setNoteInput(Array.from(e.results).map(r => r[0].transcript).join(''));
    rec.onerror = () => setNoteListening(false); rec.onend = () => setNoteListening(false);
    rec.start();
  };
  const saveNote = () => { if (!noteInput.trim()) return; setNotes(prev => [{ id: Date.now(), text: noteInput.trim(), date: new Date().toLocaleDateString() }, ...prev]); setNoteInput(''); };
  const deleteNote = (id) => setNotes(prev => prev.filter(n => n.id !== id));

  const getLinkMeta = (url) => {
    const u = url.toLowerCase();
    if (u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com')) return { Icon: Film, type: 'Video', bg: '#FFE0E6', color: '#E8607A' };
    if (u.includes('spotify.com') || u.includes('soundcloud.com') || u.includes('podcast')) return { Icon: Headphones, type: 'Podcast', bg: '#EDE3FF', color: '#9B6BE0' };
    if (u.includes('.pdf')) return { Icon: FileText, type: 'Document', bg: '#FFE9D6', color: '#F2823C' };
    return { Icon: Link2, type: 'Article', bg: '#F1F8E4', color: LIME_DK };
  };
  const addLink = () => {
    const url = linkInput.trim(); if (!url) return;
    const full = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    let label = full.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
    label = label.length > 40 ? label.slice(0, 40) + '…' : label;
    setLinks(prev => [{ id: Date.now(), url: full, label, done: false, date: new Date().toLocaleDateString() }, ...prev]);
    setLinkInput('');
  };
  const toggleLinkDone = (id) => setLinks(prev => prev.map(l => l.id === id ? { ...l, done: !l.done } : l));
  const deleteLink = (id) => setLinks(prev => prev.filter(l => l.id !== id));

  const createLesson = async () => {
    if (!createInput.trim() || creating) return;
    setCreating(true); setCreateError(''); setCorrectedFrom(null);
    const typed = createInput.trim();
    try {
      const res = await fetch('/.netlify/functions/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ typed }),
      });
      const lesson = await res.json();
      if (!res.ok) throw new Error(lesson.error || 'Server error');
      const newLesson = { id: `custom-${Date.now()}`, name: lesson.title, emoji: lesson.emoji || '✨', summary: lesson.summary || '', es: lesson.title, xp: 30, custom: true, cards: lesson.cards.map(c => ({ ...c, note: c.note || '' })) };
      setCustomLessons(prev => [newLesson, ...prev]);
      if (lesson.understood && lesson.understood.toLowerCase().trim() !== typed.toLowerCase()) setCorrectedFrom({ typed, understood: lesson.understood });
      setCreateInput(''); startCustomLesson(newLesson);
    } catch (e) { setCreateError(`Couldn't build that lesson (${e.message}). Try rephrasing, or use Notes below to save it for later.`); }
    setCreating(false);
  };

  const startLesson = (world, lesson) => { setActiveWorld(world); setActiveLesson(lesson); setCardIndex(0); setPhase('see'); setSessionXp(0); setHeard(''); setMatchResult(null); resetRecording(); setNextSuggestion({ label: 'Try a Bridge pattern', tab: 'learn' }); setView('lesson'); setTimeout(() => speak(lesson.cards[0].es), 500); };
  const startCustomLesson = (lesson) => { setActiveWorld({ name: lesson.name, es: lesson.es, emoji: lesson.emoji, g1: LIME, g2: LIME_DK, desc: lesson.summary, custom: true }); setActiveLesson(lesson); setCardIndex(0); setPhase('see'); setSessionXp(0); setHeard(''); setMatchResult(null); resetRecording(); setNextSuggestion({ label: 'Watch real Spanish', tab: 'watch' }); setView('lesson'); setTimeout(() => speak(lesson.cards[0].es), 500); };
  const startBridge = (b) => { setActiveBridge(b); setBridgeStage('teach'); setQuizIdx(0); setQuizRevealed(false); setBdRevealed(false); setBdCheckRevealed(false); setSessionXp(0); setView('bridge'); };
  const startExam = () => { setExamIdx(0); setExamScore(0); setExamAnswered(null); setHeard(''); setMatchResult(null); setView('exam'); };
  const startDialogue = (d) => {
    setActiveDialogue(d); setDlgIdx(0); setDlgRevealed(false); setHeard(''); setMatchResult(null); resetRecording(); setRevealedEn({}); setGlueActive(null);
    setView('dialogue');
    if (d.steps[0].from === 'them') { setThemTyping(true); setTimeout(() => { setThemTyping(false); speak(d.steps[0].es); }, 700); }
  };

  const advance = () => {
    setHeard(''); setMatchResult(null); resetRecording();
    if (phase === 'see') { setPhase('listen'); speak(activeLesson.cards[cardIndex].es); return; }
    if (phase === 'listen') { setPhase('say'); return; }
    if (cardIndex < activeLesson.cards.length - 1) { const ni = cardIndex + 1; setCardIndex(ni); setPhase('see'); setTimeout(() => speak(activeLesson.cards[ni].es), 400); }
    else {
      const already = stats.completedLessons.includes(activeLesson.id);
      const gain = (already ? Math.floor(activeLesson.xp / 2) : activeLesson.xp) + sessionXp;
      const newXp = stats.xp + gain;
      setStats(p => ({ ...p, xp: newXp, level: levelFromXp(newXp), streak: Math.max(p.streak, 1), completedLessons: already ? p.completedLessons : [...p.completedLessons, activeLesson.id] }));
      addToReviewPool(activeLesson.cards);
      setSessionXp(gain); setView('complete');
    }
  };

  const finishBridge = () => {
    const already = stats.completedLessons.includes(activeBridge.id);
    const gain = already ? Math.floor(activeBridge.xp / 2) : activeBridge.xp; const newXp = stats.xp + gain;
    setStats(p => ({ ...p, xp: newXp, level: levelFromXp(newXp), streak: Math.max(p.streak, 1), completedLessons: already ? p.completedLessons : [...p.completedLessons, activeBridge.id] }));
    setSessionXp(gain); setActiveWorld({ name: activeBridge.rule, g1: LIME, g2: LIME_DK, emoji: '🌉' }); setActiveLesson({ cards: [...activeBridge.examples.map(e=>({es:e.es,en:e.en,hook:'',note:''})), ...activeBridge.quiz] });
    addToReviewPool([...activeBridge.examples.map(e=>({es:e.es,en:e.en})), ...activeBridge.quiz]);
    setNextSuggestion({ label: 'Practice "Meet someone"', tab: 'dialogue' }); setView('complete');
  };

  const advanceDialogue = () => {
    const d = activeDialogue;
    if (dlgIdx < d.steps.length - 1) {
      const ni = dlgIdx + 1; setDlgIdx(ni); setDlgRevealed(false); setHeard(''); setMatchResult(null); resetRecording(); setGlueActive(null);
      if (d.steps[ni].from === 'them') { setThemTyping(true); setTimeout(() => { setThemTyping(false); speak(d.steps[ni].es); }, 700); }
    } else {
      const gain = 25; const newXp = stats.xp + gain;
      setStats(p => ({ ...p, xp: newXp, level: levelFromXp(newXp), streak: Math.max(p.streak, 1) }));
      setSessionXp(gain); setActiveWorld({ name: d.title, g1: '#FFB36B', g2: '#F2823C', emoji: d.emoji }); setActiveLesson({ cards: d.steps.filter(s=>s.from==='you').map(s=>({es:s.es,en:s.en,hook:'',note:''})) });
      addToReviewPool(d.steps.filter(s=>s.from==='you').map(s=>({es:s.es,en:s.en})));
      setNextSuggestion({ label: 'See your progress', tab: 'progress' }); setView('complete');
    }
  };

  // ===== Repaso core =====
  const addToReviewPool = (cards) => {
    if (!cards || !cards.length) return;
    setReviewItems(prev => {
      const existing = new Set(prev.map(it => it.es));
      const today = new Date().toISOString().slice(0, 10);
      const additions = cards.filter(c => c.es && !existing.has(c.es)).map(c => ({ es: c.es, en: c.en, box: 1, nextDue: today }));
      return additions.length ? [...prev, ...additions] : prev;
    });
  };
  const updateReviewBox = (es, knew) => {
    setReviewItems(prev => prev.map(it => {
      if (it.es !== es) return it;
      const newBox = knew ? Math.min(5, it.box + 1) : 1;
      const days = REVIEW_INTERVALS[newBox];
      return { ...it, box: newBox, nextDue: new Date(Date.now() + days * 86400000).toISOString().slice(0, 10) };
    }));
  };
  const finishReviewSession = (cardsReviewed) => {
    const gain = cardsReviewed.length * 2; const newXp = stats.xp + gain;
    setStats(p => ({ ...p, xp: newXp, level: levelFromXp(newXp), streak: Math.max(p.streak, 1) }));
    setSessionXp(gain); setActiveWorld({ name: 'Repaso', g1: LIME, g2: LIME_DK, emoji: '🔁' }); setActiveLesson({ cards: cardsReviewed.map(c => ({ es: c.es, en: c.en, hook: '', note: '' })) });
    setNextSuggestion(null); setView('complete');
  };
  const buildTapQueue = (due, pool) => due.map(it => {
    const direction = Math.random() < 0.5 ? 'recognize' : 'produce';
    const correctText = direction === 'recognize' ? it.en : it.es;
    const decoyPool = pool.filter(p => p.es !== it.es);
    const decoys = [...decoyPool].sort(() => Math.random() - 0.5).slice(0, 3).map(p => direction === 'recognize' ? p.en : p.es);
    const options = [...new Set([correctText, ...decoys])].sort(() => Math.random() - 0.5);
    return { ...it, direction, correctText, options };
  });
  const startReview = () => {
    const today = new Date().toISOString().slice(0, 10);
    const due = reviewItems.filter(it => it.nextDue <= today);
    if (due.length === 0) return;
    const pool = reviewItems;
    let mode = 'flashcard';
    const roll = Math.random();
    if (due.length >= 3 && pool.length >= 4) { if (roll < 0.34) mode = 'match'; else if (roll < 0.67) mode = 'tap'; }
    setReviewMode(mode);
    if (mode === 'flashcard') {
      const shuffled = [...due].sort(() => Math.random() - 0.5).map(it => ({ ...it, direction: Math.random() < 0.5 ? 'recognize' : 'produce' }));
      setReviewQueue(shuffled); setReviewIdx(0); setReviewRevealed(false);
    } else if (mode === 'tap') {
      setTapQueue(buildTapQueue(due, pool)); setReviewIdx(0); setTapAnswered(null);
    } else {
      const chosen = [...due].sort(() => Math.random() - 0.5).slice(0, Math.min(6, due.length));
      let cards = [];
      chosen.forEach(it => { cards.push({ key: it.es + '-es', type: 'es', text: it.es, itemEs: it.es, solved: false, flipped: false }); cards.push({ key: it.es + '-en', type: 'en', text: it.en, itemEs: it.es, solved: false, flipped: false }); });
      setMatchItems(chosen); setMatchCards(cards.sort(() => Math.random() - 0.5)); setMatchFirst(null); setMatchBusy(false);
    }
    setView('review');
  };
  const submitReview = (knew) => {
    const item = reviewQueue[reviewIdx];
    updateReviewBox(item.es, knew);
    if (reviewIdx < reviewQueue.length - 1) { setReviewIdx(reviewIdx + 1); setReviewRevealed(false); }
    else finishReviewSession(reviewQueue);
  };
  const flipMatchCard = (idx) => {
    if (matchBusy) return;
    const card = matchCards[idx];
    if (!card || card.solved || card.flipped) return;
    if (matchFirst === null) { setMatchCards(prev => prev.map((c, i) => i === idx ? { ...c, flipped: true } : c)); setMatchFirst(idx); return; }
    const firstCard = matchCards[matchFirst];
    const isMatch = firstCard.itemEs === card.itemEs && idx !== matchFirst;
    setMatchCards(prev => prev.map((c, i) => i === idx ? { ...c, flipped: true } : c));
    setMatchBusy(true);
    isMatch ? playCorrectSound() : playIncorrectSound();
    setTimeout(() => {
      if (isMatch) {
        updateReviewBox(card.itemEs, true);
        setMatchCards(prev => {
          const updated = prev.map((c, i) => (i === idx || i === matchFirst) ? { ...c, solved: true } : c);
          if (updated.every(c => c.solved)) setTimeout(() => finishReviewSession(matchItems), 350);
          return updated;
        });
      } else { setMatchCards(prev => prev.map((c, i) => (i === idx || i === matchFirst) ? { ...c, flipped: false } : c)); }
      setMatchFirst(null); setMatchBusy(false);
    }, isMatch ? 450 : 850);
  };

  // ===== Watch & Absorb input logging =====
  const logInput = (minutes) => {
    if (justLogged) return;
    const today = new Date().toISOString().slice(0, 10);
    setInputLog(prev => { const idx = prev.findIndex(e => e.date === today); if (idx >= 0) { const copy = [...prev]; copy[idx] = { ...copy[idx], minutes: copy[idx].minutes + minutes }; return copy; } return [...prev, { date: today, minutes }]; });
    setInputMinutes(prev => prev + minutes);
    const gain = Math.round(minutes / 2); const newXp = stats.xp + gain;
    setStats(p => ({ ...p, xp: newXp, level: levelFromXp(newXp), streak: Math.max(p.streak, 1) }));
    setJustLogged(minutes);
    setTimeout(() => setJustLogged(null), 900);
  };
  const buildHoursSeries = () => {
    const sorted = [...inputLog].sort((a, b) => a.date.localeCompare(b.date));
    let cum = 0;
    return sorted.map(e => { cum += e.minutes / 60; return { date: e.date, hours: Math.round(cum * 10) / 10 }; });
  };

  const getHeroSuggestion = () => {
    const now = new Date();
    const dateKey = `${now.getMonth() + 1}-${now.getDate()}`;
    if (COLOMBIA_DATES[dateKey]) return COLOMBIA_DATES[dateKey];
    const dayIdx = Math.floor(now.getTime() / 86400000);
    const progress = WORLDS.map(w => ({ id: w.id, count: (BASE_CURRICULUM[w.id] || []).filter(l => stats.completedLessons.includes(l.id)).length })).filter(w => w.count > 0).sort((a, b) => b.count - a.count);
    if (progress.length > 0) { const pool = WORLD_SUGGESTIONS[progress[0].id] || GENERAL_SUGGESTIONS; return pool[dayIdx % pool.length]; }
    return GENERAL_SUGGESTIONS[dayIdx % GENERAL_SUGGESTIONS.length];
  };

  const TopBar = () => (
    <div className="flex justify-between items-center px-6 pt-7 pb-3 relative">
      <div className="text-3xl font-black tracking-tighter leading-none" style={{ color: LIME_DK, letterSpacing: '-0.04em' }}>CAMINO</div>
      <div className="flex gap-2 items-center">
        <button onClick={() => setUiLang(l => l === 'en' ? 'es' : 'en')} className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all" style={{ background: uiLang === 'es' ? LIME : '#F1F8E4', color: uiLang === 'es' ? '#fff' : LIME_DK }} title="Switch navigation to Spanish">{uiLang === 'es' ? 'ES' : 'EN'}</button>
        <button onClick={() => setView('progress')} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#F1F8E4' }}><BarChart3 size={15} style={{ color: LIME_DK }} /></button>
        <div key={`s${stats.streak}`} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${stats.streak > 0 ? 'anim-glow' : ''}`} style={{ background: '#FFEDD9' }}><Flame size={13} className="text-orange-500" /><span className="font-bold text-sm" style={{ color: INK }}>{stats.streak}</span></div>
        <div key={`l${stats.level}`} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${stats.level > 1 ? 'anim-glow' : ''}`} style={{ background: LIME }}><span className="font-black text-white text-sm">Lv {stats.level}</span></div>
      </div>
    </div>
  );

  const TabBar = () => {
    const tabs = [{ id: 'learn', label: 'Learn', es: 'Aprender', icon: GraduationCap }, { id: 'create', label: 'Create', es: 'Crear', icon: Wand2 }, { id: 'watch', label: 'Watch', es: 'Ver', icon: Film }, { id: 'worlds', label: 'Worlds', es: 'Mundos', icon: Globe }];
    return (
      <div className="fixed bottom-0 left-0 right-0 z-20" style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)', borderTop: '1px solid #EFE6D8', paddingBottom: 'max(4px, env(safe-area-inset-bottom))' }}>
        <div className="max-w-md mx-auto flex">
          {tabs.map(t => { const Icon = t.icon; const active = tab === t.id; return (
            <button key={t.id} onClick={() => { setTab(t.id); setView('tabs'); }} className="flex-1 flex flex-col items-center gap-1 py-2"><Icon size={22} style={{ color: active ? LIME_DK : '#C2B8A8' }} /><span className="text-xs font-bold" style={{ color: active ? LIME_DK : '#C2B8A8' }}>{uiLang === 'es' ? t.es : t.label}</span></button>
          ); })}
        </div>
      </div>
    );
  };

  const ConvoCard = () => {
    const d = daysUntil(convoDate);
    if (convoDate && d !== null && d >= 0) return (
      <div className="rounded-2xl p-5 mb-5" style={{ background: '#fff', border: `2px solid ${LIME}` }}>
        <div className="flex items-center gap-3"><Camilo mood="cheer" size={56} />
          <div className="flex-1"><div className="text-sm font-bold" style={{ color: '#8A8478' }}>Your conversation {convoName && `with ${convoName}`}</div>
            <div className="flex items-end gap-2"><div className="text-5xl font-black leading-none" style={{ color: LIME_DK }}>{d}</div><div className="font-bold mb-1 text-base" style={{ color: INK }}>{d === 1 ? 'day to go' : 'days to go'}</div></div>
            <button onClick={() => setShowConvoModal(true)} className="text-xs underline" style={{ color: '#A89F8E' }}>Edit</button>
          </div>
        </div>
      </div>
    );
    if (convoDate && d !== null && d < 0) return (<div className="rounded-2xl p-5 mb-5 text-center" style={{ background: LIME_DK }}><div className="text-white font-black text-xl mb-1">How did it go? 🇨🇴</div><button onClick={() => setShowConvoModal(true)} className="px-5 py-2 rounded-xl bg-white font-bold text-base" style={{ color: LIME_DK }}>Book the next one</button></div>);
    return (<button onClick={() => setShowConvoModal(true)} className="w-full rounded-2xl p-5 mb-5 text-left active:scale-[0.98] transition-all" style={{ background: '#fff', border: `2px dashed ${LIME}80` }}><div className="flex items-center gap-3"><Camilo mood="wave" size={52} /><div className="flex-1"><div className="font-bold text-base" style={{ color: INK }}>Book your conversation 📅</div><div className="text-sm" style={{ color: '#8A8478' }}>Set a real date with your friend.</div></div><ChevronRight size={18} style={{ color: '#C2B8A8' }} /></div></button>);
  };

  const SkipVoice = ({ onSkip }) => (<button onClick={onSkip} className="w-full text-center text-xs font-medium underline" style={{ color: '#A89F8E' }}>Can't use the mic? Tap here to continue</button>);

  if (view === 'tabs') {
    const examUnlocked = stats.completedLessons.length >= 3;
    const examDone = certificates.some(c => c.id === EXAM.title);
    const isReturning = stats.completedLessons.length > 0;
    const dueCount = reviewItems.filter(it => it.nextDue <= new Date().toISOString().slice(0, 10)).length;
    return (
      <div className="min-h-screen relative" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', fontFamily: 'system-ui, sans-serif' }}>
        <Keyframes /><PageArc base={CREAM} circle={LIME} />
        <div className="max-w-md mx-auto pb-32 relative">
          <TopBar />

          {tab === 'learn' && (
            <div key="learn" className="px-5 anim-card-rise">
              <div className="relative w-full rounded-2xl mb-4 overflow-hidden" style={{ minHeight: 200, background: G.hero }}>
                <div className="absolute top-4 right-4"><Camilo mood={isReturning ? 'happy' : 'wave'} size={56} /></div>
                <div className="relative p-6 flex flex-col justify-end" style={{ minHeight: 200 }}>
                  <div className="text-xs font-black uppercase tracking-[0.2em] mb-1.5 text-white/80">{uiLang === 'es' ? (isReturning ? `Nivel ${stats.level} · racha de ${stats.streak} días` : '¡Bienvenido, Luke!') : (isReturning ? `Level ${stats.level} · ${stats.streak} day streak` : 'Welcome, Luke')}</div>
                  <div className="font-black text-white text-4xl leading-[0.95] tracking-tight mb-3">{uiLang === 'es' ? (isReturning ? 'Sigue así.' : 'Empecemos.') : (isReturning ? 'Keep going.' : "Let's begin.")}</div>
                  <div className="rounded-xl px-3.5 py-3 mb-4 flex items-start gap-2.5" style={{ background: 'rgba(255,255,255,0.18)' }}>
                    <span className="text-lg flex-shrink-0">💬</span>
                    <div><div className="text-white/70 text-[11px] font-black uppercase tracking-wide mb-0.5">{uiLang === 'es' ? 'Intenta esto con' : 'Try this with'} {convoName || (uiLang === 'es' ? 'tu amigo' : 'your friend')}</div><div className="text-white text-base font-medium leading-snug">{getHeroSuggestion()}</div></div>
                  </div>
                  <div className="flex items-center gap-2"><div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.3)' }}><div className="h-full rounded-full transition-all duration-700" style={{ width: `${xpInLevel(stats.xp)}%`, background: '#fff' }} /></div><span className="text-white/90 text-xs font-bold whitespace-nowrap">{uiLang === 'es' ? `${100 - xpInLevel(stats.xp)} XP para Nv ${stats.level + 1}` : `${100 - xpInLevel(stats.xp)} XP to Lv ${stats.level + 1}`}</span></div>
                </div>
              </div>

              <ConvoCard />

              <div className="flex items-center gap-2 mb-2.5 px-1"><h2 className="text-lg font-black tracking-tight" style={{ color: INK }}>Up next</h2></div>
              <div className="rounded-2xl mb-5 overflow-hidden" style={{ background: '#fff', border: '1px solid #EFE6D8' }}>
                {dueCount > 0 && (
                  <button onClick={startReview} className="w-full p-4 text-left active:scale-[0.98] transition-all flex items-center gap-3" style={{ borderBottom: '1px solid #F3ECE0' }}>
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: '#F1F8E4' }}>🔁</div>
                    <div className="flex-1"><div className="font-black text-base" style={{ color: INK }}>Repaso — {dueCount} word{dueCount === 1 ? '' : 's'} ready</div><div className="text-sm" style={{ color: '#8A8478' }}>Spaced review — the single best way to make it stick.</div></div>
                    <ChevronRight size={18} style={{ color: '#C2B8A8' }} />
                  </button>
                )}
                <button onClick={() => { const pool = DIALOGUES.filter(d => stats.completedLessons.length >= d.unlock.lessons || (inputMinutes / 60) >= d.unlock.hours); startDialogue(pool[Math.floor(Math.random() * pool.length)]); }} className="w-full p-4 text-left active:scale-[0.98] transition-all flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: '#FFEDE5' }}>👋</div>
                  <div className="flex-1"><div className="font-black text-base" style={{ color: INK }}>Practice a conversation</div><div className="text-sm" style={{ color: '#8A8478' }}>{DIALOGUES.filter(d => stats.completedLessons.length >= d.unlock.lessons || (inputMinutes / 60) >= d.unlock.hours).length} of {DIALOGUES.length} unlocked — more open as you learn</div></div>
                  <ChevronRight size={18} style={{ color: '#C2B8A8' }} />
                </button>
              </div>

              {examUnlocked && !examDone ? (
                <button onClick={startExam} className="w-full rounded-2xl p-4 mb-5 text-left active:scale-[0.98] transition-all" style={{ background: G.warm }}>
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 mb-1">Milestone · No hints</div>
                  <div className="text-white font-black text-2xl leading-tight mb-0.5">{EXAM.title}</div>
                  <div className="text-white/90 text-sm font-medium">Pass to earn your certificate →</div>
                </button>
              ) : (
                <div className="w-full rounded-2xl p-4 mb-5 flex items-center gap-3" style={{ background: examDone ? '#F1F8E4' : '#fff', border: `1.5px solid ${examDone ? LIME : '#EFE6D8'}` }}>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: examDone ? LIME : '#F3ECE0' }}>{examDone ? <Award size={22} className="text-white" /> : <Lock size={18} style={{ color: '#C2B8A8' }} />}</div>
                  <div className="flex-1"><div className="font-black text-lg" style={{ color: INK }}>{EXAM.title}</div><div className="text-sm" style={{ color: examDone ? LIME_DK : '#A89F8E' }}>{examDone ? '✓ Passed — certificate earned' : `Unlocks after 3 lessons (${stats.completedLessons.length}/3)`}</div></div>
                </div>
              )}

              <div className="flex items-center justify-between mb-2.5 px-1"><div className="flex items-center gap-2"><Link2 size={15} style={{ color: LIME_DK }} /><h2 className="text-lg font-black tracking-tight" style={{ color: INK }}>The Bridge</h2></div><span className="text-xs font-bold" style={{ color: '#A89F8E' }}>Unlock words fast</span></div>
              <div className="grid grid-cols-3 gap-2.5 mb-6">{BRIDGE.map((b, idx) => { const done = stats.completedLessons.includes(b.id); const locked = idx > 0 && !stats.completedLessons.includes(BRIDGE[idx - 1].id); const bg = ['#7FB22E', '#4FA3E0', '#9B6BE0', '#E8607A', '#F2823C'][idx % 5]; const pat = BRIDGE_PATTERNS[idx % BRIDGE_PATTERNS.length]; return (
                <button key={b.id} disabled={locked} onClick={() => startBridge(b)} className={`relative rounded-xl overflow-hidden p-2.5 flex flex-col justify-between text-left ${locked ? 'opacity-40' : 'active:scale-[0.96]'}`} style={{ minHeight: 130, backgroundColor: bg, backgroundImage: pat.backgroundImage, backgroundSize: pat.backgroundSize || 'auto' }}>
                  <div className="flex justify-end">{done ? <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center"><Check size={14} style={{ color: LIME_DK }} /></div> : locked ? <Lock size={14} className="text-white/70" /> : <Zap size={16} className="text-white" />}</div>
                  <div className="text-white font-black text-sm leading-tight">{b.rule}</div>
                </button>
              ); })}</div>

              <p className="text-xs font-bold mb-2 px-1" style={{ color: '#A89F8E' }}>Explore</p>
              <button onClick={() => { setGlueIdx(0); setView('glue'); }} className="w-full rounded-xl py-3 px-4 mb-6 text-left active:scale-[0.98] transition-all flex items-center gap-3" style={{ background: '#F8F5FF' }}>
                <span className="text-lg flex-shrink-0">🧩</span>
                <div className="flex-1"><div className="font-bold text-base" style={{ color: '#5B4A8A' }}>Connecting words</div><div className="text-xs" style={{ color: '#8A7FA8' }}>mi, tus, le, porque — the little words that hold sentences together</div></div>
                <ChevronRight size={15} style={{ color: '#B5A8D6' }} />
              </button>

              {certificates.length > 0 && (<div className="mb-2"><div className="flex items-center gap-2 mb-3 px-1"><Award size={15} style={{ color: LIME_DK }} /><h2 className="text-lg font-black" style={{ color: INK }}>Your certificates</h2></div>{certificates.map(c => (<div key={c.id} className="rounded-2xl p-4 flex items-center gap-3 mb-2" style={{ background: '#F1F8E4', border: `1px solid ${LIME}` }}><Award size={24} style={{ color: LIME_DK }} /><div><div className="font-bold text-base" style={{ color: INK }}>{c.id}</div><div className="text-xs" style={{ color: '#8A8478' }}>Passed {c.date} · {c.score}/{EXAM.questions.length}</div></div></div>))}</div>)}
            </div>
          )}

          {tab === 'create' && (
            <div key="create" className="px-5 anim-card-rise">
              <div className="flex items-center gap-3 mb-4 px-1"><Camilo mood="think" size={52} /><div><div className="font-black" style={{ color: INK }}>Tell me what you heard</div><div className="text-sm" style={{ color: '#8A8478' }}>I'll turn it into a lesson — spelling and all.</div></div></div>
              <div className="rounded-2xl p-5 mb-5" style={{ background: '#fff', border: `1.5px solid ${LIME}60` }}>
                <div className="relative"><textarea value={createInput} onChange={(e) => setCreateInput(e.target.value)} placeholder="e.g. bandeja paisa, or 'how do I say I'm tired?'" rows={3} className="w-full rounded-2xl p-4 pr-12 text-base resize-none outline-none" style={{ background: CREAM, border: '1px solid #EFE6D8', color: INK }} /><button onClick={listenForCreate} className="absolute right-3 top-3 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: createListening ? '#FFE0D6' : '#F1F8E4' }}><Mic size={18} className={createListening ? 'animate-pulse' : ''} style={{ color: createListening ? CORAL : LIME_DK }} /></button></div>
                {createError && <p className="text-sm mt-2" style={{ color: CORAL }}>{createError}</p>}
                <button onClick={createLesson} disabled={creating || !createInput.trim()} className="w-full mt-3 py-3.5 rounded-2xl font-black text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40" style={{ background: LIME_DK }}>{creating ? <><Loader2 size={18} className="animate-spin" /> Building...</> : <><Sparkles size={18} /> Make me a lesson</>}</button>
              </div>
              {customLessons.length > 0 && (<><div className="flex items-center gap-2 mb-3"><BookOpen size={15} style={{ color: '#8A8478' }} /><h2 className="text-lg font-black" style={{ color: INK }}>My lessons</h2></div><div className="space-y-2.5 mb-6">{customLessons.map(lesson => { const done = stats.completedLessons.includes(lesson.id); return (<button key={lesson.id} onClick={() => startCustomLesson(lesson)} className="w-full rounded-2xl p-3.5 flex items-center gap-3 text-left transition-all active:scale-[0.98]" style={{ background: '#fff', border: `1px solid ${LIME}40` }}><div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#F1F8E4' }}>{lesson.emoji}</div><div className="flex-1"><div className="font-bold text-base" style={{ color: INK }}>{lesson.name}</div><div className="text-xs" style={{ color: '#8A8478' }}>{lesson.cards.length} words · made by you</div></div>{done ? <Check size={18} style={{ color: LIME_DK }} /> : <ChevronRight size={18} style={{ color: '#C2B8A8' }} />}</button>); })}</div></>)}

              <div className="flex items-center gap-2 mb-3"><StickyNote size={15} style={{ color: '#8A8478' }} /><h2 className="text-lg font-black" style={{ color: INK }}>My notes</h2></div>
              <div className="rounded-2xl p-4 mb-3" style={{ background: '#fff', border: '1px solid #EFE6D8' }}>
                <div className="relative"><textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Jot down a word, question, or thing to revisit..." rows={2} className="w-full rounded-xl p-3 pr-11 text-base resize-none outline-none" style={{ background: CREAM, border: '1px solid #EFE6D8', color: INK }} /><button onClick={listenForNote} className="absolute right-2 top-2 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: noteListening ? '#FFE0D6' : '#F1F8E4' }}><Mic size={15} className={noteListening ? 'animate-pulse' : ''} style={{ color: noteListening ? CORAL : LIME_DK }} /></button></div>
                <button onClick={saveNote} disabled={!noteInput.trim()} className="w-full mt-2 py-2.5 rounded-xl font-bold text-base text-white disabled:opacity-40" style={{ background: INK }}>Save note</button>
              </div>
              {notes.length === 0 ? (<div className="text-center py-6 px-4 rounded-2xl" style={{ background: '#fff', border: '1px dashed #E3D9C8' }}><p className="text-base" style={{ color: '#8A8478' }}>Saved notes show up here.</p></div>) : (
                <div className="space-y-2">{notes.map(n => (<div key={n.id} className="rounded-xl p-3 flex items-start gap-2" style={{ background: '#FFF8EC', border: '1px solid #F3E6CC' }}><div className="flex-1"><div className="text-base" style={{ color: INK }}>{n.text}</div><div className="text-[11px]" style={{ color: '#B5AB9A' }}>{n.date}</div></div><button onClick={() => deleteNote(n.id)}><Trash2 size={15} style={{ color: '#C2B8A8' }} /></button></div>))}</div>
              )}

              <div className="flex items-center gap-2 mb-3 mt-6"><Link2 size={15} style={{ color: '#8A8478' }} /><h2 className="text-lg font-black" style={{ color: INK }}>Saved links</h2></div>
              <div className="rounded-2xl p-4 mb-3" style={{ background: '#fff', border: '1px solid #EFE6D8' }}>
                <div className="flex gap-2"><input value={linkInput} onChange={(e) => setLinkInput(e.target.value)} placeholder="Paste a video, article, or podcast link..." className="flex-1 rounded-xl p-3 text-base outline-none" style={{ background: CREAM, border: '1px solid #EFE6D8', color: INK }} /><button onClick={addLink} disabled={!linkInput.trim()} className="px-4 rounded-xl font-bold text-base text-white disabled:opacity-40" style={{ background: INK }}>Save</button></div>
              </div>
              {links.length === 0 ? (<div className="text-center py-6 px-4 rounded-2xl" style={{ background: '#fff', border: '1px dashed #E3D9C8' }}><p className="text-base" style={{ color: '#8A8478' }}>Save anything to watch, read, or listen to later.</p></div>) : (
                <div className="space-y-2">{links.map(l => { const { Icon, type, bg, color } = getLinkMeta(l.url); return (
                  <div key={l.id} className="rounded-xl p-3 flex items-center gap-3" style={{ background: '#fff', border: '1px solid #EFE6D8', opacity: l.done ? 0.55 : 1 }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg }}><Icon size={16} style={{ color }} /></div>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0"><div className="text-base font-medium truncate" style={{ color: INK, textDecoration: l.done ? 'line-through' : 'none' }}>{l.label}</div><div className="text-[11px] font-bold" style={{ color }}>{type}</div></a>
                    <button onClick={() => toggleLinkDone(l.id)} className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: l.done ? LIME : '#F3ECE0' }}><Check size={13} style={{ color: l.done ? '#fff' : '#C2B8A8' }} /></button>
                    <button onClick={() => deleteLink(l.id)} className="flex-shrink-0"><Trash2 size={15} style={{ color: '#C2B8A8' }} /></button>
                  </div>
                ); })}</div>
              )}
            </div>
          )}

          {tab === 'watch' && (
            <div key="watch" className="px-5 anim-card-rise">
              <div className="flex items-center gap-3 mb-5 px-1"><Camilo mood="happy" size={52} /><div><div className="font-black" style={{ color: INK }}>Watch & absorb</div><div className="text-sm" style={{ color: '#8A8478' }}>Aim for ~90%. Let the rest wash over you.</div></div></div>
              <div className="space-y-4">{VIDEO_TIERS.map(t => { const unlocked = stats.level >= t.minLevel; const bg = t.minLevel === 1 ? '#7FB22E' : t.minLevel === 3 ? '#4FA3E0' : '#F2823C'; return (
                <div key={t.tier} onClick={() => { if (unlocked) window.open(t.url, '_blank'); }} role="button" className={`rounded-2xl p-5 flex items-center gap-3 ${unlocked ? 'cursor-pointer active:scale-[0.98]' : 'opacity-60'}`} style={{ background: bg }}>
                  <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center text-xl flex-shrink-0">{t.emoji}</div>
                  <div className="flex-1"><div className="flex items-center gap-2 mb-1.5"><div className="text-white font-bold text-base">{t.tier}</div>{!unlocked && <span className="text-[11px] font-bold text-white/80 bg-white/20 px-2 py-0.5 rounded-full">Lv {t.minLevel}+</span>}</div><div className="text-white/80 text-sm mb-1">{t.desc}</div><div className="text-white/60 text-xs">app.dreaming.com · filtered to this level</div></div>
                  {unlocked ? <Play size={18} className="text-white" /> : <Lock size={16} className="text-white/70" />}
                </div>
              ); })}</div>
              <div className="mt-6 rounded-2xl p-5" style={{ background: '#fff', border: `1.5px solid ${LIME}` }}>
                <div className="flex items-center justify-between mb-4"><div className="font-black text-base" style={{ color: INK }}>Log what you watched</div><div key={inputMinutes} className="text-sm font-bold anim-glow" style={{ color: LIME_DK }}>{(inputMinutes / 60).toFixed(1)}h total</div></div>
                <div className="grid grid-cols-4 gap-2.5">{[5, 10, 15, 30].map(m => { const isJust = justLogged === m; return (
                  <button key={m} onClick={() => logInput(m)} disabled={!!justLogged} className={`rounded-xl py-3 font-bold text-base flex items-center justify-center gap-1 ${isJust ? 'anim-glow' : ''}`} style={{ background: isJust ? LIME_DK : '#F1F8E4', color: isJust ? '#fff' : LIME_DK, transform: isJust ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.2s ease, background 0.2s ease' }}>
                    {isJust ? <><Check size={14} /> +{m}</> : `${m}m`}
                  </button>
                ); })}</div>
              </div>
              <div className="mt-5 rounded-2xl p-5" style={{ background: SKY, border: '1px solid #DCEBF8' }}><p className="text-sm leading-relaxed" style={{ color: '#4A6E8A' }}>💡 <span className="font-bold">Why this works:</span> watching input you mostly understand is how your brain absorbs Spanish naturally. Even 10 minutes counts.</p></div>
            </div>
          )}

          {tab === 'worlds' && (
            <div key="worlds" className="px-5 anim-card-rise">
              <div className="flex items-center gap-2 mb-2"><BookOpen size={18} style={{ color: LIME_DK }} /><h2 className="text-xl font-black tracking-tight" style={{ color: INK }}>Foundations</h2><span className="text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ background: '#F1F8E4', color: LIME_DK }}>Your base</span></div>
              <p className="text-sm mb-5" style={{ color: '#8A8478' }}>Work through these in order — your core. Everything else builds on it.</p>
              {(() => {
                const nextIdx = FOUNDATIONS.findIndex(u => !stats.completedLessons.includes(u.id));
                const cutoff = nextIdx === -1 ? FOUNDATIONS.length : nextIdx + 1;
                const hiddenCount = Math.max(0, FOUNDATIONS.length - cutoff);
                return (
                  <div className="space-y-3 mb-8">
                    {FOUNDATIONS.map((unit, idx) => {
                      if (idx >= cutoff && !fndExpanded) return null;
                      const done = stats.completedLessons.includes(unit.id);
                      const locked = idx > 0 && !stats.completedLessons.includes(FOUNDATIONS[idx - 1].id);
                      return (
                        <button key={unit.id} disabled={locked} onClick={() => startLesson({ name: unit.name, es: unit.es, emoji: '📘', g1: LIME, g2: LIME_DK, desc: unit.desc, custom: true }, unit)} className={`w-full rounded-2xl p-4 flex items-center gap-3 text-left transition-all ${locked ? 'opacity-40' : 'active:scale-[0.98]'}`} style={{ background: '#fff', border: `1px solid ${done ? LIME : '#EFE6D8'}` }}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black flex-shrink-0" style={{ background: done ? LIME : locked ? '#F3ECE0' : '#F1F8E4', color: done ? '#fff' : locked ? '#C2B8A8' : LIME_DK }}>{done ? <Check size={20} /> : locked ? <Lock size={15} /> : unit.n}</div>
                          <div className="flex-1"><div className="font-bold text-base mb-0.5" style={{ color: INK }}>{unit.name}</div><div className="text-sm" style={{ color: '#8A8478' }}>{unit.desc}</div></div>
                          <div className="flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: '#FFF3D6', color: '#C08A1E' }}><Star size={10} fill="#C08A1E" /> {unit.xp}</div>
                        </button>
                      );
                    })}
                    {hiddenCount > 0 && (<button onClick={() => setFndExpanded(e => !e)} className="w-full rounded-2xl p-3 flex items-center justify-center gap-2 text-base font-bold" style={{ background: '#F3ECE0', color: '#A89F8E' }}><ChevronDown size={16} style={{ transform: fndExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />{fndExpanded ? 'Show less' : `${hiddenCount} more units coming up — tap to peek`}</button>)}
                  </div>
                );
              })()}
              <div className="flex items-center gap-2 mb-2"><Globe size={18} style={{ color: '#8A8478' }} /><h2 className="text-xl font-black tracking-tight" style={{ color: INK }}>Themed worlds</h2><span className="text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ background: '#F3ECE0', color: '#8A8478' }}>Add-ons</span></div>
              <p className="text-sm mb-5" style={{ color: '#8A8478' }}>Extra vocabulary rooted in your life. Dip in anytime.</p>
              <div className="grid grid-cols-2 gap-3.5">{WORLDS.map((world) => { const lessons = BASE_CURRICULUM[world.id] || []; const done = lessons.filter(l => stats.completedLessons.includes(l.id)).length; return (
                <button key={world.id} onClick={() => { setActiveWorld(world); setView('world'); }} className="rounded-2xl p-5 flex flex-col justify-between text-left active:scale-[0.97]" style={{ minHeight: 155, background: world.g2 }}>
                  <div className="text-3xl">{world.emoji}</div><div><div className="text-white font-black text-xl leading-tight mb-1">{world.name}</div><div className="text-white/80 text-xs">{done}/{lessons.length} done</div></div>
                </button>
              ); })}</div>
            </div>
          )}
        </div>
        <TabBar />

        {showConvoModal && (
          <div className="fixed inset-0 z-30 flex items-end justify-center" style={{ background: 'rgba(42,42,40,0.5)' }} onClick={() => setShowConvoModal(false)}>
            <div className="max-w-md w-full rounded-t-3xl p-6 pb-10" style={{ background: '#fff' }} onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1 rounded-full mx-auto mb-5" style={{ background: '#E3D9C8' }} />
              <div className="flex items-center gap-3 mb-3"><Camilo mood="cheer" size={56} /><div><h2 className="text-xl font-black" style={{ color: INK }}>Book your conversation</h2><p className="text-base" style={{ color: '#8A8478' }}>A real date. A real person. Your goal.</p></div></div>
              <label className="text-sm font-bold uppercase tracking-wide" style={{ color: '#A89F8E' }}>Who with?</label>
              <input value={convoName} onChange={e => setConvoName(e.target.value)} placeholder="Your friend's name" className="w-full mt-1 mb-4 rounded-2xl p-3.5 text-base outline-none" style={{ background: CREAM, border: '1px solid #EFE6D8', color: INK }} />
              <label className="text-sm font-bold uppercase tracking-wide" style={{ color: '#A89F8E' }}>When?</label>
              <input type="date" value={convoDate ? convoDate.slice(0,10) : ''} onChange={e => setConvoDate(e.target.value)} className="w-full mt-1 mb-6 rounded-2xl p-3.5 text-base outline-none" style={{ background: CREAM, border: '1px solid #EFE6D8', color: INK }} />
              <button onClick={() => setShowConvoModal(false)} disabled={!convoDate} className="w-full py-4 rounded-2xl font-black text-white disabled:opacity-40" style={{ background: LIME_DK }}>Set my goal</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'progress') {
    const fndDone = FOUNDATIONS.filter(u => stats.completedLessons.includes(u.id)).length;
    const bridgeDone = BRIDGE.filter(b => stats.completedLessons.includes(b.id)).length;
    const worldsTouched = WORLDS.filter(w => (BASE_CURRICULUM[w.id]||[]).some(l => stats.completedLessons.includes(l.id))).length;
    const rows = [
      { label: 'Foundations', val: `${fndDone}/${FOUNDATIONS.length}`, pct: fndDone/FOUNDATIONS.length*100, color: LIME_DK },
      { label: 'The Bridge', val: `${bridgeDone}/${BRIDGE.length}`, pct: bridgeDone/BRIDGE.length*100, color: '#4FA3E0' },
      { label: 'Themed worlds touched', val: `${worldsTouched}/${WORLDS.length}`, pct: worldsTouched/WORLDS.length*100, color: '#9B6BE0' },
    ];
    const hoursSeries = buildHoursSeries();
    return (
      <div className="min-h-screen" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', background: CREAM, fontFamily: 'system-ui, sans-serif' }}>
        <div className="max-w-md mx-auto pb-10">
          <div className="px-6 pt-7 flex items-center gap-3"><button onClick={() => setView('tabs')} style={{ color: '#A89F8E' }}><X size={22} /></button><h1 className="text-xl font-black" style={{ color: INK }}>Your progress</h1></div>
          <Keyframes />
          <div className="px-6 mt-4"><div className="swipe-row">
            <div className="swipe-card rounded-2xl p-4 text-center" style={{ width: 108, background: '#fff', border: '1px solid #EFE6D8' }}><div className="font-black text-2xl anim-count" style={{ color: LIME_DK }}>{stats.level}</div><div className="text-[11px] font-bold" style={{ color: '#A89F8E' }}>LEVEL</div></div>
            <div className="swipe-card rounded-2xl p-4 text-center" style={{ width: 108, background: '#fff', border: '1px solid #EFE6D8' }}><div className="font-black text-2xl anim-count" style={{ color: INK }}>{stats.xp}</div><div className="text-[11px] font-bold" style={{ color: '#A89F8E' }}>TOTAL XP</div></div>
            <div className="swipe-card rounded-2xl p-4 text-center" style={{ width: 108, background: '#fff', border: '1px solid #EFE6D8' }}><div className="font-black text-2xl flex items-center justify-center gap-1 anim-count" style={{ color: INK }}>{stats.streak}<Flame size={14} className="text-orange-500" /></div><div className="text-[11px] font-bold" style={{ color: '#A89F8E' }}>STREAK</div></div>
            <div className="swipe-card rounded-2xl p-4 text-center" style={{ width: 108, background: '#fff', border: '1px solid #EFE6D8' }}><div className="font-black text-2xl anim-count" style={{ color: '#4FA3E0' }}>{(inputMinutes / 60).toFixed(1)}</div><div className="text-[11px] font-bold" style={{ color: '#A89F8E' }}>INPUT HRS</div></div>
          </div></div>
          <div className="px-6 mt-6 space-y-4">{rows.map(r => (
            <div key={r.label}><div className="flex justify-between text-base mb-1"><span className="font-bold" style={{ color: INK }}>{r.label}</span><span className="font-bold" style={{ color: r.color }}>{r.val}</span></div><div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#EFE6D8' }}><div className="h-full rounded-full transition-all duration-700" style={{ width: `${progressBarsReady ? r.pct : 0}%`, background: r.color }} /></div></div>
          ))}</div>

          <div className="px-6 mt-6">
            <h2 className="text-base font-black mb-2" style={{ color: INK }}>Input hours over time</h2>
            {hoursSeries.length < 2 ? (
              <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px dashed #E3D9C8' }}>
                <p className="text-base mb-3" style={{ color: '#8A8478' }}>{inputMinutes === 0 ? "You haven't logged any Watch & Absorb time yet — this chart tracks that separately from lesson XP." : "Almost there — log on one more day and your trend line appears here."}</p>
                <button onClick={() => { setTab('watch'); setView('tabs'); }} className="px-4 py-2 rounded-xl font-bold text-base text-white" style={{ background: LIME_DK }}>Go log some watch time →</button>
              </div>
            ) : (<>
              <div className="rounded-2xl p-2" style={{ background: '#fff', border: '1px solid #EFE6D8', height: 190 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hoursSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#A89F8E' }} tickFormatter={(d) => d.slice(5)} />
                    <YAxis tick={{ fontSize: 9, fill: '#A89F8E' }} />
                    <ReferenceLine y={150} stroke="#C2B8A8" strokeDasharray="4 4" label={{ value: '~150h', position: 'insideTopRight', fontSize: 9, fill: '#A89F8E' }} />
                    <ReferenceLine y={300} stroke="#C2B8A8" strokeDasharray="4 4" label={{ value: '~300h', position: 'insideTopRight', fontSize: 9, fill: '#A89F8E' }} />
                    <Line type="monotone" dataKey="hours" stroke={LIME_DK} strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] mt-2" style={{ color: '#B5AB9A' }}>Dashed lines are general comprehensible-input benchmarks from research — not a prediction about you specifically.</p>
            </>)}
          </div>

          {certificates.length > 0 && (<div className="px-6 mt-6"><h2 className="text-base font-black mb-2" style={{ color: INK }}>Certificates</h2>{certificates.map(c => (<div key={c.id} className="rounded-xl p-3 flex items-center gap-2 mb-2" style={{ background: '#F1F8E4' }}><Award size={18} style={{ color: LIME_DK }} /><span className="text-base font-bold" style={{ color: INK }}>{c.id}</span></div>))}</div>)}
          <div className="px-6 mt-6"><Camilo mood="proud" size={70} /><p className="text-base mt-2" style={{ color: '#8A8478' }}>Every bar here moves because you showed up. That's the whole game.</p></div>
        </div>
      </div>
    );
  }

  if (view === 'glue') {
    const cat = GLUE_CATEGORIES[glueIdx];
    return (
      <div className="min-h-screen flex flex-col" style={{ background: CREAM, fontFamily: 'system-ui, sans-serif' }}>
        <Keyframes />
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col" style={{ height: '100vh', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="px-6 pt-7 flex items-center gap-3 flex-shrink-0">
            <button onClick={() => setView('tabs')} style={{ color: '#A89F8E' }}><X size={22} /></button>
            <h1 key={glueIdx} className="text-xl font-black anim-card-rise" style={{ color: INK }}>{cat.emoji} {cat.title}</h1>
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-3 pb-2 flex-shrink-0">
            {GLUE_CATEGORIES.map((c, i) => (
              <button key={c.title} onClick={() => jumpToGlue(i)} aria-label={c.title} style={{ width: i === glueIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === glueIdx ? LIME_DK : '#E3D9C8', transition: 'width 0.25s, background 0.25s', border: 'none', padding: 0 }} />
            ))}
          </div>
          <div ref={glueScrollRef} onScroll={onGlueScroll} className="glue-pager flex-1" style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {GLUE_CATEGORIES.map(c => (
              <div key={c.title} style={{ flex: '0 0 100%', minWidth: '100%', scrollSnapAlign: 'start', overflowY: 'auto' }} className="px-6 pt-2 pb-4">
                {c.note && <p className="text-base leading-relaxed mb-4" style={{ color: '#6E675B' }}>{c.note}</p>}
                <div className="space-y-2.5">
                  {c.items.map(item => (
                    <div key={item.term} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: '#fff', border: '1px solid #EFE6D8' }}>
                      <button onClick={() => speak(item.term)} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F1F8E4' }}><Volume2 size={16} style={{ color: LIME_DK }} /></button>
                      <div className="flex-1"><div className="font-black text-lg" style={{ color: LIME_DK }}>{item.term}</div><div className="text-sm mt-0.5" style={{ color: '#6E675B' }}>{item.meaning}</div></div>
                    </div>
                  ))}
                </div>
                {c.extra && (<div className="mt-4 rounded-2xl p-4" style={{ background: SKY }}><p className="text-sm leading-relaxed" style={{ color: '#4A6E8A' }}>{c.extra}</p></div>)}
              </div>
            ))}
          </div>
          <p className="text-center text-sm pb-5 pt-1 flex-shrink-0" style={{ color: '#B5AB9A' }}>Swipe for more · {glueIdx + 1} of {GLUE_CATEGORIES.length}</p>
        </div>
      </div>
    );
  }

  if (view === 'review') {
    const totalCount = reviewMode === 'match' ? matchItems.length : reviewMode === 'tap' ? tapQueue.length : reviewQueue.length;
    const currentCount = reviewMode === 'match' ? Math.floor(matchCards.filter(c => c.solved).length / 2) : reviewIdx;
    return (
      <div className="min-h-screen flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', background: CREAM, fontFamily: 'system-ui, sans-serif' }}>
        <Keyframes />
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          <div className="px-6 pt-6 flex items-center gap-3"><button onClick={() => setView('tabs')} style={{ color: '#A89F8E' }}><X size={22} /></button><div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: '#EFE6D8' }}><div className="h-full rounded-full transition-all" style={{ width: `${totalCount ? (currentCount / totalCount) * 100 : 0}%`, background: LIME_DK }} /></div><span className="text-sm font-bold" style={{ color: '#A89F8E' }}>{currentCount}/{totalCount}</span></div>
          <div className="px-6 pt-3"><div className="inline-block text-[11px] font-black tracking-widest px-3 py-1 rounded-full" style={{ background: '#F1F8E4', color: LIME_DK }}>REPASO · {reviewMode === 'match' ? 'MEMORY MATCH' : reviewMode === 'tap' ? 'QUICK TAP' : 'SPACED REVIEW'}</div></div>

          {reviewMode === 'flashcard' && (() => {
            const item = reviewQueue[reviewIdx];
            if (!item) return null;
            return (
              <>
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                  <div key={reviewIdx} className="w-full rounded-[2rem] p-8 min-h-[260px] flex flex-col items-center justify-center anim-card-rise" style={{ background: '#fff', border: '1px solid #EFE6D8', boxShadow: '0 12px 40px -16px rgba(0,0,0,0.12)' }}>
                    {item.direction === 'recognize' ? (<>
                      <div className="text-base font-bold uppercase tracking-wide mb-3" style={{ color: '#A89F8E' }}>What does this mean?</div>
                      <div className="flex items-center gap-3"><div className="text-3xl font-black" style={{ color: LIME_DK }}>{item.es}</div><button onClick={() => speak(item.es)} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F1F8E4' }}><Volume2 size={18} style={{ color: LIME_DK }} /></button></div>
                      {reviewRevealed && <div className="text-xl font-bold mt-4" style={{ color: INK }}>{item.en}</div>}
                    </>) : (<>
                      <div className="text-base font-bold uppercase tracking-wide mb-3" style={{ color: '#A89F8E' }}>How do you say this?</div>
                      <div className="text-2xl font-bold text-center" style={{ color: INK }}>{item.en}</div>
                      {reviewRevealed && (<div className="flex items-center gap-3 mt-4"><div className="text-2xl font-black" style={{ color: LIME_DK }}>{item.es}</div><button onClick={() => speak(item.es)} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F1F8E4' }}><Volume2 size={18} style={{ color: LIME_DK }} /></button></div>)}
                    </>)}
                    {!reviewRevealed && <button onClick={() => setReviewRevealed(true)} className="mt-5 text-base font-bold underline" style={{ color: '#A89F8E' }}>Tap to reveal</button>}
                  </div>
                </div>
                <div className="px-6 pb-8 pt-3">{reviewRevealed ? (<div className="flex gap-3"><button onClick={() => submitReview(false)} className="flex-1 py-4 rounded-2xl font-black text-white" style={{ background: '#C2B8A8' }}>Forgot</button><button onClick={() => submitReview(true)} className="flex-1 py-4 rounded-2xl font-black text-white" style={{ background: LIME_DK }}>✓ Knew it</button></div>) : <div style={{ height: 60 }} />}</div>
              </>
            );
          })()}

          {reviewMode === 'tap' && (() => {
            const item = tapQueue[reviewIdx];
            if (!item) return null;
            const onTapOption = (opt) => {
              const correct = opt === item.correctText;
              correct ? playCorrectSound() : playIncorrectSound();
              updateReviewBox(item.es, correct);
              setTapAnswered({ opt, correct });
              setTimeout(() => { setTapAnswered(null); if (reviewIdx < tapQueue.length - 1) setReviewIdx(reviewIdx + 1); else finishReviewSession(tapQueue); }, 900);
            };
            return (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="text-base font-bold uppercase tracking-wide mb-4" style={{ color: '#A89F8E' }}>{item.direction === 'recognize' ? 'What does this mean?' : 'How do you say this?'}</div>
                <div className="flex items-center gap-3 mb-6"><div className="text-3xl font-black" style={{ color: item.direction === 'recognize' ? LIME_DK : INK }}>{item.direction === 'recognize' ? item.es : item.en}</div>{item.direction === 'recognize' && <button onClick={() => speak(item.es)} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#F1F8E4' }}><Volume2 size={18} style={{ color: LIME_DK }} /></button>}</div>
                <div className="w-full space-y-2.5">{item.options.map(opt => { const isAnswered = !!tapAnswered; const isThis = tapAnswered && tapAnswered.opt === opt; const isCorrectOpt = opt === item.correctText; return (
                  <button key={opt} onClick={() => !isAnswered && onTapOption(opt)} disabled={isAnswered} className="w-full rounded-2xl p-4 font-bold text-left transition-all" style={{ background: isAnswered ? (isCorrectOpt ? '#F1F8E4' : isThis ? '#FFEDE9' : '#fff') : '#fff', border: `1.5px solid ${isAnswered && isCorrectOpt ? LIME : isAnswered && isThis ? CORAL : '#EFE6D8'}`, color: INK }}>{opt}</button>
                ); })}</div>
              </div>
            );
          })()}

          {reviewMode === 'match' && (
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <div className="text-base font-bold uppercase tracking-wide mb-4" style={{ color: '#A89F8E' }}>Find the matching pairs</div>
              <div className="grid grid-cols-3 gap-2.5 w-full">{matchCards.map((c, idx) => (
                <button key={c.key} onClick={() => flipMatchCard(idx)} disabled={c.solved || matchBusy} className={`flip-card ${c.solved ? 'anim-solidify' : ''}`} style={{ minHeight: 64 }}>
                  <div className={`flip-inner ${c.flipped || c.solved ? 'is-flipped' : ''}`}>
                    <div className="flip-face" style={{ borderRadius: 12, background: INK, color: '#fff', fontSize: 18, fontWeight: 900 }}>?</div>
                    <div className="flip-face flip-back" style={{ borderRadius: 12, background: c.solved ? '#F1F8E4' : '#fff', border: c.solved ? `1.5px solid ${LIME}` : '1px solid #EFE6D8', color: c.solved ? LIME_DK : INK, fontSize: 13, fontWeight: 700, padding: 6, textAlign: 'center' }}>{c.text}</div>
                  </div>
                </button>
              ))}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'dialogue') {
    const d = activeDialogue; const step = d.steps[dlgIdx];
    const threadUpTo = step.from === 'them' ? dlgIdx : dlgIdx - 1;
    const threadSteps = d.steps.slice(0, Math.max(threadUpTo + 1, 0));
    return (
      <div className="min-h-screen flex flex-col" style={{ background: CREAM, fontFamily: 'system-ui, sans-serif' }}>
        <Keyframes />
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col" style={{ height: '100vh', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="px-6 pt-6 flex items-center gap-3 flex-shrink-0"><button onClick={() => setView('tabs')} style={{ color: '#A89F8E' }}><X size={22} /></button><div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: '#EFE6D8' }}><div className="h-full rounded-full transition-all" style={{ width: `${(dlgIdx / d.steps.length) * 100}%`, background: CORAL }} /></div><span className="text-sm font-bold" style={{ color: '#A89F8E' }}>{dlgIdx + 1}/{d.steps.length}</span></div>
          <div className="px-6 pt-3 pb-1 flex items-center gap-2 flex-shrink-0"><Users size={15} style={{ color: CORAL }} /><span className="text-[11px] font-black tracking-widest" style={{ color: CORAL }}>{d.title.toUpperCase()}</span></div>

          <div className="flex-1 overflow-y-auto px-6 pt-3">
            {threadSteps.map((s, idx) => {
              const isThem = s.from === 'them'; const faded = idx < dlgIdx; const revealed = !!revealedEn[idx];
              return (
                <div key={idx} className={`flex ${isThem ? 'justify-start' : 'justify-end'} mb-3 anim-card-rise`} style={{ opacity: faded ? 0.42 : 1, transition: 'opacity 0.35s' }}>
                  {isThem && <div className="w-7 h-7 rounded-full flex items-center justify-center text-base mr-2 flex-shrink-0 self-end mb-1" style={{ background: '#F3ECE0' }}>🇨🇴</div>}
                  <div style={{ maxWidth: '78%' }}>
                    <div className="rounded-2xl px-4 py-2.5" style={{ background: isThem ? '#fff' : LIME_DK, border: isThem ? '1px solid #EFE6D8' : 'none', borderBottomLeftRadius: isThem ? 6 : 18, borderBottomRightRadius: isThem ? 18 : 6 }}>
                      <div className="flex items-center gap-2"><span className="font-bold" style={{ color: isThem ? INK : '#fff', fontSize: 16 }}><TappableEs text={s.es} sentenceKey={`dlg-${idx}`} activeKey={glueActive?.key} onTap={setGlueActive} color={isThem ? LIME_DK : 'rgba(255,255,255,0.7)'} /></span><button onClick={() => speak(s.es)} className="flex-shrink-0"><Volume2 size={13} style={{ color: isThem ? LIME_DK : '#fff', opacity: 0.85 }} /></button></div>
                    </div>
                    <button onClick={() => setRevealedEn(prev => ({ ...prev, [idx]: !prev[idx] }))} className="text-[11px] font-medium mt-1 block" style={{ color: '#B5AB9A', textAlign: isThem ? 'left' : 'right', width: '100%' }}>{revealed ? s.en : '🇬🇧 Show translation'}</button>
                    {glueActive?.key?.startsWith(`dlg-${idx}-`) && <GlueExplain active={glueActive} />}
                  </div>
                </div>
              );
            })}
            {themTyping && (<div className="flex justify-start mb-3"><div className="w-7 h-7 rounded-full flex items-center justify-center text-base mr-2 flex-shrink-0" style={{ background: '#F3ECE0' }}>🇨🇴</div><div className="rounded-2xl px-4 py-3.5" style={{ background: '#fff', border: '1px solid #EFE6D8', borderBottomLeftRadius: 6 }}><div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full" style={{ background: '#C2B8A8', animation: `typingDot 1.2s ${i*0.2}s infinite` }} />)}</div></div></div>)}
            <div ref={threadEndRef} style={{ height: 1 }} />
          </div>

          {step.from === 'you' && (
            <div className="px-6 pt-2 flex-shrink-0">
              <div className="rounded-3xl p-5" style={{ background: '#fff', border: `1.5px solid ${CORAL}60` }}>
                <div className="text-[11px] font-bold uppercase mb-3" style={{ color: CORAL }}>Your turn — {step.prompt}</div>
                {!dlgRevealed ? (<button onClick={() => setDlgRevealed(true)} className="text-base font-bold underline" style={{ color: '#A89F8E' }}>Try it, then tap to reveal</button>) : (<>
                  <div className="flex items-center gap-3 mb-1"><div className="text-xl font-black" style={{ color: INK }}><TappableEs text={step.es} sentenceKey={`dlg-you-${dlgIdx}`} activeKey={glueActive?.key} onTap={setGlueActive} /></div><button onClick={() => speak(step.es)} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F1F8E4' }}><Volume2 size={16} style={{ color: LIME_DK }} /></button></div>
                  {glueActive?.key?.startsWith(`dlg-you-${dlgIdx}-`) && <GlueExplain active={glueActive} />}
                  <button onClick={() => setRevealedEn(prev => ({ ...prev, [dlgIdx]: !prev[dlgIdx] }))} className="text-xs font-medium mb-4 block mt-1" style={{ color: '#B5AB9A' }}>{revealedEn[dlgIdx] ? step.en : '🇬🇧 Show translation'}</button>
                  <button onClick={() => listen(step.es)} disabled={listening} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 font-bold text-white mb-2" style={{ background: listening ? '#C2B8A8' : CORAL }}><Mic size={18} className={listening ? 'animate-pulse' : ''} />{listening ? 'Listening...' : 'Say it out loud'}</button>
                  {heard && (
                    <div className="rounded-2xl p-3 text-center mb-2 anim-card-rise" style={{ background: matchResult === 'good' ? '#F1F8E4' : matchResult === 'close' ? '#FFF3D6' : '#FFEDE9', border: `1px solid ${matchResult === 'good' ? LIME : matchResult === 'close' ? '#E5B84B' : CORAL}` }}>
                      <div className="font-bold text-base" style={{ color: INK }}>{heard}</div>
                      {matchResult === 'good' && <div className="text-sm font-black mt-1" style={{ color: LIME_DK }}>{pick(camiSay.correct)}</div>}
                      {matchResult === 'close' && <div className="text-sm font-black mt-1" style={{ color: '#B8901E' }}>{camiSay.close}</div>}
                      {matchResult === 'try' && <div className="text-sm font-black mt-1" style={{ color: CORAL }}>{camiSay.encourage}</div>}
                    </div>
                  )}
                  <RecordPlayback recordedUrl={recordedUrl} onPlay={playRecording} />
                </>)}
              </div>
            </div>
          )}

          <div className="px-6 pb-8 pt-3 space-y-2 flex-shrink-0">
            {(step.from === 'them' || dlgRevealed) && <button onClick={advanceDialogue} className="w-full py-4 rounded-2xl font-black text-xl text-white" style={{ background: INK }}>{step.from === 'them' ? 'Continue →' : 'I said it ✓'}</button>}
            {step.from === 'you' && dlgRevealed && <SkipVoice onSkip={() => skipVoice()} />}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'exam') {
    const q = EXAM.questions[examIdx];
    const onAnswer = (correct, choice) => { setExamAnswered(choice ?? 'spoken'); if (correct) setExamScore(s => s + 1); if (choice !== 'spoken') { correct ? playCorrectSound() : playIncorrectSound(); } };
    const nextExam = () => { setExamAnswered(null); setHeard(''); setMatchResult(null); if (examIdx < EXAM.questions.length - 1) setExamIdx(examIdx + 1); else { const passed = examScore >= EXAM.passMark; setExamPassed(passed); if (passed) setCertificates(prev => prev.some(c => c.id === EXAM.title) ? prev : [...prev, { id: EXAM.title, date: new Date().toLocaleDateString(), score: examScore }]); setView('examResult'); } };
    return (
      <div className="min-h-screen flex flex-col relative" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', background: CREAM, fontFamily: 'system-ui, sans-serif' }}>
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col relative">
          <div className="px-6 pt-6 flex items-center gap-3"><button onClick={() => setView('tabs')} style={{ color: '#A89F8E' }}><X size={22} /></button><div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: '#EFE6D8' }}><div className="h-full rounded-full transition-all" style={{ width: `${(examIdx / EXAM.questions.length) * 100}%`, background: CORAL }} /></div><span className="text-sm font-bold" style={{ color: '#A89F8E' }}>{examIdx + 1}/{EXAM.questions.length}</span></div>
          <div className="px-6 pt-5 flex items-center gap-2"><Camilo mood="think" size={44} /><div className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest px-3 py-1 rounded-full" style={{ background: '#FFE9E2', color: CORAL }}>NO HINTS — YOU'VE GOT THIS</div></div>
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="text-2xl font-black text-center mb-8" style={{ color: INK }}>{q.prompt}</div>
            {q.speak ? (
              <div className="w-full space-y-2">
                <button onClick={() => listen(q.answer, (ok) => onAnswer(ok, 'spoken'))} disabled={listening || examAnswered} className="w-full rounded-2xl py-4 flex items-center justify-center gap-3 font-bold text-white" style={{ background: listening ? '#C2B8A8' : CORAL }}><Mic size={22} className={listening ? 'animate-pulse' : ''} />{listening ? 'Listening...' : 'Tap & answer out loud'}</button>
                {!examAnswered && <SkipVoice onSkip={() => onAnswer(true, 'spoken')} />}
                {examAnswered && <div className="rounded-2xl p-3 text-center" style={{ background: matchResult === 'try' ? '#FFEDE9' : '#F1F8E4', border: `1px solid ${matchResult === 'try' ? CORAL : LIME}` }}><div className="text-base" style={{ color: INK }}>{heard}</div><div className="text-sm font-black mt-1" style={{ color: matchResult === 'try' ? CORAL : LIME_DK }}>Answer: {q.answer}</div></div>}
              </div>
            ) : (
              <div className="w-full space-y-3">{q.options.map(opt => { const isAns = opt === q.answer; const chosen = examAnswered === opt; return (<button key={opt} onClick={() => !examAnswered && onAnswer(isAns, opt)} disabled={!!examAnswered} className="w-full rounded-2xl p-4 font-bold text-left transition-all" style={{ background: examAnswered ? (isAns ? '#F1F8E4' : chosen ? '#FFEDE9' : '#fff') : '#fff', border: `1.5px solid ${examAnswered && isAns ? LIME : examAnswered && chosen ? CORAL : '#EFE6D8'}`, color: INK }}>{opt} {examAnswered && isAns && <Check size={16} className="inline ml-1" style={{ color: LIME_DK }} />}</button>); })}</div>
            )}
          </div>
          <div className="px-6 pb-8">{examAnswered && <button onClick={nextExam} className="w-full py-4 rounded-2xl font-black text-xl text-white" style={{ background: INK }}>{examIdx < EXAM.questions.length - 1 ? 'Next →' : 'See result'}</button>}</div>
        </div>
      </div>
    );
  }

  if (view === 'examResult') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', fontFamily: 'system-ui, sans-serif' }}>
        <Keyframes /><PageArc base={examPassed ? G.dusk : G.warm} circle="#ffffff" />
        <div className="max-w-md w-full relative anim-card-rise">
          <div className="rounded-[2.5rem] p-8 text-center" style={{ background: '#fff' }}>
            <div className="mx-auto mb-2 flex justify-center"><Camilo mood={examPassed ? 'proud' : 'happy'} size={100} /></div>
            <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: INK }}>{examPassed ? '¡Lo lograste! 🎓' : 'So close'}</h1>
            <p className="mb-2" style={{ color: '#8A8478' }}>{examScore}/{EXAM.questions.length} correct {examPassed ? '' : `· need ${EXAM.passMark}`}</p>
            {examPassed ? (<>
              <div className="rounded-2xl p-5 my-6 anim-badge" style={{ background: '#F1F8E4', border: `1.5px solid ${LIME}` }}><Award size={32} style={{ color: LIME_DK }} className="mx-auto mb-2" /><div className="font-black text-xl" style={{ color: INK }}>Certificate earned</div><div className="text-base" style={{ color: '#8A8478' }}>{EXAM.title} · {new Date().toLocaleDateString()}</div><div className="text-sm mt-2" style={{ color: LIME_DK }}>You earned this under pressure. It's real.</div></div>
              <button onClick={() => { setNextSuggestion({ label: 'Practice "Meet someone"', tab: 'dialogue' }); setView('tabs'); }} className="w-full py-4 rounded-2xl font-black text-white" style={{ background: LIME_DK }}>Continue</button>
            </>) : (<><p className="text-base my-5" style={{ color: '#6E675B' }}>"Tranquilo — no shame, no streak lost." — Camilo</p><button onClick={startExam} className="w-full py-4 rounded-2xl font-black text-white mb-2" style={{ background: LIME_DK }}>Try again</button><button onClick={() => setView('tabs')} className="w-full py-3 rounded-2xl font-bold" style={{ background: '#F3ECE0', color: INK }}>Review first</button></>)}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'bridge') {
    const b = activeBridge;
    if (bridgeStage === 'teach') return (
      <div className="min-h-screen flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', background: CREAM, fontFamily: 'system-ui, sans-serif' }}>
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          <div className="px-6 pt-6 flex items-center gap-3"><button onClick={() => setView('tabs')} style={{ color: '#A89F8E' }}><X size={22} /></button><div className="inline-block text-[11px] font-black tracking-widest px-3 py-1 rounded-full" style={{ background: '#F1F8E4', color: LIME_DK }}>THE BRIDGE</div></div>
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <Camilo mood="cheer" size={100} />
            <div className="text-3xl font-black tracking-tight mb-2 mt-4" style={{ color: INK }}>{b.rule}</div>
            <div className="text-xl font-black mb-5" style={{ color: LIME_DK }}>{b.big}</div>
            <p className="text-xl leading-relaxed mb-4" style={{ color: '#6E675B' }}>{b.teach}</p>
            <div className="rounded-2xl p-4 text-left" style={{ background: SKY }}><div className="text-[11px] font-black uppercase tracking-wide mb-1" style={{ color: '#4A6E8A' }}>Why this happens</div><p className="text-base" style={{ color: '#4A6E8A' }}>{b.why}</p></div>
          </div>
          <div className="px-6 pb-8"><button onClick={() => setBridgeStage('examples')} className="w-full py-4 rounded-2xl font-black text-xl text-white active:scale-[0.98] flex items-center justify-center gap-2" style={{ background: LIME_DK }}>Show me <ArrowRight size={20} /></button></div>
        </div>
      </div>
    );
    if (bridgeStage === 'examples') return (
      <div className="min-h-screen flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', background: CREAM, fontFamily: 'system-ui, sans-serif' }}>
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          <div className="px-6 pt-6 flex items-center gap-3"><button onClick={() => setView('tabs')} style={{ color: '#A89F8E' }}><X size={22} /></button><div className="inline-block text-[11px] font-black tracking-widest px-3 py-1 rounded-full" style={{ background: '#F1F8E4', color: LIME_DK }}>SHARED VS CHANGED</div></div>
          <p className="px-6 text-sm mb-3" style={{ color: '#8A8478' }}>Grey = stays the same. Bold colour = the part that actually changes.</p>
          <div className="flex-1 flex flex-col justify-center px-6 space-y-3">{b.examples.map((ex, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid #EFE6D8' }}>
              <div className="text-xl"><SegWord segs={ex.enSeg} color={CORAL} /></div>
              <div className="flex items-center gap-2 mt-1"><ArrowRight size={14} style={{ color: '#C2B8A8' }} /><div className="text-xl"><SegWord segs={ex.esSeg} color={LIME_DK} /></div><button onClick={() => speak(ex.es)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#F1F8E4' }}><Volume2 size={12} style={{ color: LIME_DK }} /></button></div>
            </div>
          ))}</div>
          <div className="px-6 pb-8"><button onClick={() => { setBridgeStage('breakdown'); setBdRevealed(false); setBdCheckRevealed(false); }} className="w-full py-4 rounded-2xl font-black text-xl text-white active:scale-[0.98]" style={{ background: LIME_DK }}>Let's go deeper →</button></div>
        </div>
      </div>
    );
    if (bridgeStage === 'breakdown') return (
      <div className="min-h-screen flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', background: CREAM, fontFamily: 'system-ui, sans-serif' }}>
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          <div className="px-6 pt-6 flex items-center gap-3"><button onClick={() => setView('tabs')} style={{ color: '#A89F8E' }}><X size={22} /></button><div className="inline-block text-[11px] font-black tracking-widest px-3 py-1 rounded-full" style={{ background: '#FFEDE5', color: CORAL }}>PAUSE & THINK</div></div>
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <Camilo mood="think" size={80} />
            {!bdRevealed ? (
              <div className="mt-5 text-center">
                <button onClick={() => speakEn(b.deepDive.pause)} className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-3 active:scale-90 transition-transform" style={{ background: '#FFEDE5' }}><Volume2 size={16} style={{ color: CORAL }} /></button>
                <p className="text-xl font-bold leading-relaxed mb-6" style={{ color: INK }}>{b.deepDive.pause}</p>
                <button onClick={() => setBdRevealed(true)} className="px-7 py-3 rounded-2xl font-black text-white" style={{ background: CORAL }}>I've thought about it →</button>
              </div>
            ) : (
              <div className="mt-5 w-full anim-card-rise">
                <div className="rounded-2xl p-4 mb-5 relative" style={{ background: '#fff', border: '1px solid #EFE6D8' }}>
                  <button onClick={() => speakEn(b.deepDive.reveal)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: '#F1F8E4' }}><Volume2 size={14} style={{ color: LIME_DK }} /></button>
                  <p className="text-lg leading-relaxed pr-9" style={{ color: '#4A4540' }}>{b.deepDive.reveal}</p>
                </div>
                <div className="rounded-2xl p-4" style={{ background: SKY }}>
                  <div className="text-[11px] font-black uppercase tracking-wide mb-2" style={{ color: '#4A6E8A' }}>Now you try — how would you say...</div>
                  <div className="text-xl font-black mb-3" style={{ color: INK }}>{b.deepDive.check.en}</div>
                  {!bdCheckRevealed ? (<button onClick={() => { setBdCheckRevealed(true); speak(b.deepDive.check.es); }} className="px-5 py-2.5 rounded-xl font-bold text-white text-base" style={{ background: LIME_DK }}>Reveal</button>) : (<div className="flex items-center gap-2"><div className="text-xl font-black" style={{ color: LIME_DK }}>{b.deepDive.check.es}</div><button onClick={() => speak(b.deepDive.check.es)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#fff' }}><Volume2 size={14} style={{ color: LIME_DK }} /></button></div>)}
                </div>
              </div>
            )}
          </div>
          <div className="px-6 pb-8">{bdRevealed && bdCheckRevealed && <button onClick={() => { setBridgeStage('quiz'); setQuizIdx(0); setQuizRevealed(false); }} className="w-full py-4 rounded-2xl font-black text-xl text-white active:scale-[0.98]" style={{ background: INK }}>Now practice →</button>}</div>
        </div>
      </div>
    );
    const q = b.quiz[quizIdx];
    return (
      <div className="min-h-screen flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', background: CREAM, fontFamily: 'system-ui, sans-serif' }}>
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          <div className="px-6 pt-6 flex items-center gap-3"><button onClick={() => setView('tabs')} style={{ color: '#A89F8E' }}><X size={22} /></button><div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: '#EFE6D8' }}><div className="h-full rounded-full transition-all" style={{ width: `${(quizIdx / b.quiz.length) * 100}%`, background: LIME }} /></div><span className="text-sm font-bold" style={{ color: '#A89F8E' }}>{quizIdx + 1}/{b.quiz.length}</span></div>
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="text-base font-bold uppercase tracking-wide mb-3" style={{ color: '#A89F8E' }}>How would you say...</div>
            <div className="text-4xl font-black text-center mb-8" style={{ color: INK }}>{q.en}</div>
            {quizRevealed ? <div className="flex items-center gap-3"><div className="text-4xl font-black" style={{ color: LIME_DK }}>{q.es}</div><button onClick={() => speak(q.es)} className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#F1F8E4' }}><Volume2 size={22} style={{ color: LIME_DK }} /></button></div> : <button onClick={() => { setQuizRevealed(true); speak(q.es); }} className="px-8 py-3 rounded-2xl font-bold text-white" style={{ background: LIME_DK }}>Reveal</button>}
          </div>
          <div className="px-6 pb-8">{quizRevealed && <button onClick={() => { if (quizIdx < b.quiz.length - 1) { setQuizIdx(quizIdx + 1); setQuizRevealed(false); } else finishBridge(); }} className="w-full py-4 rounded-2xl font-black text-xl text-white" style={{ background: INK }}>{quizIdx < b.quiz.length - 1 ? 'Next →' : 'Finish ✓'}</button>}</div>
        </div>
      </div>
    );
  }

  if (view === 'world') {
    const lessons = BASE_CURRICULUM[activeWorld.id] || [];
    return (
      <div className="min-h-screen" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', background: CREAM, fontFamily: 'system-ui, sans-serif' }}>
        <div className="max-w-md mx-auto pb-10">
          <div className="relative px-6 pt-8 pb-10" style={{ background: `linear-gradient(135deg, ${activeWorld.g1} 0%, ${activeWorld.g2} 100%)` }}>
            <button onClick={() => setView('tabs')} className="relative flex items-center gap-1 text-white/90 text-base font-bold mb-6"><ArrowLeft size={18} /> Back</button>
            <div className="relative"><div className="text-white font-black text-4xl tracking-tighter">{activeWorld.name}</div><div className="text-white/80 text-base font-medium">{activeWorld.desc}</div><div className="text-white/70 text-sm font-medium mt-1">In Spanish: <span className="font-bold">{activeWorld.es}</span></div></div>
          </div>
          <div className="px-6 -mt-5 space-y-3">{lessons.map((lesson, idx) => { const done = stats.completedLessons.includes(lesson.id); const locked = idx > 0 && !stats.completedLessons.includes(lessons[idx - 1].id); return (
            <button key={lesson.id} disabled={locked} onClick={() => startLesson(activeWorld, lesson)} className={`w-full rounded-3xl p-5 flex items-center gap-4 text-left transition-all ${locked ? 'opacity-40' : 'active:scale-[0.98]'}`} style={{ background: '#fff', border: '1px solid #EFE6D8' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl" style={{ background: done ? `linear-gradient(135deg, ${activeWorld.g1}, ${activeWorld.g2})` : locked ? '#F3ECE0' : '#F7F1E8', color: done ? '#fff' : locked ? '#C2B8A8' : INK }}>{done ? <Check size={26} /> : locked ? <Lock size={20} /> : idx + 1}</div>
              <div className="flex-1"><div className="font-bold text-xl" style={{ color: INK }}>{lesson.name}</div><div className="text-sm" style={{ color: '#8A8478' }}>{lesson.cards.length} words · {lesson.es}</div></div>
              <div className="flex items-center gap-1 text-sm font-black px-2.5 py-1 rounded-full" style={{ background: activeWorld.g1 + '25', color: activeWorld.g2 }}><Star size={12} fill={activeWorld.g2} /> {lesson.xp}</div>
            </button>
          ); })}</div>
        </div>
      </div>
    );
  }

  if (view === 'lesson') {
    const card = activeLesson.cards[cardIndex];
    const progress = ((cardIndex + (phase === 'say' ? 0.66 : phase === 'listen' ? 0.33 : 0)) / activeLesson.cards.length) * 100;
    const phaseInfo = { see: { label: 'STEP 1 · UNDERSTAND', tip: 'Just read and understand.' }, listen: { label: 'STEP 2 · LISTEN', tip: 'Tap the speaker. Hear it.' }, say: { label: 'STEP 3 · SAY IT', tip: 'Now say it out loud.' } }[phase];
    return (
      <div className="min-h-screen flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', background: CREAM, fontFamily: 'system-ui, sans-serif' }}>
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          <div className="px-6 pt-6 flex items-center gap-3"><button onClick={() => setView(activeWorld?.custom ? 'tabs' : 'world')} style={{ color: '#A89F8E' }}><X size={22} /></button><div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: '#EFE6D8' }}><div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${activeWorld.g1}, ${activeWorld.g2})` }} /></div><span className="text-sm font-bold" style={{ color: '#A89F8E' }}>{cardIndex + 1}/{activeLesson.cards.length}</span></div>
          <div className="px-6 pt-4 flex items-center gap-3"><Camilo mood={matchResult === 'good' ? 'cheer' : phase === 'listen' ? 'listen' : 'think'} size={44} /><div className="inline-block text-[11px] font-black tracking-widest px-3 py-1 rounded-full" style={{ background: activeWorld.g1 + '25', color: activeWorld.g2 }}>{phaseInfo.label}</div></div>
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
            <div key={cardIndex} className="w-full rounded-[2rem] p-8 min-h-[280px] flex flex-col items-center justify-center relative anim-card-rise" style={{ background: '#fff', border: '1px solid #EFE6D8', boxShadow: '0 12px 40px -16px rgba(0,0,0,0.12)' }}>
              <div className="text-base font-bold uppercase tracking-wide mb-1" style={{ color: '#A89F8E' }}>English</div>
              <div className="text-2xl font-bold text-center mb-5" style={{ color: INK }}>{card.en}</div>
              <div className="w-16 h-px mb-5" style={{ background: '#EFE6D8' }} />
              <div className="text-base font-bold uppercase tracking-wide mb-2" style={{ color: '#A89F8E' }}>Spanish</div>
              <div className="flex items-center gap-3 mb-2"><div className="text-4xl font-black text-center tracking-tight" style={{ color: LIME_DK }}>{card.es}</div><button onClick={() => speak(card.es)} className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90 flex-shrink-0" style={{ background: `linear-gradient(135deg, ${activeWorld.g1}, ${activeWorld.g2})` }}><Volume2 size={22} className="text-white" /></button></div>
              {card.hook && <div className="mt-3 text-base text-center px-4 py-2 rounded-2xl font-medium" style={{ background: SKY, color: '#4A6E8A' }}>🧠 {card.hook}</div>}
              {card.note && phase !== 'see' && <div className="mt-2 text-sm text-center px-3 py-1 rounded-full font-medium" style={{ color: activeWorld.g2 }}>{card.note}</div>}
            </div>
            <div className="text-base text-center mt-4 px-4" style={{ color: '#8A8478' }}>{phaseInfo.tip}</div>
            {phase === 'say' && (
              <div className="w-full mt-4 space-y-2">
                <button onClick={() => listen(card.es)} disabled={listening} className="w-full rounded-2xl py-4 flex items-center justify-center gap-3 font-bold text-white transition-all active:scale-[0.98]" style={{ background: listening ? '#C2B8A8' : `linear-gradient(135deg, ${activeWorld.g1}, ${activeWorld.g2})` }}><Mic size={22} className={listening ? 'animate-pulse' : ''} />{listening ? 'Listening...' : 'Tap & say it out loud'}</button>
                {!heard && <SkipVoice onSkip={() => skipVoice()} />}
                {heard && <div className="rounded-2xl p-3 text-center anim-card-rise" style={{ background: matchResult === 'good' ? '#F1F8E4' : matchResult === 'close' ? '#FFF3D6' : '#FFEDE9', border: `1px solid ${matchResult === 'good' ? LIME : matchResult === 'close' ? '#E5B84B' : CORAL}` }}><div className="font-bold text-base" style={{ color: INK }}>{heard}</div>{matchResult === 'good' && <div className="text-sm font-black mt-1" style={{ color: LIME_DK }}>{pick(camiSay.correct)} +5 XP</div>}{matchResult === 'close' && <div className="text-sm font-black mt-1" style={{ color: '#B8901E' }}>{camiSay.close}</div>}{matchResult === 'try' && <div className="text-sm font-black mt-1" style={{ color: CORAL }}>{camiSay.encourage}</div>}</div>}
                <RecordPlayback recordedUrl={recordedUrl} onPlay={playRecording} />
              </div>
            )}
          </div>
          <div className="px-6 pb-8 pt-2"><button onClick={() => { if (phase === 'say' && matchResult === 'good') setSessionXp(s => s + 5); advance(); }} className="w-full py-4 rounded-2xl font-black text-xl text-white transition-all active:scale-[0.98]" style={{ background: INK }}>{phase === 'see' ? 'Got it →' : phase === 'listen' ? 'Heard it →' : (cardIndex < activeLesson.cards.length - 1 ? 'Next word →' : 'Finish ✓')}</button></div>
        </div>
      </div>
    );
  }

  if (view === 'complete') {
    const d = daysUntil(convoDate);
    const sessionMinutes = Math.round((Date.now() - sessionStartRef.current) / 60000);
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', fontFamily: 'system-ui, sans-serif' }}>
        <Keyframes /><PageArc base={G.dusk} circle="#ffffff" />
        <div className="max-w-md w-full relative anim-card-rise">
          <div className="rounded-[2.5rem] p-8 text-center" style={{ background: '#fff' }}>
            <div className="mx-auto mb-1 flex justify-center"><Camilo mood="proud" size={100} /></div>
            <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: INK }}>¡Lo lograste, Luke!</h1>
            <p className="mb-5" style={{ color: '#8A8478' }}>You're a little more fluent than 2 minutes ago.</p>
            {sessionMinutes >= 20 && (
              <div className="rounded-2xl p-3 mb-4 text-left" style={{ background: SKY }}>
                <p className="text-sm" style={{ color: '#4A6E8A' }}>⏱️ You've been at this for about {sessionMinutes} minutes — solid session. Keep going if you're in the zone, or this is a good place to leave it for today.</p>
              </div>
            )}
            {correctedFrom && <div className="rounded-2xl p-3 mb-4 text-left" style={{ background: '#F1F8E4', border: `1px solid ${LIME}` }}><p className="text-sm" style={{ color: '#6E675B' }}>You typed "<span style={{ color: INK }}>{correctedFrom.typed}</span>" — built for <span className="font-bold" style={{ color: LIME_DK }}>{correctedFrom.understood}</span>.</p></div>}
            {convoDate && d !== null && d >= 0 ? (
              <div className="rounded-2xl p-4 mb-6" style={{ background: SKY, border: `1px solid ${LIME}40` }}><div className="text-sm mb-1" style={{ color: '#6E675B' }}>Prep for your conversation</div><div className="font-black text-xl" style={{ color: INK }}>{d} {d === 1 ? 'day' : 'days'} to go {convoName && `with ${convoName}`} 🇨🇴</div></div>
            ) : (<div className="rounded-2xl p-4 mb-6 flex items-center justify-center gap-4" style={{ background: CREAM }}>
              <div className="text-center"><div className="font-black text-2xl anim-count" style={{ color: LIME_DK }}>+{sessionXp}</div><div className="text-[11px] font-bold" style={{ color: '#A89F8E' }}>XP</div></div>
              <div className="w-px h-8" style={{ background: '#E3D9C8' }} />
              <div className="text-center"><div className="font-black text-2xl" style={{ color: INK }}>{stats.level}</div><div className="text-[11px] font-bold" style={{ color: '#A89F8E' }}>LEVEL</div></div>
              <div className="w-px h-8" style={{ background: '#E3D9C8' }} />
              <div className="text-center"><div className="font-black text-2xl flex items-center gap-1" style={{ color: INK }}>{stats.streak}<Flame size={16} className="text-orange-500" /></div><div className="text-[11px] font-bold" style={{ color: '#A89F8E' }}>STREAK</div></div>
            </div>)}
            {nextSuggestion ? (<>
              <button onClick={() => { if (nextSuggestion.tab === 'dialogue') { setNextSuggestion(null); const pool = DIALOGUES.filter(d => stats.completedLessons.length >= d.unlock.lessons || (inputMinutes / 60) >= d.unlock.hours); startDialogue(pool[Math.floor(Math.random() * pool.length)]); } else if (nextSuggestion.tab === 'progress') { setNextSuggestion(null); setView('progress'); } else { setTab(nextSuggestion.tab); setNextSuggestion(null); setView('tabs'); } }} className="w-full py-4 rounded-2xl font-black text-white mb-2" style={{ background: LIME_DK }}>{nextSuggestion.label} →</button>
              <button onClick={() => { setCorrectedFrom(null); setNextSuggestion(null); setView('tabs'); }} className="w-full py-2.5 rounded-2xl font-bold text-base" style={{ background: '#F3ECE0', color: INK }}>Back to home</button>
            </>) : (<button onClick={() => { setCorrectedFrom(null); setView('tabs'); }} className="w-full py-4 rounded-2xl font-black text-white" style={{ background: LIME_DK }}>Continue</button>)}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────
// FORUM TYPES
// ─────────────────────────────────────────────

export type ForumCategory = 'Toate' | 'Antrenament' | 'Nutriție' | 'Recuperare' | 'Competiții' | 'Echipament' | 'Motivație';

export interface ForumReply {
    id: number;
    author: string;
    avatar: string;
    color: string;
    handle: string;
    content: string;
    time: string;
    likes: number;
    liked: boolean;
    verified: boolean;
}

export interface ForumThread {
    id: number;
    author: string;
    avatar: string;
    color: string;
    handle: string;
    verified: boolean;
    content: string;
    category: ForumCategory;
    time: string;
    likes: number;
    liked: boolean;
    replies: ForumReply[];
    reposts: number;
    reposted: boolean;
    bookmarked: boolean;
    views: number;
    pinned?: boolean;
    image?: string;
    poll?: {
        question: string;
        options: { label: string; votes: number }[];
        totalVotes: number;
        voted: boolean;
    };
}

export interface TrendingTopic {
    id: number;
    tag: string;
    category: string;
    posts: number;
}

export interface SuggestedUser {
    name: string;
    handle: string;
    color: string;
    bio: string;
    verified: boolean;
    followers: number;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

export const FORUM_CATEGORIES: ForumCategory[] = [
    'Toate', 'Antrenament', 'Nutriție', 'Recuperare', 'Competiții', 'Echipament', 'Motivație',
];

export const TRENDING_TOPICS: TrendingTopic[] = [
    { id: 1, tag: '#MaratonChișinău2026',  category: 'Competiții',   posts: 2847 },
    { id: 2, tag: '#LegDay',               category: 'Antrenament',  posts: 1523 },
    { id: 3, tag: '#MealPrep',             category: 'Nutriție',     posts: 987 },
    { id: 4, tag: '#RecuperareActivă',     category: 'Recuperare',   posts: 654 },
    { id: 5, tag: '#CrossFitMD',           category: 'Antrenament',  posts: 1203 },
    { id: 6, tag: '#ProvocareaDe30Zile',   category: 'Motivație',    posts: 3102 },
];

export const SUGGESTED_USERS: SuggestedUser[] = [
    { name: 'Ion Ceban',      handle: '@ion_fitness',     color: '#1a6fff', bio: 'Antrenor certificat • 10+ ani exp.',  verified: true,  followers: 12400 },
    { name: 'Maria Lungu',    handle: '@maria_runs',      color: '#e84393', bio: 'Ultra-maratonistă 🏃‍♀️ | Chișinău',    verified: true,  followers: 8900 },
    { name: 'Pavel Rotaru',   handle: '@pavel_lifts',     color: '#00b894', bio: 'Powerlifting & coaching',              verified: false, followers: 3200 },
    { name: 'Ana Stratan',    handle: '@ana_yoga',        color: '#fdcb6e', bio: 'Yoga & meditație • Instructor',        verified: true,  followers: 6700 },
];

export const INITIAL_THREADS: ForumThread[] = [
    {
        id: 1,
        author: 'FitMoldova',
        avatar: 'FM',
        color: '#1a6fff',
        handle: '@fitmoldova',
        verified: true,
        content: '📢 Anunț important!\n\nÎnscrierile pentru Maratonul Chișinău 2026 sunt DESCHISE! 🏃‍♂️🏃‍♀️\n\n🗓 Data: 15 Septembrie 2026\n📍 Start: Piața Marii Adunări Naționale\n🏅 Distanțe: 5K, 10K, 21K, 42K\n\nPrimii 500 de participanți primesc un tricou exclusiv! Link în bio. 👇\n\n#MaratonChișinău2026 #FitMoldova',
        category: 'Competiții',
        time: '2h',
        likes: 847,
        liked: false,
        replies: [
            {
                id: 101,
                author: 'Maria Lungu',
                avatar: 'ML',
                color: '#e84393',
                handle: '@maria_runs',
                content: 'M-am înscris deja la 42K! Cine mai vine? 🙋‍♀️💪',
                time: '1h',
                likes: 124,
                liked: false,
                verified: true,
            },
            {
                id: 102,
                author: 'Andrei Popescu',
                avatar: 'AP',
                color: '#00b894',
                handle: '@andrei_fit',
                content: 'Primul meu maraton! Merg pe 10K pentru început. Foarte entuziasmat!',
                time: '45min',
                likes: 67,
                liked: false,
                verified: false,
            },
        ],
        reposts: 342,
        reposted: false,
        bookmarked: false,
        views: 24500,
        pinned: true,
    },
    {
        id: 2,
        author: 'Ion Ceban',
        avatar: 'IC',
        color: '#1a6fff',
        handle: '@ion_fitness',
        verified: true,
        content: '💡 Thread: Cele mai comune greșeli la squat și cum să le corectezi\n\n1️⃣ Genunchii colapsează înăuntru → Activează gluteii, folosește bandă elastică\n2️⃣ Călcâiele se ridică → Lucrează mobilitatea gleznei\n3️⃣ Bustul cade prea mult → Core engagement, thoracic mobility\n4️⃣ Nu cobori destul → Box squats pentru pattern corect\n\nSalvează acest post! Ai întrebări? 👇',
        category: 'Antrenament',
        time: '4h',
        likes: 523,
        liked: false,
        replies: [
            {
                id: 201,
                author: 'Cristina Rusu',
                avatar: 'CR',
                color: '#6c5ce7',
                handle: '@cristina_gym',
                content: 'Tocmai aveam această problemă cu genunchii! Mulțumesc pentru sfaturi, Ion! 🙏',
                time: '3h',
                likes: 34,
                liked: false,
                verified: false,
            },
        ],
        reposts: 189,
        reposted: false,
        bookmarked: false,
        views: 15200,
    },
    {
        id: 3,
        author: 'Ana Stratan',
        avatar: 'AS',
        color: '#fdcb6e',
        handle: '@ana_yoga',
        verified: true,
        content: 'Dimineața perfectă nu începe cu cafeaua ☕\n\nÎncepe cu 10 minute de stretching. Corpul tău îți va mulțumi.\n\nAm pregătit o rutină simplă de 10 minute pe care o poate face oricine. Zero echipament necesar.\n\nCine vrea să o încerc? Like = Da! 💛',
        category: 'Recuperare',
        time: '5h',
        likes: 891,
        liked: false,
        replies: [
            {
                id: 301,
                author: 'Elena Vasilache',
                avatar: 'EV',
                color: '#fd79a8',
                handle: '@elena_fit',
                content: 'Am încercat ieri! Chiar face diferență. Recomand 100% 🧘‍♀️',
                time: '4h',
                likes: 56,
                liked: false,
                verified: false,
            },
            {
                id: 302,
                author: 'Mihai Cojocaru',
                avatar: 'MC',
                color: '#00cec9',
                handle: '@mihai_c',
                content: 'Ca cineva care stă 8h pe scaun, am nevoie desperată de asta 😅',
                time: '3h',
                likes: 89,
                liked: false,
                verified: false,
            },
        ],
        reposts: 267,
        reposted: false,
        bookmarked: false,
        views: 31400,
        poll: {
            question: 'Faci stretching dimineața?',
            options: [
                { label: 'Da, zilnic! 💪', votes: 234 },
                { label: 'Uneori', votes: 567 },
                { label: 'Niciodată 😅', votes: 189 },
                { label: 'Vreau să încep!', votes: 412 },
            ],
            totalVotes: 1402,
            voted: false,
        },
    },
    {
        id: 4,
        author: 'Pavel Rotaru',
        avatar: 'PR',
        color: '#00b894',
        handle: '@pavel_lifts',
        verified: false,
        content: 'Nou record personal la deadlift: 220kg! 🎉🏋️\n\nA durat 18 luni de muncă constantă. Dacă eu pot, poți și tu.\n\nProgramul meu:\n• Luni: Squat + accesorii\n• Miercuri: Bench + shoulders\n• Vineri: Deadlift + back\n• Sâmbătă: Cardio ușor + recovery\n\nConsistența > Intensitatea extremă\n\n#Powerlifting #RecordPersonal',
        category: 'Antrenament',
        time: '6h',
        likes: 1204,
        liked: false,
        replies: [
            {
                id: 401,
                author: 'Ion Ceban',
                avatar: 'IC',
                color: '#1a6fff',
                handle: '@ion_fitness',
                content: 'Bravo, Pavel! Progres incredibil. Respectul meu total! 💪🔥',
                time: '5h',
                likes: 145,
                liked: false,
                verified: true,
            },
        ],
        reposts: 98,
        reposted: false,
        bookmarked: false,
        views: 18700,
    },
    {
        id: 5,
        author: 'Diana Moraru',
        avatar: 'DM',
        color: '#a29bfe',
        handle: '@diana_nutrition',
        verified: true,
        content: '🥗 Meal prep duminică — 5 mese în 2 ore!\n\nMenu-ul acestei săptămâni:\n\n🍗 Piept de pui la grătar + orez brun\n🥩 Chiftele de curcan cu legume\n🐟 Somon la cuptor cu cartofi dulci\n🥚 Omletă cu spanac (prep dimineață)\n🥣 Overnight oats cu fructe\n\nToate sub 500 kcal per porție. Salvați pentru inspirație!\n\n#MealPrep #NutritieSanatoasa',
        category: 'Nutriție',
        time: '8h',
        likes: 672,
        liked: false,
        replies: [
            {
                id: 501,
                author: 'Alina Pascari',
                avatar: 'AP',
                color: '#fab1a0',
                handle: '@alina_p',
                content: 'Rețeta pentru chiftelele de curcan, te rog! 🙏😋',
                time: '7h',
                likes: 23,
                liked: false,
                verified: false,
            },
            {
                id: 502,
                author: 'Victor Popa',
                avatar: 'VP',
                color: '#55a3f5',
                handle: '@victor_meal',
                content: 'Overnight oats sunt game changer. Le fac de 2 ani și nu m-am plictisit niciodată!',
                time: '6h',
                likes: 41,
                liked: false,
                verified: false,
            },
        ],
        reposts: 156,
        reposted: false,
        bookmarked: false,
        views: 22100,
    },
    {
        id: 6,
        author: 'Sergiu Dabija',
        avatar: 'SD',
        color: '#e17055',
        handle: '@sergiu_runner',
        verified: false,
        content: 'Întrebare pentru comunitate: ce căști wireless folosiți la alergare? 🎧\n\nCerinții mele:\n✅ Rezistente la transpirație\n✅ Nu cad la mișcări bruște\n✅ Baterie 6h+\n✅ Sunet decent\n\nBuget: până la 500 lei\n\nMulțumesc anticipat! 🙏\n\n#Echipament #Running',
        category: 'Echipament',
        time: '10h',
        likes: 89,
        liked: false,
        replies: [
            {
                id: 601,
                author: 'Lucia Bivol',
                avatar: 'LB',
                color: '#81ecec',
                handle: '@lucia_runs',
                content: 'JBL Endurance Race. Le folosesc de un an, sunt perfecte. Cam 400 lei.',
                time: '9h',
                likes: 56,
                liked: false,
                verified: false,
            },
            {
                id: 602,
                author: 'Andrei Popescu',
                avatar: 'AP',
                color: '#00b894',
                handle: '@andrei_fit',
                content: 'Eu merg cu Soundcore Sport X10. Sunt cu cârlig, nu cad niciodată. Le recomand!',
                time: '8h',
                likes: 34,
                liked: false,
                verified: false,
            },
            {
                id: 603,
                author: 'Maria Lungu',
                avatar: 'ML',
                color: '#e84393',
                handle: '@maria_runs',
                content: 'AirPods Pro cu ear tips de spumă (cumpărate separat). Merită investiția!',
                time: '7h',
                likes: 78,
                liked: false,
                verified: true,
            },
        ],
        reposts: 34,
        reposted: false,
        bookmarked: false,
        views: 8400,
    },
    {
        id: 7,
        author: 'Cristina Rusu',
        avatar: 'CR',
        color: '#6c5ce7',
        handle: '@cristina_gym',
        verified: false,
        content: '30 de zile de provocare completate! ✅🎉\n\nAm început fără să pot face un singur pull-up. Astăzi am făcut 8 consecutive!\n\nCe am învățat:\n→ Negative reps sunt cheia la început\n→ Band-assisted e un tool fantastic\n→ Consistența bate talentul\n→ Comunitatea asta m-a motivat enorm ❤️\n\nMulțumesc tuturor care m-au încurajat!\n\n#ProvocareaDe30Zile #PullUp #TransformarePersonala',
        category: 'Motivație',
        time: '12h',
        likes: 1567,
        liked: false,
        replies: [
            {
                id: 701,
                author: 'FitMoldova',
                avatar: 'FM',
                color: '#1a6fff',
                handle: '@fitmoldova',
                content: 'Incredibil, Cristina! 🏆 Ești o inspirație pentru întreaga comunitate! Badge special pe drum 🎖️',
                time: '11h',
                likes: 234,
                liked: false,
                verified: true,
            },
            {
                id: 702,
                author: 'Ana Stratan',
                avatar: 'AS',
                color: '#fdcb6e',
                handle: '@ana_yoga',
                content: 'Sunt atât de mândră de tine! 🥹💪 Să continuăm!',
                time: '10h',
                likes: 89,
                liked: false,
                verified: true,
            },
        ],
        reposts: 423,
        reposted: false,
        bookmarked: false,
        views: 45600,
    },
];

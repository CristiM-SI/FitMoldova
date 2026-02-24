// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type Sport =
    | 'Fotbal' | 'Trântă' | 'Lupte' | 'Box' | 'Judo'
    | 'Baschet' | 'Rugby' | 'Caiac-Canoe' | 'Haltere' | 'Volei'
    | 'Atletism' | 'Tenis de Masă' | 'Ciclism' | 'Înot' | 'Handbal';

export type FeedTab = 'feed' | 'challenges' | 'members' | 'clubs';

export interface Post {
    id:       number;
    author:   string;
    color:    string;
    sport:    Sport;
    time:     string;
    content:  string;
    likes:    number;
    comments: number;
    liked:    boolean;
}

export interface Challenge {
    id:           number;
    sport:        string;
    title:        string;
    desc:         string;
    participants: number;
    days:         number;
    progress:     number;
    joined:       boolean;
}

export interface Achievement {
    icon:  string;
    title: string;
    date:  string;
}

export interface Member {
    name:         string;
    city:         string;
    sport:        Sport;
    points:       number;
    rank:         string;
    color:        string;
    bio:          string;
    joinedDate:   string;
    activities:   number;
    daysActive:   number;
    challenges:   number;
    achievements: Achievement[];
}

export interface ToastState {
    icon:    string;
    msg:     string;
    visible: boolean;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

export const SPORTS: Sport[] = [
    'Fotbal', 'Trântă', 'Lupte', 'Box', 'Judo',
    'Baschet', 'Rugby', 'Caiac-Canoe', 'Haltere', 'Volei',
    'Atletism', 'Tenis de Masă', 'Ciclism', 'Înot', 'Handbal',
];

export const SPORT_CHIPS: { emoji: string; label: string; value: Sport | 'all' }[] = [
    { emoji: '',    label: 'Toate',         value: 'all' },
    { emoji: '⚽',  label: 'Fotbal',        value: 'Fotbal' },
    { emoji: '🤼',  label: 'Trântă',        value: 'Trântă' },
    { emoji: '🤼‍♂️', label: 'Lupte',         value: 'Lupte' },
    { emoji: '🥊',  label: 'Box',           value: 'Box' },
    { emoji: '🥋',  label: 'Judo',          value: 'Judo' },
    { emoji: '🏀',  label: 'Baschet',       value: 'Baschet' },
    { emoji: '🏉',  label: 'Rugby',         value: 'Rugby' },
    { emoji: '🛶',  label: 'Caiac-Canoe',   value: 'Caiac-Canoe' },
    { emoji: '🏋️',  label: 'Haltere',       value: 'Haltere' },
    { emoji: '🏐',  label: 'Volei',         value: 'Volei' },
    { emoji: '🏃',  label: 'Atletism',      value: 'Atletism' },
    { emoji: '🏓',  label: 'Tenis de Masă', value: 'Tenis de Masă' },
    { emoji: '🚴',  label: 'Ciclism',       value: 'Ciclism' },
    { emoji: '🏊',  label: 'Înot',          value: 'Înot' },
    { emoji: '🤾',  label: 'Handbal',       value: 'Handbal' },
];

export const INITIAL_CHALLENGES: Challenge[] = [
    { id: 1,  sport: '⚽',  title: '30 Zile Fotbal Daily',    desc: 'Practică dribling, pase sau șuturi zilnic 30 de zile.',          participants: 1540, days: 8,  progress: 73, joined: false },
    { id: 2,  sport: '🥊',  title: '100 Box Rounds',          desc: 'Completează 100 de runde de box în 2 săptămâni.',                participants: 380,  days: 6,  progress: 45, joined: false },
    { id: 3,  sport: '🏃',  title: '30 Zile Alergare',        desc: 'Aleargă cel puțin 5km zilnic timp de 30 de zile.',               participants: 1240, days: 12, progress: 68, joined: false },
    { id: 4,  sport: '🥋',  title: 'Judo Ippone Quest',       desc: 'Reușește 20 de ippone-uri în meciuri sau randori în 30 de zile.',participants: 290,  days: 14, progress: 58, joined: false },
    { id: 5,  sport: '🚴',  title: 'Ciclism 200km Moldova',   desc: 'Pedalează 200km pe orice traseu din Moldova în 3 săptămâni.',    participants: 540,  days: 15, progress: 55, joined: false },
    { id: 6,  sport: '🏊',  title: 'Open Water Swim 5km',     desc: 'Înot 5km total în piscine publice în 14 zile.',                  participants: 210,  days: 9,  progress: 38, joined: false },
    { id: 7,  sport: '🏋️',  title: 'Halter Maxim – PR Nou',   desc: 'Bate-ți recordul personal la orice ridicare în 30 de zile.',     participants: 330,  days: 20, progress: 20, joined: false },
    { id: 8,  sport: '🏀',  title: '1000 Aruncări Baschet',   desc: 'Aruncă 1000 de mingi la coș în 30 de zile.',                    participants: 820,  days: 18, progress: 40, joined: false },
    { id: 9,  sport: '🤼',  title: 'Trântă 100 Prize',        desc: 'Câștigă 100 de lupte la antrenament în 2 luni.',                 participants: 210,  days: 45, progress: 35, joined: false },
    { id: 10, sport: '🏉',  title: 'Rugby Fitness Challenge', desc: 'Sprint, tackling bags – 3 sesiuni/săptămână, 6 săptămâni.',     participants: 310,  days: 25, progress: 50, joined: false },
    { id: 11, sport: '🏐',  title: 'Volei 1000 Pase',         desc: 'Exersează 1000 pase cu partener sau la perete în 2 săptămâni.', participants: 440,  days: 10, progress: 62, joined: false },
    { id: 12, sport: '🤼‍♂️', title: 'Lupte Greco-Romane',     desc: 'Completează 50 sesiuni de lupte greco-romane în 3 luni.',       participants: 180,  days: 60, progress: 20, joined: false },
    { id: 13, sport: '🏓',  title: 'Ping Pong 500 Schimburi', desc: 'Joacă 500 de schimburi consecutive fără greșeală.',              participants: 160,  days: 7,  progress: 45, joined: false },
    { id: 14, sport: '🤾',  title: 'Handbal 50 Goluri',       desc: 'Marchează 50 de goluri la antrenamente în 30 de zile.',          participants: 270,  days: 22, progress: 48, joined: false },
    { id: 15, sport: '🛶',  title: 'Caiac 100km pe Nistru',   desc: 'Pedalează 100km pe apă în orice combinație în 4 săptămâni.',     participants: 95,   days: 21, progress: 30, joined: false },
];

export const MEMBERS: Member[] = [
    {
        name: 'Ion Popescu', city: 'Chișinău', sport: 'Box', points: 2340, rank: 'Campion', color: '#1a6fff',
        bio: 'Boxer de performanță cu 8 ani experiență. Antrenez la clubul Box Chișinău și particip la competiții naționale și internaționale.',
        joinedDate: 'Ianuarie 2024', activities: 142, daysActive: 287, challenges: 5,
        achievements: [
            { icon: '🥊', title: 'Campion Național Box 2024',   date: 'Dec 2024' },
            { icon: '🏆', title: '100 Box Rounds Challenge',    date: 'Oct 2024' },
            { icon: '🔥', title: 'Streak 30 Zile Consecutiv',   date: 'Sep 2024' },
            { icon: '⭐', title: 'Top 10 Comunitate',           date: 'Aug 2024' },
        ],
    },
    {
        name: 'Maria Lazăr', city: 'Bălți', sport: 'Atletism', points: 1980, rank: 'Expert', color: '#00b4d8',
        bio: 'Alergătoare pasionată, specializată pe distanțe lungi. Participantă regulată la maratoane din Moldova și România.',
        joinedDate: 'Martie 2024', activities: 98, daysActive: 201, challenges: 3,
        achievements: [
            { icon: '🏅', title: 'Maraton Chișinău 2025 – Top 10', date: 'Apr 2025' },
            { icon: '🌟', title: '100 Km într-o Lună',             date: 'Feb 2025' },
            { icon: '🔥', title: 'Streak 21 Zile',                 date: 'Nov 2024' },
        ],
    },
    {
        name: 'Dumitru Rusu', city: 'Chișinău', sport: 'Judo', points: 3100, rank: 'Maestru', color: '#7209b7',
        bio: 'Judoka cu 12 ani de experiență. Antrenor al lotului național U23 și participant la competiții europene.',
        joinedDate: 'Octombrie 2023', activities: 230, daysActive: 415, challenges: 8,
        achievements: [
            { icon: '🥋', title: 'Maestru al Sportului – Judo',      date: 'Ian 2024' },
            { icon: '🏆', title: 'Campion Național Judo U23',        date: 'Mar 2024' },
            { icon: '🌍', title: 'Reprezentant Internațional',       date: 'Iun 2024' },
            { icon: '💪', title: '200 Zile Activ pe Platformă',      date: 'Mai 2024' },
            { icon: '⭐', title: 'Locul 1 – Clasament Comunitate',   date: 'Dec 2024' },
        ],
    },
    {
        name: 'Alina Vrabie', city: 'Orhei', sport: 'Înot', points: 1750, rank: 'Avansat', color: '#f72585',
        bio: 'Înotătoare cu pasiune pentru competiții. Specializată pe stil liber și spate, antrenamente zilnice la Bazinul Olimpic.',
        joinedDate: 'Iunie 2024', activities: 87, daysActive: 158, challenges: 2,
        achievements: [
            { icon: '🏊', title: 'Record Personal 100m Liber',        date: 'Aug 2024' },
            { icon: '🏅', title: 'Locul 3 – Aqua Moldova 2025',       date: 'Iun 2025' },
            { icon: '🌊', title: 'Open Water 5km Completat',          date: 'Sep 2024' },
        ],
    },
    {
        name: 'Sergiu Ciobanu', city: 'Chișinău', sport: 'Haltere', points: 2200, rank: 'Campion', color: '#06d6a0',
        bio: 'Halterofil de performanță, specializat în categoria -73kg. Antrenamente zilnice cu focus pe putere maximă și tehnică.',
        joinedDate: 'Februarie 2024', activities: 156, daysActive: 298, challenges: 4,
        achievements: [
            { icon: '🏋️', title: 'Record Național Haltere -73kg',    date: 'Nov 2024' },
            { icon: '🏆', title: 'Campion Republican 2024',           date: 'Oct 2024' },
            { icon: '💪', title: '50 Recorduri Personale Depășite',   date: 'Sep 2024' },
            { icon: '🔥', title: 'Antrenament 90 Zile Consecutiv',   date: 'Aug 2024' },
        ],
    },
    {
        name: 'Vasile Moraru', city: 'Tiraspol', sport: 'Volei', points: 1400, rank: 'Intermediar', color: '#ff9100',
        bio: 'Jucător de volei amator, căpitanul echipei clubului local din Tiraspol. Organizează meciuri amicale și sesiuni de antrenament.',
        joinedDate: 'August 2024', activities: 54, daysActive: 103, challenges: 2,
        achievements: [
            { icon: '🏐', title: '1000 Pase Challenge',              date: 'Oct 2024' },
            { icon: '🤝', title: 'Căpitan Echipă Club',              date: 'Sep 2024' },
            { icon: '⭐', title: '30 Zile Volei Daily',              date: 'Nov 2024' },
        ],
    },
    {
        name: 'Elena Bălan', city: 'Ungheni', sport: 'Handbal', points: 1650, rank: 'Avansat', color: '#ff4d6d',
        bio: 'Handbalista cu 6 ani în echipa locală din Ungheni. Extremă stânga, specializată în contraatacuri rapide.',
        joinedDate: 'Mai 2024', activities: 79, daysActive: 134, challenges: 3,
        achievements: [
            { icon: '🤾', title: '50 Goluri Challenge Completat',    date: 'Nov 2024' },
            { icon: '🏅', title: 'MVP Sezon Local 2024',             date: 'Dec 2024' },
            { icon: '🔥', title: 'Streak 14 Zile Activ',             date: 'Oct 2024' },
        ],
    },
    {
        name: 'Andrei Grama', city: 'Chișinău', sport: 'Rugby', points: 2800, rank: 'Maestru', color: '#4361ee',
        bio: 'Jucător de rugby la nivel de performanță. Centru în echipa națională U21, combină viteza cu forța fizică.',
        joinedDate: 'Noiembrie 2023', activities: 198, daysActive: 356, challenges: 6,
        achievements: [
            { icon: '🏉', title: 'Rugby Fitness Challenge',          date: 'Dec 2024' },
            { icon: '🏆', title: 'Finalist Campionat Național',      date: 'Nov 2024' },
            { icon: '⭐', title: '150 Activități Înregistrate',      date: 'Oct 2024' },
            { icon: '💪', title: 'Căpitan Echipă Națională U21',     date: 'Sep 2024' },
        ],
    },
    {
        name: 'Tudor Cojocaru', city: 'Chișinău', sport: 'Ciclism', points: 1500, rank: 'Avansat', color: '#f4a261',
        bio: 'Ciclist pasionat de tururi lungi prin Moldova și România. Organizator al grupului Night Ride Chișinău.',
        joinedDate: 'Iulie 2024', activities: 63, daysActive: 112, challenges: 3,
        achievements: [
            { icon: '🚴', title: 'Tura Vinului 2025',                date: 'Mai 2025' },
            { icon: '🌍', title: '200km Moldova Challenge',           date: 'Oct 2024' },
            { icon: '🗺️', title: '1.000 Km Pedalați Total',           date: 'Dec 2024' },
        ],
    },
    {
        name: 'Cristina Popa', city: 'Orhei', sport: 'Tenis de Masă', points: 1200, rank: 'Intermediar', color: '#e63946',
        bio: 'Jucătoare de tenis de masă de 4 ani. Participă la turnee locale și antrenează copiii din cartier în weekenduri.',
        joinedDate: 'Septembrie 2024', activities: 41, daysActive: 78, challenges: 2,
        achievements: [
            { icon: '🏓', title: '500 Schimburi Consecutive',        date: 'Nov 2024' },
            { icon: '🥈', title: 'Locul 2 – Turneu Local Orhei',    date: 'Oct 2024' },
            { icon: '⭐', title: 'Prima Provocare Completată',       date: 'Oct 2024' },
        ],
    },
    {
        name: 'Radu Morari', city: 'Ungheni', sport: 'Lupte', points: 980, rank: 'Intermediar', color: '#6a0572',
        bio: 'Wrestler amator cu 2 ani experiență în lupte greco-romane. Antrenamente de 3 ori pe săptămână la sala de lupte.',
        joinedDate: 'Octombrie 2024', activities: 28, daysActive: 52, challenges: 1,
        achievements: [
            { icon: '🤼‍♂️', title: '30 Sesiuni Lupte Greco-Romane', date: 'Dec 2024' },
            { icon: '🌟', title: 'Prima Competiție Oficială',        date: 'Nov 2024' },
            { icon: '⭐', title: 'Cont Activ – Prima Lună',          date: 'Nov 2024' },
        ],
    },
    {
        name: 'Mihai Botnaru', city: 'Chișinău', sport: 'Rugby', points: 1860, rank: 'Avansat', color: '#2dc653',
        bio: 'Jucător de rugby de 5 ani, pilier în echipa clubului local. Combină antrenamentele de forță cu cele de viteză.',
        joinedDate: 'Aprilie 2024', activities: 112, daysActive: 189, challenges: 4,
        achievements: [
            { icon: '🏉', title: 'Rugby Fitness Challenge',          date: 'Dec 2024' },
            { icon: '🏅', title: 'Cel Mai Bun Jucător – Sezon 2024', date: 'Nov 2024' },
            { icon: '💪', title: '100 Activități Înregistrate',      date: 'Oct 2024' },
            { icon: '🔥', title: 'Streak 45 Zile Consecutiv',        date: 'Sep 2024' },
        ],
    },
];

// ─────────────────────────────────────────────
// POSTURI MEMBRI
// ─────────────────────────────────────────────

export const MEMBER_POSTS: Post[] = [
    { id: 1001, author: 'Ion Popescu',    color: '#1a6fff', sport: 'Box',           time: 'acum 2 ore',   content: 'Antrenament intens azi — 8 runde sparring + 500 de sărituri cu coarda. Pregătire serioasă pentru campionatul național. 💪🥊',                                          likes: 34, comments: 7,  liked: false },
    { id: 1002, author: 'Ion Popescu',    color: '#1a6fff', sport: 'Box',           time: 'ieri',         content: 'Felicitări tuturor boxerilor de la turneul regional! Nivelul a crescut enorm față de anul trecut. Comunitatea noastră se dezvoltă! 🏆',                              likes: 52, comments: 12, liked: false },
    { id: 1003, author: 'Maria Lazăr',    color: '#00b4d8', sport: 'Atletism',      time: 'acum 4 ore',   content: '15km dimineață prin Bălți — timp personal nou: 1h 12min. Pregătirea pentru maraton merge excelent! 🏃‍♀️',                                                            likes: 41, comments: 9,  liked: false },
    { id: 1004, author: 'Maria Lazăr',    color: '#00b4d8', sport: 'Atletism',      time: 'acum 2 zile',  content: 'Sfatul săptămânii: nu sări peste încălzire, oricât de grăbit ești. Corpul tău îți va mulțumi! 💡 Ce rutine de încălzire folosiți?',                                   likes: 63, comments: 18, liked: false },
    { id: 1005, author: 'Dumitru Rusu',   color: '#7209b7', sport: 'Judo',          time: 'acum 1 oră',   content: 'Sesiune de randori cu lotul național U23. Fiecare antrenament este o șansă să devii mai bun. Osu! 🥋',                                                               likes: 67, comments: 15, liked: false },
    { id: 1006, author: 'Dumitru Rusu',   color: '#7209b7', sport: 'Judo',          time: 'acum 3 zile',  content: 'Consecvența bate intensitatea. 30 de minute zilnic > 4 ore o dată pe săptămână. Valabil pentru orice sport! 💡',                                                      likes: 89, comments: 23, liked: false },
    { id: 1007, author: 'Alina Vrabie',   color: '#f72585', sport: 'Înot',          time: 'acum 6 ore',   content: 'Nou record personal la 100m liber — 1:05:40! 🏊‍♀️ Bazinul olimpic e casa mea. Mulțumesc antrenorului pentru noul program de antrenament!',                            likes: 38, comments: 8,  liked: false },
    { id: 1008, author: 'Sergiu Ciobanu', color: '#06d6a0', sport: 'Haltere',       time: 'acum 5 ore',   content: 'Smuls 120kg azi la antrenament — record personal nou! 💪 Categoria -73kg e pregătită pentru campionatul republican. Munca nu minte!',                               likes: 73, comments: 18, liked: false },
    { id: 1009, author: 'Vasile Moraru',  color: '#ff9100', sport: 'Volei',         time: 'acum 2 zile',  content: 'Meci amical câștigat 3-1 ieri! Comunicarea pe teren face toată diferența. Cine vrea să se alăture antrenamentelor noastre din Tiraspol? 🏐',                         likes: 29, comments: 11, liked: false },
    { id: 1010, author: 'Elena Bălan',    color: '#ff4d6d', sport: 'Handbal',       time: 'acum 3 ore',   content: '7 goluri în meciul de ieri! Viteza de contraatac e arma noastră. Mulțumesc fetelor pentru pasele perfecte 🤾‍♀️❤️',                                                    likes: 55, comments: 14, liked: false },
    { id: 1011, author: 'Andrei Grama',   color: '#4361ee', sport: 'Rugby',         time: 'acum 1 oră',   content: 'Sprint interval + saci de tackling azi. Echipa națională U21 se pregătește serios pentru sezonul următor! 🏉💨',                                                       likes: 61, comments: 16, liked: false },
    { id: 1012, author: 'Tudor Cojocaru', color: '#f4a261', sport: 'Ciclism',       time: 'acum 8 ore',   content: '80km pe traseul Chișinău–Cricova–Orhei azi. Peisajele Moldovei pe bicicletă sunt unice! Cine vine la Night Ride săptămâna viitoare? 🚴',                             likes: 44, comments: 19, liked: false },
    { id: 1013, author: 'Mihai Botnaru',  color: '#2dc653', sport: 'Rugby',         time: 'acum 4 ore',   content: 'Ziua 45 de antrenamente consecutive. Pilier trebuie să fie și puternic și rapid — nu există scurtătură! 🏉💪',                                                        likes: 37, comments: 6,  liked: false },
    { id: 1014, author: 'Cristina Popa',  color: '#e63946', sport: 'Tenis de Masă', time: 'ieri',         content: 'Locul 2 la turneul local Orhei! Prima dată pe podium 🥈 Experiența aceasta mă motivează să mă antrenez și mai serios. Mulțumesc celor care m-au susținut!',           likes: 31, comments: 9,  liked: false },
    { id: 1015, author: 'Radu Morari',    color: '#6a0572', sport: 'Lupte',         time: 'acum 2 zile',  content: 'Prima mea competiție oficială de lupte greco-romane! Nu am câștigat, dar am învățat enorm. Asta e adevăratul spirit sportiv 🤼‍♂️',                                      likes: 24, comments: 7,  liked: false },
];
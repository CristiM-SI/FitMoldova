// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type Sport =
    | 'Fotbal' | 'Trântă' | 'Lupte' | 'Box' | 'Judo'
    | 'Baschet' | 'Rugby' | 'Caiac-Canoe' | 'Haltere' | 'Volei'
    | 'Atletism' | 'Tenis de Masă' | 'Ciclism' | 'Înot' | 'Handbal';

export type FeedTab = 'feed' | 'challenges' | 'members';

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

export interface Member {
    name:   string;
    city:   string;
    sport:  Sport;
    points: number;
    rank:   string;
    color:  string;
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
    { name: 'Ion Popescu',    city: 'Chișinău', sport: 'Box',           points: 2340, rank: 'Campion',     color: '#1a6fff' },
    { name: 'Maria Lazăr',    city: 'Bălți',    sport: 'Atletism',      points: 1980, rank: 'Expert',      color: '#00b4d8' },
    { name: 'Dumitru Rusu',   city: 'Chișinău', sport: 'Judo',          points: 3100, rank: 'Maestru',     color: '#7209b7' },
    { name: 'Alina Vrabie',   city: 'Orhei',    sport: 'Înot',          points: 1750, rank: 'Avansat',     color: '#f72585' },
    { name: 'Sergiu Ciobanu', city: 'Chișinău', sport: 'Haltere',       points: 2200, rank: 'Campion',     color: '#06d6a0' },
    { name: 'Vasile Moraru',  city: 'Tiraspol', sport: 'Volei',         points: 1400, rank: 'Intermediar', color: '#ff9100' },
    { name: 'Elena Bălan',    city: 'Ungheni',  sport: 'Handbal',       points: 1650, rank: 'Avansat',     color: '#ff4d6d' },
    { name: 'Andrei Grama',   city: 'Chișinău', sport: 'Rugby',         points: 2800, rank: 'Maestru',     color: '#4361ee' },
    { name: 'Tudor Cojocaru', city: 'Chișinău', sport: 'Ciclism',       points: 1500, rank: 'Avansat',     color: '#f4a261' },
    { name: 'Cristina Popa',  city: 'Orhei',    sport: 'Tenis de Masă', points: 1200, rank: 'Intermediar', color: '#e63946' },
    { name: 'Radu Morari',    city: 'Ungheni',  sport: 'Lupte',         points: 980,  rank: 'Intermediar', color: '#6a0572' },
    { name: 'Mihai Botnaru',  city: 'Chișinău', sport: 'Rugby',         points: 1860, rank: 'Avansat',     color: '#2dc653' },
];

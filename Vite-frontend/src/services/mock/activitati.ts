export interface Activitate {
    id: number;
    name: string;
    type: string;
    distance: string;
    duration: string;
    calories: number;
    date: string;
}

export const MOCK_ACTIVITATI: Activitate[] = [
    {
        id: 1,
        name: 'Alergare matinală în Parcul Valea Morilor',
        type: 'Alergare',
        distance: '5 km',
        duration: '30 min',
        calories: 320,
        date: '2025-04-01',
    },
    {
        id: 2,
        name: 'Ciclism pe traseul Chișinău – Vadul lui Vodă',
        type: 'Ciclism',
        distance: '22 km',
        duration: '1h 15min',
        calories: 580,
        date: '2025-04-02',
    },
    {
        id: 3,
        name: 'Plimbare activă prin Grădina Botanică',
        type: 'Mers pe jos',
        distance: '3 km',
        duration: '45 min',
        calories: 150,
        date: '2025-04-03',
    },
    {
        id: 4,
        name: 'Antrenament HIIT acasă',
        type: 'Fitness',
        distance: '—',
        duration: '25 min',
        calories: 400,
        date: '2025-04-04',
    },
    {
        id: 5,
        name: 'Yoga de seară – relaxare',
        type: 'Yoga',
        distance: '—',
        duration: '40 min',
        calories: 120,
        date: '2025-04-05',
    },
    {
        id: 6,
        name: 'Înot la bazinul Atlant',
        type: 'Înot',
        distance: '1.5 km',
        duration: '45 min',
        calories: 450,
        date: '2025-04-06',
    },
    {
        id: 7,
        name: 'Antrenament forță la sala Olimp',
        type: 'Fitness',
        distance: '—',
        duration: '1h 10min',
        calories: 520,
        date: '2025-04-07',
    },
    {
        id: 8,
        name: 'Alergare de seară pe bulevardul Ștefan cel Mare',
        type: 'Alergare',
        distance: '8 km',
        duration: '48 min',
        calories: 510,
        date: '2025-04-08',
    },
    {
        id: 9,
        name: 'Trekking pe traseul Orheiul Vechi',
        type: 'Drumeție',
        distance: '12 km',
        duration: '3h 00min',
        calories: 680,
        date: '2025-04-09',
    },
    {
        id: 10,
        name: 'Stretching & mobilitate dimineața',
        type: 'Yoga',
        distance: '—',
        duration: '20 min',
        calories: 70,
        date: '2025-04-10',
    },
];

export const TIPURI_ACTIVITATI = [
    'Toate',
    'Alergare',
    'Ciclism',
    'Fitness',
    'Înot',
    'Mers pe jos',
    'Yoga',
    'Drumeție',
];

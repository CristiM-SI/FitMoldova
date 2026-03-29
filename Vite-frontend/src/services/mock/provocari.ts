export interface Provocare {
    id: number;
    name: string;
    description: string;
    participants: number;
    duration: string;
    difficulty: 'Ușor' | 'Mediu' | 'Greu';
    progress?: number;
}

export const MOCK_PROVOCARI: Provocare[] = [
    {
        id: 1,
        name: '100 km în Martie',
        description: 'Aleargă 100 km pe parcursul lunii martie. Oriunde, oricând!',
        participants: 312,
        duration: '30 zile',
        difficulty: 'Mediu',
    },
    {
        id: 2,
        name: 'Streak de 7 zile',
        description: 'Fii activ 7 zile consecutive. Minimum 30 minute pe zi.',
        participants: 891,
        duration: '7 zile',
        difficulty: 'Ușor',
    },
    {
        id: 3,
        name: '50 km Ciclism',
        description: 'Parcurge 50 km pe bicicletă într-o săptămână.',
        participants: 156,
        duration: '7 zile',
        difficulty: 'Mediu',
    },
    {
        id: 4,
        name: '10.000 de pași zilnic',
        description: 'Atinge 10.000 de pași în fiecare zi timp de 2 săptămâni.',
        participants: 567,
        duration: '14 zile',
        difficulty: 'Ușor',
    },
    {
        id: 5,
        name: 'Maratonul Lunar',
        description: 'Aleargă distanța unui maraton (42.2 km) cumulat pe parcursul unei luni.',
        participants: 234,
        duration: '30 zile',
        difficulty: 'Greu',
    },
    {
        id: 6,
        name: 'Yoga 30 zile',
        description: 'Practică yoga în fiecare zi timp de 30 de zile. Minimum 15 minute.',
        participants: 189,
        duration: '30 zile',
        difficulty: 'Mediu',
    },
];
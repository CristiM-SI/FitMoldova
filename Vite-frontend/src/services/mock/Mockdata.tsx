import type { RecommendedActivity } from '../../types/Activity';  // ← type import

// Utilizatori prestabiliți pentru autentificare mock
export interface MockUser {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar: string;
    registeredAt: string;
    isAdmin?: boolean;
}

export const MOCK_USERS: MockUser[] = [
    {
        id: 1,
        username: "ion.popescu",
        firstName: "Ion",
        lastName: "Popescu",
        email: "ion.popescu@fitmoldova.md",
        password: "FitMold202445!!!@@@@",   // 16 chars, 6 litere, 6 cifre, 4 speciale
        avatar: "IP",
        registeredAt: "2024-01-15T10:00:00.000Z",
    },
    {
        id: 2,
        username: "maria.ionescu",
        firstName: "Maria",
        lastName: "Ionescu",
        email: "maria.ionescu@fitmoldova.md",
        password: "SportLife202445!!!@@",
        avatar: "MI",
        registeredAt: "2024-02-20T09:00:00.000Z",
    },
    {
        id: 3,
        username: "alex.rusu",
        firstName: "Alexandru",
        lastName: "Rusu",
        email: "alex.rusu@fitmoldova.md",
        password: "Fitness202445!!!@@@@",
        avatar: "AR",
        registeredAt: "2024-03-10T08:00:00.000Z",
    },
    {
        id: 4,
        username: "admin.fitmoldova",
        firstName: "Admin",
        lastName: "FitMoldova",
        email: "admin@fitmoldova.md",
        password: "Admin2024@@@@1234",
        avatar: "AF",
        registeredAt: "2024-01-01T00:00:00.000Z",
        isAdmin: true,
    },
];
export const RECOMMENDED_ACTIVITIES: RecommendedActivity[] = [
    {
        id: 1,
        title: 'Alergare Matinală în Parc',
        type: 'running',
        description: 'Alergare ușoară de 5 km prin parcul central. Perfect pentru începători.',
        estimatedDuration: 30,
        estimatedCalories: 250,
        estimatedDistance: 5,
        icon: '🏃',
        difficulty: 'Ușor',
    },
    {
        id: 2,
        title: 'Ciclism la Munte',
        type: 'cycling',
        description: 'Traseu spectaculos de 25 km pe dealuri. Nivel mediu de dificultate.',
        estimatedDuration: 90,
        estimatedCalories: 600,
        estimatedDistance: 25,
        icon: '🚴',
        difficulty: 'Mediu',
    },
    {
        id: 3,
        title: 'Antrenament Full Body',
        type: 'gym',
        description: 'Sesiune intensă de forță cu greutăți. Include squats, deadlifts, bench press.',
        estimatedDuration: 60,
        estimatedCalories: 400,
        icon: '💪',
        difficulty: 'Avansat',
    },
    {
        id: 4,
        title: 'Înot Relaxant',
        type: 'swimming',
        description: 'Înot liber pentru rezistență cardiovasculară. Minim 40 de lungimi.',
        estimatedDuration: 45,
        estimatedCalories: 350,
        estimatedDistance: 1,
        icon: '🏊',
        difficulty: 'Mediu',
    },
    {
        id: 5,
        title: 'Yoga Dimineața',
        type: 'yoga',
        description: 'Sesiune de yoga Vinyasa pentru flexibilitate și echilibru mental.',
        estimatedDuration: 50,
        estimatedCalories: 180,
        icon: '🧘',
        difficulty: 'Ușor',
    },
    {
        id: 6,
        title: 'Alergare Interval (HIIT)',
        type: 'running',
        description: 'Antrenament de viteză: 8 x 400m la ritm rapid cu pauze de recuperare.',
        estimatedDuration: 40,
        estimatedCalories: 450,
        estimatedDistance: 6,
        icon: '🏃',
        difficulty: 'Avansat',
    },
    {
        id: 7,
        title: 'Ciclism Urban',
        type: 'cycling',
        description: 'Tură relaxantă prin oraș, perfect pentru explorare și cardio ușor.',
        estimatedDuration: 60,
        estimatedCalories: 350,
        estimatedDistance: 15,
        icon: '🚴',
        difficulty: 'Ușor',
    },
    {
        id: 8,
        title: 'CrossFit WOD',
        type: 'gym',
        description: 'Workout of the Day: combinație de cardio și forță. Intensitate maximă.',
        estimatedDuration: 45,
        estimatedCalories: 500,
        icon: '💪',
        difficulty: 'Avansat',
    },
];
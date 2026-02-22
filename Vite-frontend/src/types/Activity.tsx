/**
 * Activity Types
 */

export type ActivityType = 'running' | 'cycling' | 'gym' | 'swimming' | 'yoga';

export type DifficultyLevel = 'Ușor' | 'Mediu' | 'Avansat';

export interface Activity {
    id: number;
    title: string;
    type: ActivityType;
    duration: number;
    distance?: number;
    calories: number;
    date: string;
    icon: string;
}

export interface RecommendedActivity {
    id: number;
    title: string;
    type: ActivityType;
    description: string;
    estimatedDuration: number;
    estimatedCalories: number;
    estimatedDistance?: number;
    icon: string;
    difficulty: DifficultyLevel;
}
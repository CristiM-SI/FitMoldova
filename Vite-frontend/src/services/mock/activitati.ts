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
    date: '',
  },
  {
    id: 2,
    name: 'Ciclism pe traseul Chișinău – Vadul lui Vodă',
    type: 'Ciclism',
    distance: '22 km',
    duration: '1h 15min',
    calories: 580,
    date: '',
  },
  {
    id: 3,
    name: 'Plimbare activă prin Grădina Botanică',
    type: 'Mers pe jos',
    distance: '3 km',
    duration: '45 min',
    calories: 150,
    date: '',
  },
  {
    id: 4,
    name: 'Antrenament HIIT acasă',
    type: 'Fitness',
    distance: '—',
    duration: '25 min',
    calories: 400,
    date: '',
  },
  {
    id: 5,
    name: 'Yoga de seară – relaxare',
    type: 'Yoga',
    distance: '—',
    duration: '40 min',
    calories: 120,
    date: '',
  },
  {
    id: 6,
    name: 'Înot la bazinul Atlant',
    type: 'Înot',
    distance: '1.5 km',
    duration: '45 min',
    calories: 450,
    date: '',
  },
];

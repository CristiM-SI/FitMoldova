export interface Club {
  id: number;
  name: string;
  icon: string;
  category: 'Alergare' | 'Ciclism' | 'Fitness' | 'Yoga' | 'Înot' | 'Trail';
  location: string;
  members: number;
  description: string;
  schedule: string;
  level: 'Începător' | 'Intermediar' | 'Avansat' | 'Toate';
  rating: number;
  founded: string;
  nextEvent?: string;
}

export const MOCK_CLUBURI: Club[] = [
  {
    id: 1,
    name: 'Runners Chișinău',
    icon: '🏃',
    category: 'Alergare',
    location: 'Parcul Valea Morilor, Chișinău',
    members: 124,
    description: 'Comunitate de alergători din Chișinău. Antrenamente comune în fiecare weekend. Pregătim împreună maratoane și curse locale.',
    schedule: 'Sâmbătă & Duminică, 08:00',
    level: 'Toate',
    rating: 4.8,
    founded: 'Martie 2022',
    nextEvent: 'Alergare de grup – 1 Martie',
  },
  {
    id: 2,
    name: 'CycleMD',
    icon: '🚴',
    category: 'Ciclism',
    location: 'Chișinău – Vadul lui Vodă',
    members: 89,
    description: 'Club de ciclism pentru trasee urbane și rurale. Ture de grup în fiecare duminică, de la 30 la 100 km.',
    schedule: 'Duminică, 07:30',
    level: 'Intermediar',
    rating: 4.6,
    founded: 'Iunie 2021',
    nextEvent: 'Tura Cricova – 8 Martie',
  },
  {
    id: 3,
    name: 'FitGym Bălți',
    icon: '💪',
    category: 'Fitness',
    location: 'Bălți, str. Independenței 42',
    members: 56,
    description: 'Grup de pasionați de fitness din Bălți. Împărtășim rutine, sfaturi de nutriție și motivație zilnică.',
    schedule: 'Luni – Vineri, 18:00',
    level: 'Toate',
    rating: 4.4,
    founded: 'Ianuarie 2023',
  },
  {
    id: 4,
    name: 'Trail Moldova',
    icon: '🌲',
    category: 'Trail',
    location: 'Rezervația Codrii, Moldova',
    members: 73,
    description: 'Club dedicat alergării pe trasee forestiere și off-road. Explorăm cele mai frumoase trasee din Moldova.',
    schedule: 'Sâmbătă, 09:00',
    level: 'Intermediar',
    rating: 4.9,
    founded: 'Septembrie 2021',
    nextEvent: 'Trail Codrii – 15 Martie',
  },
  {
    id: 5,
    name: 'Yoga & Wellness MD',
    icon: '🧘',
    category: 'Yoga',
    location: 'Parcul Dendrarium, Chișinău',
    members: 98,
    description: 'Sesiuni de yoga, meditație și wellness. Practică în aer liber vara și în sală iarna.',
    schedule: 'Marți & Joi, 07:00',
    level: 'Începător',
    rating: 4.7,
    founded: 'Mai 2022',
    nextEvent: 'Yoga în Parc – 10 Martie',
  },
  {
    id: 6,
    name: 'CrossFit Cahul',
    icon: '🏋️',
    category: 'Fitness',
    location: 'Cahul, str. Republicii 15',
    members: 42,
    description: 'Comunitate CrossFit din Cahul. WOD-uri zilnice, competiții locale și spirit de echipă.',
    schedule: 'Luni – Sâmbătă, 17:30',
    level: 'Avansat',
    rating: 4.5,
    founded: 'Noiembrie 2022',
  },
  {
    id: 7,
    name: 'Aqua Chișinău',
    icon: '🏊',
    category: 'Înot',
    location: 'Bazinul Atlant, Chișinău',
    members: 67,
    description: 'Club de înot pentru toate nivelurile. Antrenamente tehnice, rezistență și pregătire pentru competiții.',
    schedule: 'Miercuri & Vineri, 19:00',
    level: 'Toate',
    rating: 4.3,
    founded: 'August 2023',
    nextEvent: 'Competiție Aqua – 22 Martie',
  },
  {
    id: 8,
    name: 'Night Runners MD',
    icon: '🌙',
    category: 'Alergare',
    location: 'Centru, Chișinău',
    members: 45,
    description: 'Alergăm seara prin oraș. Trasee iluminate, atmosferă relaxată și socializare după fiecare sesiune.',
    schedule: 'Miercuri & Vineri, 20:00',
    level: 'Toate',
    rating: 4.6,
    founded: 'Aprilie 2023',
  },
];

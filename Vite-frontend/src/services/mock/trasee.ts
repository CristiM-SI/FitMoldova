import type { Traseu } from '../../types/Route';

export const MOCK_TRASEE: Traseu[] = [
  {
    id: 1,
    name: 'Parcul Valea Morilor - Buiucani',
    type: 'alergare',
    difficulty: 'Ușor',
    distance: 5.2,
    estimatedDuration: 32,
    elevationGain: 45,
    description: 'Traseu circular ideal pentru alergătorii începători prin parcul central al Chișinăului. Poteci bine întreținute, umbrite, cu peisaje pitorești în jurul lacului.',
    region: 'Chișinău',
    surface: 'asfalt',
    isLoop: true,
    bestSeason: 'Primăvară – Toamnă',
    highlights: ['Lacul Valea Morilor', 'Alei umbrite', 'Locuri de odihnă'],
    startPoint: { lat: 47.0205, lng: 28.8252 },
    endPoint:   { lat: 47.0205, lng: 28.8252 },
    icon: '🏃',
    path: [
      { lat: 47.0205, lng: 28.8252 }, // intrare SE parc (lângă Str. Mateevici)
      { lat: 47.0188, lng: 28.8232 }, // alee S lac
      { lat: 47.0178, lng: 28.8208 }, // colț SW parc
      { lat: 47.0178, lng: 28.8178 }, // mal V inferior
      { lat: 47.0190, lng: 28.8150 }, // mal V mijloc
      { lat: 47.0208, lng: 28.8132 }, // mal V lac
      { lat: 47.0228, lng: 28.8125 }, // V parc mijloc
      { lat: 47.0248, lng: 28.8130 }, // mal V superior
      { lat: 47.0262, lng: 28.8148 }, // colț NV lac
      { lat: 47.0272, lng: 28.8170 }, // N parc alee
      { lat: 47.0272, lng: 28.8195 }, // capăt N lac
      { lat: 47.0265, lng: 28.8218 }, // NE lac
      { lat: 47.0252, lng: 28.8235 }, // mal E superior
      { lat: 47.0238, lng: 28.8248 }, // mal E mijloc
      { lat: 47.0222, lng: 28.8255 }, // mal E inferior
      { lat: 47.0208, lng: 28.8255 }, // SE lac
      { lat: 47.0205, lng: 28.8252 }, // revenire start
    ],
  },
  {
    id: 2,
    name: 'Chișinău – Vadul lui Vodă',
    type: 'ciclism',
    difficulty: 'Mediu',
    distance: 22.4,
    estimatedDuration: 75,
    elevationGain: 180,
    description: 'Traseu clasic de ciclism de la marginea Chișinăului până la stațiunea Vadul lui Vodă de pe malul Nistrului. Drumuri forestiere și peisaje rurale deosebite.',
    region: 'Chișinău / Anenii Noi',
    surface: 'mix',
    isLoop: false,
    bestSeason: 'Primăvară – Toamnă',
    highlights: ['Stăuceni', 'Pădure de luncă', 'Malul Nistrului', 'Plaja Vadul lui Vodă'],
    startPoint: { lat: 47.0395, lng: 28.8905 },
    endPoint:   { lat: 47.0892, lng: 29.0782 },
    icon: '🚴',
    path: [
      { lat: 47.0395, lng: 28.8905 }, // IE NE Chișinău (Ciocana)
      { lat: 47.0425, lng: 28.8945 }, // drum spre Stăuceni
      { lat: 47.0462, lng: 28.8988 }, // periferie urbană
      { lat: 47.0498, lng: 28.9032 }, // Stăuceni intrare
      { lat: 47.0530, lng: 28.9078 }, // Stăuceni centru
      { lat: 47.0558, lng: 28.9122 }, // ieșire Stăuceni
      { lat: 47.0582, lng: 28.9172 }, // drum forestier
      { lat: 47.0605, lng: 28.9235 }, // pădure
      { lat: 47.0628, lng: 28.9298 }, // drum cu curbă
      { lat: 47.0652, lng: 28.9368 }, // urcuș ușor
      { lat: 47.0675, lng: 28.9448 }, // platou
      { lat: 47.0700, lng: 28.9532 }, // coborâre spre E
      { lat: 47.0728, lng: 28.9622 }, // vale
      { lat: 47.0755, lng: 28.9718 }, // drum de câmp
      { lat: 47.0782, lng: 28.9825 }, // apropiere vale Nistru
      { lat: 47.0808, lng: 28.9958 }, // serpentine coborâre
      { lat: 47.0832, lng: 29.0105 }, // zonă vilă
      { lat: 47.0852, lng: 29.0282 }, // drum resort
      { lat: 47.0868, lng: 29.0468 }, // intare stațiune
      { lat: 47.0878, lng: 29.0628 }, // alee resort
      { lat: 47.0888, lng: 29.0722 }, // promenadă
      { lat: 47.0892, lng: 29.0782 }, // plajă Nistru – Vadul lui Vodă
    ],
  },
  {
    id: 3,
    name: 'Orheiul Vechi – Trebujeni Trail',
    type: 'trail',
    difficulty: 'Avansat',
    distance: 12.8,
    estimatedDuration: 180,
    elevationGain: 420,
    description: 'Traseu de trail dificil prin canioanele calcaroase ale Orheiului Vechi. Peisaje spectaculoase, mănăstiri rupestre și rivieră cu Nistrul. Ideal pentru trailrunneri experimentați.',
    region: 'Orhei',
    surface: 'potecă',
    isLoop: false,
    bestSeason: 'Primăvară / Toamnă',
    highlights: ['Mănăstirea Rupestră', 'Canioane calcaroase', 'Râul Răut', 'Peșteri naturale'],
    startPoint: { lat: 47.3888, lng: 28.9672 },
    endPoint:   { lat: 47.3598, lng: 28.9848 },
    icon: '🏔️',
    path: [
      { lat: 47.3888, lng: 28.9672 }, // parcare Orheiul Vechi / Butuceni
      { lat: 47.3872, lng: 28.9685 }, // coborâre stâncă
      { lat: 47.3855, lng: 28.9698 }, // potecă de creasta
      { lat: 47.3840, lng: 28.9708 }, // apropiere mânăstire rupestră
      { lat: 47.3822, lng: 28.9703 }, // mânăstire rupestră (Peștera)
      { lat: 47.3805, lng: 28.9715 }, // coborâre spre Răut
      { lat: 47.3785, lng: 28.9728 }, // mal Răut N
      { lat: 47.3762, lng: 28.9740 }, // meander râu
      { lat: 47.3742, lng: 28.9748 }, // potecă de mal
      { lat: 47.3722, lng: 28.9758 }, // luncă Răut
      { lat: 47.3702, lng: 28.9765 }, // la baza stâncii
      { lat: 47.3682, lng: 28.9778 }, // urcuș spre platou
      { lat: 47.3660, lng: 28.9790 }, // potecă prin pădure
      { lat: 47.3638, lng: 28.9805 }, // coborâre Trebujeni
      { lat: 47.3618, lng: 28.9825 }, // intrare sat Trebujeni
      { lat: 47.3598, lng: 28.9848 }, // centru Trebujeni – final
    ],
  },
  {
    id: 4,
    name: 'Codrii – Rezervația Naturală',
    type: 'drumeție',
    difficulty: 'Mediu',
    distance: 8.5,
    estimatedDuration: 150,
    elevationGain: 230,
    description: 'Drumeție prin inima Codrilor Moldovei, cea mai mare pădure din țară. Aer curat, flora și fauna diverse, poteci marcate. Traseu circular cu puncte de belvedere.',
    region: 'Strășeni / Lozova',
    surface: 'potecă',
    isLoop: true,
    bestSeason: 'Mai – Octombrie',
    highlights: ['Rezervația Codrii', 'Stejari centenari', 'Belvedere panoramic', 'Izvoare naturale'],
    startPoint: { lat: 47.0875, lng: 28.4318 },
    endPoint:   { lat: 47.0875, lng: 28.4318 },
    icon: '🌲',
    path: [
      { lat: 47.0875, lng: 28.4318 }, // centru vizitatori Rezervație Codrii
      { lat: 47.0898, lng: 28.4282 }, // potecă spre NV
      { lat: 47.0922, lng: 28.4245 }, // pădure de fag
      { lat: 47.0945, lng: 28.4208 }, // urcuș dealuri
      { lat: 47.0962, lng: 28.4172 }, // creastă V
      { lat: 47.0975, lng: 28.4142 }, // belvedere V
      { lat: 47.0968, lng: 28.4108 }, // coborâre spre N
      { lat: 47.0952, lng: 28.4075 }, // vale cu izvor
      { lat: 47.0932, lng: 28.4058 }, // potecă N
      { lat: 47.0908, lng: 28.4068 }, // viraj E
      { lat: 47.0888, lng: 28.4088 }, // drum forestier
      { lat: 47.0865, lng: 28.4115 }, // coborâre SE
      { lat: 47.0845, lng: 28.4152 }, // trecere pârâu
      { lat: 47.0838, lng: 28.4195 }, // urcuș mic
      { lat: 47.0848, lng: 28.4242 }, // viraj spre centru
      { lat: 47.0862, lng: 28.4285 }, // alee finală
      { lat: 47.0875, lng: 28.4318 }, // revenire centru vizitatori
    ],
  },
  {
    id: 5,
    name: 'Cricova – Chișinău (Ciclism)',
    type: 'ciclism',
    difficulty: 'Ușor',
    distance: 14.6,
    estimatedDuration: 50,
    elevationGain: 95,
    description: 'Traseu de ciclism debutant de la renumita localitate Cricova până în centrul Chișinăului. Drumuri bune, pantă ușoară, potrivit pentru familii și cicliști începători.',
    region: 'Chișinău / Cricova',
    surface: 'asfalt',
    isLoop: false,
    bestSeason: 'Tot anul',
    highlights: ['Cramele Cricova', 'Peisaje viticole', 'Via Ghidighici', 'Intrare în Chișinău'],
    startPoint: { lat: 47.1382, lng: 28.8558 },
    endPoint:   { lat: 47.0068, lng: 28.8572 },
    icon: '🚴',
    path: [
      { lat: 47.1382, lng: 28.8558 }, // Cricova – cramele
      { lat: 47.1358, lng: 28.8548 }, // ieșire Cricova spre S
      { lat: 47.1328, lng: 28.8545 }, // drum cu vie
      { lat: 47.1295, lng: 28.8552 }, // coborâre ușoară
      { lat: 47.1262, lng: 28.8562 }, // câmpii cu viță de vie
      { lat: 47.1228, lng: 28.8568 }, // drum de câmp
      { lat: 47.1192, lng: 28.8572 }, // apropiere Ghidighici
      { lat: 47.1155, lng: 28.8578 }, // zona Ghidighici
      { lat: 47.1115, lng: 28.8582 }, // drum de lângă lac
      { lat: 47.1072, lng: 28.8580 }, // S lac Ghidighici
      { lat: 47.1028, lng: 28.8575 }, // suburbie N Chișinău
      { lat: 47.0985, lng: 28.8572 }, // Rîșcani
      { lat: 47.0938, lng: 28.8568 }, // str. Calea Ieșilor
      { lat: 47.0892, lng: 28.8565 }, // Botanica N
      { lat: 47.0845, lng: 28.8568 }, // bd. Moscovei
      { lat: 47.0795, lng: 28.8570 }, // Ciocana / Botanica
      { lat: 47.0742, lng: 28.8572 }, // centru N
      { lat: 47.0685, lng: 28.8572 }, // centru
      { lat: 47.0625, lng: 28.8572 }, // bd. Ștefan cel Mare
      { lat: 47.0558, lng: 28.8570 }, // Centru S
      { lat: 47.0490, lng: 28.8568 }, // spre Piața Marii Adunări
      { lat: 47.0415, lng: 28.8568 }, // Piața Centrală
      { lat: 47.0340, lng: 28.8568 }, // Ciuflea
      { lat: 47.0248, lng: 28.8570 }, // spre gară
      { lat: 47.0158, lng: 28.8572 }, // Gara Centrală
      { lat: 47.0068, lng: 28.8572 }, // centru / Viaduc – final
    ],
  },
  {
    id: 6,
    name: 'Traseul Nistrului – Dubăsari',
    type: 'ciclism',
    difficulty: 'Avansat',
    distance: 48.0,
    estimatedDuration: 165,
    elevationGain: 350,
    description: 'Traseu lung de ciclism de-a lungul malului Nistrului. Peisaje spectaculoase cu râul, sate tradiționale, podgorie. Recomandat cicliștilor cu experiență și condiție fizică bună.',
    region: 'Anenii Noi / Criuleni / Dubăsari',
    surface: 'mix',
    isLoop: false,
    bestSeason: 'Aprilie – Octombrie',
    highlights: ['Malul Nistrului', 'Sate tradiționale', 'Lacul de acumulare Dubăsari', 'Podgorii'],
    startPoint: { lat: 47.0892, lng: 29.0782 },
    endPoint:   { lat: 47.2652, lng: 29.1508 },
    icon: '🚴',
    path: [
      { lat: 47.0892, lng: 29.0782 }, // Vadul lui Vodă – start pe malul Nistrului
      { lat: 47.0962, lng: 29.0825 }, // drum de mal N
      { lat: 47.1038, lng: 29.0872 }, // meander Nistru
      { lat: 47.1108, lng: 29.0895 }, // sat Puhoi
      { lat: 47.1175, lng: 29.0868 }, // mal stâng
      { lat: 47.1238, lng: 29.0842 }, // curbă râu spre E
      { lat: 47.1298, lng: 29.0878 }, // luncă Nistru
      { lat: 47.1362, lng: 29.0915 }, // zonă împădurită de mal
      { lat: 47.1425, lng: 29.0952 }, // drum de pietriș
      { lat: 47.1488, lng: 29.0985 }, // Mașcăuți direcție
      { lat: 47.1552, lng: 29.1018 }, // urcuș ușor de terasă
      { lat: 47.1612, lng: 29.1052 }, // pod sau vad
      { lat: 47.1672, lng: 29.1088 }, // mal cu stuf
      { lat: 47.1732, lng: 29.1128 }, // meandrare pronunțată
      { lat: 47.1792, lng: 29.1175 }, // Criuleni direcție N
      { lat: 47.1848, lng: 29.1208 }, // sat Onișcani
      { lat: 47.1905, lng: 29.1238 }, // mal înalt
      { lat: 47.1965, lng: 29.1265 }, // vinograd de mal
      { lat: 47.2025, lng: 29.1285 }, // lac de acumulare S
      { lat: 47.2088, lng: 29.1302 }, // digul S lacului
      { lat: 47.2148, lng: 29.1318 }, // lac Dubăsari
      { lat: 47.2208, lng: 29.1335 }, // mal lac E
      { lat: 47.2268, lng: 29.1352 }, // sat Cocieri
      { lat: 47.2328, lng: 29.1375 }, // aproape de baraj
      { lat: 47.2388, lng: 29.1398 }, // zona barajului
      { lat: 47.2448, lng: 29.1418 }, // N baraj
      { lat: 47.2522, lng: 29.1452 }, // Dubăsari S
      { lat: 47.2590, lng: 29.1485 }, // Dubăsari
      { lat: 47.2652, lng: 29.1508 }, // centru Dubăsari – final
    ],
  },
  {
    id: 7,
    name: 'Căpriana – Mănăstire Trail',
    type: 'drumeție',
    difficulty: 'Ușor',
    distance: 4.0,
    estimatedDuration: 70,
    elevationGain: 80,
    description: 'Traseu scurt și accesibil prin pădurea Căpriana până la una din cele mai vechi mănăstiri din Moldova. Potrivit pentru toate vârstele, ideal pentru drumeții de weekend.',
    region: 'Strășeni',
    surface: 'potecă',
    isLoop: false,
    bestSeason: 'Tot anul',
    highlights: ['Mănăstirea Căpriana', 'Pădure de stejar', 'Izvoare', 'Peisaje rurale'],
    startPoint: { lat: 47.1285, lng: 28.5218 },
    endPoint:   { lat: 47.1162, lng: 28.5085 },
    icon: '⛪',
    path: [
      { lat: 47.1285, lng: 28.5218 }, // drum asfaltat – intrare pădure Căpriana
      { lat: 47.1268, lng: 28.5198 }, // potecă sub coronament
      { lat: 47.1250, lng: 28.5178 }, // pădure de stejar
      { lat: 47.1232, lng: 28.5160 }, // ușor la vale
      { lat: 47.1215, lng: 28.5145 }, // izvor în pădure
      { lat: 47.1198, lng: 28.5130 }, // potecă cu rădăcini
      { lat: 47.1182, lng: 28.5115 }, // apropiere mănăstire
      { lat: 47.1168, lng: 28.5102 }, // poartă exterioară
      { lat: 47.1162, lng: 28.5085 }, // Mănăstirea Căpriana – final
    ],
  },
  {
    id: 8,
    name: 'Soroca – Cetate Circuit',
    type: 'alergare',
    difficulty: 'Mediu',
    distance: 9.3,
    estimatedDuration: 58,
    elevationGain: 160,
    description: 'Traseu de alergare prin dealurile din jurul cetății medievale Soroca. Vedere panoramică spre Ucraina peste Nistru. Combinație de asfalt și macadam cu urcușuri moderate.',
    region: 'Soroca',
    surface: 'mix',
    isLoop: true,
    bestSeason: 'Primăvară – Toamnă',
    highlights: ['Cetatea Soroca', 'Panoramă Nistru', 'Deal Lumânării', 'Dealuri pitoreşti'],
    startPoint: { lat: 48.1612, lng: 28.3055 },
    endPoint:   { lat: 48.1612, lng: 28.3055 },
    icon: '🏃',
    path: [
      { lat: 48.1612, lng: 28.3055 }, // Cetatea Soroca – start
      { lat: 48.1628, lng: 28.3032 }, // alee spre Deal Lumânării
      { lat: 48.1645, lng: 28.2998 }, // urcuș deal
      { lat: 48.1658, lng: 28.2968 }, // potecă pe coastă
      { lat: 48.1668, lng: 28.2935 }, // creastă deal V
      { lat: 48.1672, lng: 28.2902 }, // belvedere spre Nistru
      { lat: 48.1665, lng: 28.2875 }, // coborâre N
      { lat: 48.1652, lng: 28.2848 }, // drum macadam N
      { lat: 48.1635, lng: 28.2832 }, // centru Soroca N
      { lat: 48.1615, lng: 28.2825 }, // str. centrală
      { lat: 48.1592, lng: 28.2838 }, // zonă rezidențială S
      { lat: 48.1572, lng: 28.2862 }, // revenire spre Nistru
      { lat: 48.1558, lng: 28.2895 }, // mal Nistru S
      { lat: 48.1552, lng: 28.2928 }, // drum de mal
      { lat: 48.1562, lng: 28.2965 }, // mal spre cetate
      { lat: 48.1578, lng: 28.2998 }, // urcuș cetate
      { lat: 48.1598, lng: 28.3025 }, // curtea cetății
      { lat: 48.1612, lng: 28.3055 }, // revenire Cetatea Soroca
    ],
  },
  {
    id: 9,
    name: 'Bălți – Parcul Pushkin',
    type: 'alergare',
    difficulty: 'Ușor',
    distance: 6.0,
    estimatedDuration: 38,
    elevationGain: 30,
    description: 'Traseu de alergare ușor în cel mai mare parc din nordul Moldovei. Teren plat, alei asfaltate, belvedere, ideal pentru alergătorii care preferă un cadru urban și confortabil.',
    region: 'Bălți',
    surface: 'asfalt',
    isLoop: true,
    bestSeason: 'Tot anul',
    highlights: ['Parcul Pushkin', 'Lacul central Bălți', 'Alei umbrite', 'Teren de sport'],
    startPoint: { lat: 47.7628, lng: 27.9295 },
    endPoint:   { lat: 47.7628, lng: 27.9295 },
    icon: '🏃',
    path: [
      { lat: 47.7628, lng: 27.9295 }, // intrare principală parc
      { lat: 47.7642, lng: 27.9268 }, // alee V parc
      { lat: 47.7658, lng: 27.9245 }, // lac – mal V
      { lat: 47.7672, lng: 27.9240 }, // colț NV lac
      { lat: 47.7685, lng: 27.9252 }, // N lac
      { lat: 47.7695, lng: 27.9272 }, // N-E lac
      { lat: 47.7692, lng: 27.9298 }, // mal E N
      { lat: 47.7682, lng: 27.9322 }, // E lac
      { lat: 47.7668, lng: 27.9338 }, // SE lac
      { lat: 47.7652, lng: 27.9332 }, // S lac
      { lat: 47.7638, lng: 27.9318 }, // S-V lac
      { lat: 47.7628, lng: 27.9305 }, // alee spre intrare
      { lat: 47.7628, lng: 27.9295 }, // revenire start
    ],
  },
  {
    id: 10,
    name: 'Lunca Prutului – Leova',
    type: 'ciclism',
    difficulty: 'Mediu',
    distance: 31.0,
    estimatedDuration: 105,
    elevationGain: 200,
    description: 'Traseu de ciclism de-a lungul râului Prut, din zona Zărneşti până la Leova. Natură sălbatică, peisaje de luncă și maluri de râu. Teren variat cu secțiuni de macadam.',
    region: 'Leova',
    surface: 'macadam',
    isLoop: false,
    bestSeason: 'Aprilie – Octombrie',
    highlights: ['Lunca Prutului', 'Pescuit', 'Sate tradiționale', 'Floră și faună de luncă'],
    startPoint: { lat: 46.8182, lng: 28.2155 },
    endPoint:   { lat: 46.4825, lng: 28.2528 },
    icon: '🚴',
    path: [
      { lat: 46.8182, lng: 28.2155 }, // Zărneşti / mal Prut N
      { lat: 46.8102, lng: 28.2135 }, // drumul de mal coboară S
      { lat: 46.8018, lng: 28.2118 }, // luncă deschisă
      { lat: 46.7938, lng: 28.2128 }, // meander Prut spre E
      { lat: 46.7858, lng: 28.2148 }, // mal cu sălcii
      { lat: 46.7772, lng: 28.2135 }, // luncă inundabilă
      { lat: 46.7688, lng: 28.2118 }, // drum de câmp
      { lat: 46.7602, lng: 28.2108 }, // sat Sărătenii Noi direcție
      { lat: 46.7518, lng: 28.2122 }, // meander pronunțat spre V
      { lat: 46.7438, lng: 28.2145 }, // revenire la mal
      { lat: 46.7355, lng: 28.2158 }, // pădure de luncă
      { lat: 46.7272, lng: 28.2148 }, // pod pietriș
      { lat: 46.7188, lng: 28.2132 }, // deal mic
      { lat: 46.7105, lng: 28.2118 }, // coborâre spre Prut
      { lat: 46.7022, lng: 28.2128 }, // lunca Sîrma
      { lat: 46.6938, lng: 28.2148 }, // meander E
      { lat: 46.6855, lng: 28.2162 }, // Hănăsenii Noi direcție
      { lat: 46.6772, lng: 28.2178 }, // câmpii agricole de mal
      { lat: 46.6688, lng: 28.2188 }, // aproape Cania
      { lat: 46.6602, lng: 28.2202 }, // Cania sat
      { lat: 46.6518, lng: 28.2218 }, // drum de luncă
      { lat: 46.6432, lng: 28.2235 }, // meander S
      { lat: 46.6345, lng: 28.2252 }, // teren inundabil
      { lat: 46.6258, lng: 28.2268 }, // aproape Leova
      { lat: 46.6168, lng: 28.2285 }, // periferie N Leova
      { lat: 46.6075, lng: 28.2302 }, // drum Leova N
      { lat: 46.5978, lng: 28.2318 }, // intrare Leova
      { lat: 46.5672, lng: 28.2388 }, // Leova – centru N
      { lat: 46.5268, lng: 28.2462 }, // centru Leova
      { lat: 46.4825, lng: 28.2528 }, // Leova – mal Prut – final
    ],
  },
];

export type { Traseu };

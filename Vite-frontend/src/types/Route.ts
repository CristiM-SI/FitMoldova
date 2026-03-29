export type RouteType = 'alergare' | 'ciclism' | 'drumeție' | 'trail';
export type RouteDifficulty = 'Ușor' | 'Mediu' | 'Avansat';
export type RouteSurface = 'asfalt' | 'macadam' | 'potecă' | 'mix';

export interface RouteCoord {
  lat: number;
  lng: number;
}

export interface Traseu {
  id: number;
  name: string;
  type: RouteType;
  difficulty: RouteDifficulty;
  distance: number;         // km
  estimatedDuration: number; // minute
  elevationGain: number;    // metri
  description: string;
  region: string;
  startPoint: RouteCoord;
  endPoint: RouteCoord;
  path: RouteCoord[];       // coordonate polyline
  highlights: string[];
  surface: RouteSurface;
  icon: string;
  isLoop: boolean;
  bestSeason: string;
}

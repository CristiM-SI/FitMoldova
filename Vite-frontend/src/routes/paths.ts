/**
 * Application Route Paths
 * Centralized route management for type-safe navigation
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  COMMUNITY:  '/community',
  ACTIVITIES: '/activities',
  CHALLENGES: '/challenges',
  EVENTS: '/events',
  ROUTES_MAP: '/routes',
  FORUM: '/forum',
  CLUBS: '/clubs',
  GALLERY: '/gallery',
  FEEDBACK: '/feedback',
  PRICING: '/pricing',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

export const PUBLIC_ROUTES: RoutePath[] = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.PRICING,
];

export const PROTECTED_ROUTES: RoutePath[] = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.ACTIVITIES,
  ROUTES.CHALLENGES,
  ROUTES.EVENTS,
  ROUTES.ROUTES_MAP,
  ROUTES.FORUM,
  ROUTES.CLUBS,
  ROUTES.GALLERY,
  ROUTES.FEEDBACK,
];

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    CONTACT: '/contact',
    ACTIVITIES_PUBLIC: '/activitati',

    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    COMMUNITY:  '/community',
    ACTIVITIES: '/activities',
    CHALLENGES: '/challenges',
    EVENTS: '/events',
    EVENTS_DASHBOARD: '/dashboard/events',
    ROUTES_MAP: '/routes',
    FORUM: '/forum',
    CLUBS: '/clubs',
    GALLERY: '/gallery',
    FEEDBACK: '/feedback',

    ADMIN: '/admin',
    ADMIN_USERS: '/admin/users',
    ADMIN_EVENTS: '/admin/events',
    ADMIN_CLUBS: '/admin/clubs',
    ADMIN_CHALLENGES: '/admin/challenges',
    ADMIN_ACTIVITIES: '/admin/activities',   // ← NOU
    ADMIN_ROUTES: '/admin/routes',
    ADMIN_FEEDBACK: '/admin/feedback',

    FEED: '/feed',
    SAVED: '/saved',
    MESSAGES: '/messages',
    NOTIFICATIONS: '/notifications',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

export const PUBLIC_ROUTES: RoutePath[] = [
    ROUTES.HOME, ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.CONTACT,
];

export const PROTECTED_ROUTES: RoutePath[] = [
    ROUTES.DASHBOARD, ROUTES.PROFILE, ROUTES.ACTIVITIES, ROUTES.CHALLENGES,
    ROUTES.EVENTS_DASHBOARD, ROUTES.ROUTES_MAP, ROUTES.FORUM, ROUTES.CLUBS,
    ROUTES.GALLERY, ROUTES.FEEDBACK,
];
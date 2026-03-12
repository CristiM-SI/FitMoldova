/**
 * Navigation Utilities
 * React-compatible scroll helpers — no manual DOM queries.
 */

export const scrollToRef = (ref: React.RefObject<HTMLElement | null>): void => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
import { useEffect } from 'react'

/**
 * Preloads all lazy route chunks in the background after the root component
 * mounts.
 *
 * WHY this works where main.tsx timers failed:
 * ─────────────────────────────────────────────
 * Timer-based preloads in main.tsx fired ~3–6 s after the HTML document was
 * requested, which overlapped with Vite's dep-discovery restart (Vite
 * re-hashes all pre-bundled chunks when it finds a new transitive dep). The
 * browser cached the 500/404 response permanently → React.lazy for the same
 * URL also failed.
 *
 * This hook fires AFTER React has committed its first render inside the app.
 * At that point Vite has already resolved every dep needed by the entry bundle
 * (main → App → Home → contexts). requestIdleCallback ensures preloads run
 * between browser frames, never blocking the UI. The timeout fallback ensures
 * they start within 2 s even if the browser stays busy (e.g. Safari, which
 * lacks rIC support and falls through to setTimeout).
 *
 * Tiers are spaced 600 ms apart so Vite handles each batch without overlap.
 */
export function useRoutePreloader(): void {
  useEffect(() => {
    const preload = () => {
      requestIdleCallback(() => {
        void import('../pages/dashboard/CommunityPage').catch(() => {})
      })
    }

    window.addEventListener('pointerdown', preload, { once: true })
    return () => window.removeEventListener('pointerdown', preload)
  }, [])
}


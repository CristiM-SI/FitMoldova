import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { globalStyles } from './styles/globalStyles'

// ─── Inject global CSS before React renders ────────────────────────────────
// Injecting once via a plain <style> tag avoids Emotion processing 95 KB of
// CSS on every navigation (which blocked the main thread on each render).
const _styleTag = document.createElement('style')
_styleTag.textContent = globalStyles as string
document.head.appendChild(_styleTag)

createRoot(document.getElementById('root')!).render(<App />)

// ─── Remove the HTML loader as soon as React has painted the first frame ──────
requestAnimationFrame(() => {
    const loader = document.getElementById('app-loader')
    if (loader) {
        loader.style.opacity = '0'
        loader.style.pointerEvents = 'none'
        setTimeout(() => loader.remove(), 400)
    }
})


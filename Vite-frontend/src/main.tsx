import { createRoot } from 'react-dom/client'
import { globalStyles } from './styles/globalStyles'
import App from './App.tsx'

// Inject global styles
const styleEl = document.createElement('style');
styleEl.textContent = globalStyles;
document.head.appendChild(styleEl);

createRoot(document.getElementById('root')!).render(
    <App />
)

// Hide the HTML loading screen once React has mounted
const loader = document.getElementById('app-loader');
if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 500);
}

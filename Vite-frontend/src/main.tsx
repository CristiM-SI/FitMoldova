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

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'


export default function ScrollToTop() {
    const { pathname } = useLocation()
    const [visible, setVisible] = useState(false)

    // Scroll to top on every route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
    }, [pathname])

    // Show button when scrolled down more than 300px
    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <button
            className={`scroll-to-top${visible ? ' scroll-to-top--visible' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
        >
            ↑
        </button>
    )
}

import { useEffect, useState, useRef } from 'react'
import { useLocation } from '@tanstack/react-router'

export default function ScrollToTop() {
    const { pathname } = useLocation()
    const [visible, setVisible] = useState(false)
    const rafRef = useRef<number | null>(null)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
    }, [pathname])

    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current !== null) return
            rafRef.current = requestAnimationFrame(() => {
                setVisible(window.scrollY > 300)
                rafRef.current = null
            })
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', onScroll)
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        }
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
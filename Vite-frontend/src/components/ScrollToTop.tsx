import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { tokens } from '../themes/theme'

export default function ScrollToTop() {
    const { pathname } = useLocation()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }, [pathname])

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <IconButton
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            sx={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 1030,
                width: 48,
                height: 48,
                borderRadius: '9999px',
                border: 'none',
                background: tokens.gradientPrimary,
                color: '#fff',
                fontSize: '1.25rem',
                lineHeight: 1,
                cursor: 'pointer',
                boxShadow: tokens.shadowPrimary,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                pointerEvents: visible ? 'auto' : 'none',
                transition: `opacity ${tokens.transitionBase}, transform ${tokens.transitionBase}`,
                '&:hover': {
                    background: tokens.gradientSecondary,
                    boxShadow: '0 8px 24px rgba(255, 107, 0, 0.4)',
                    transform: 'translateY(-2px)',
                },
                '&:active': {
                    transform: 'translateY(0)',
                },
            }}
        >
            <KeyboardArrowUpIcon />
        </IconButton>
    )
}

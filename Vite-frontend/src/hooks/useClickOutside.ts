import { useEffect, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    onClickOutside: () => void,
) {
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClickOutside();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [ref, onClickOutside]);
}
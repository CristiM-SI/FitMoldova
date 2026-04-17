import { useEffect, useState } from 'react';
import { clubApi, type ClubDto } from '../services/API/clubApi';
import { useAuth } from '../context/AuthContext';

/**
 * Hook care preia cluburile userului curent din backend (N-N via ClubMembers).
 * Înlocuiește vechiul `cluburiJoined` din DashboardDataContext.
 *
 * Returnează { clubs, count, loading, refetch } — count e dimensiunea listei,
 * util pentru statisticile din Dashboard fără a mai atinge localStorage.
 */
export function useUserClubs() {
    const { user } = useAuth();
    const [clubs, setClubs]     = useState<ClubDto[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchIt = async () => {
        if (!user?.id) { setClubs([]); return; }
        setLoading(true);
        try {
            const data = await clubApi.getUserClubs(user.id);
            setClubs(data ?? []);
        } catch {
            setClubs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        if (!user?.id) { setClubs([]); return; }

        setLoading(true);
        clubApi.getUserClubs(user.id)
            .then(data => { if (!cancelled) setClubs(data ?? []); })
            .catch(() => { if (!cancelled) setClubs([]); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [user?.id]);

    return { clubs, count: clubs.length, loading, refetch: fetchIt };
}

import { useContext } from 'react';
import { DashboardDataContext, type DashboardApiState } from './DashboardDataContext';

export const useDashboardData = (): DashboardApiState => {
    const ctx = useContext(DashboardDataContext);
    if (!ctx) throw new Error('useDashboardData must be used within DashboardDataProvider');
    return ctx;
};

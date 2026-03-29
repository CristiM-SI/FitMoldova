import { useContext } from 'react';
import { DashboardDataContext } from './DashboardDataContext';
import type { DashboardDataContextType } from './DashboardDataContext';

export const useDashboardData = (): DashboardDataContextType => {
    const ctx = useContext(DashboardDataContext);
    if (!ctx) throw new Error('useDashboardData must be used within DashboardDataProvider');
    return ctx;
};

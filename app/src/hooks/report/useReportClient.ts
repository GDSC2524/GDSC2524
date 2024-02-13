import { IReportClient } from '@/models';
import { ReportApiClient } from '@/utils';
import { useMemo } from 'react';

/** Hook to abstract loading a single report */
export const useReportClient = (): IReportClient => {
    const reportClient = useMemo<IReportClient>(() => new ReportApiClient(), []);

    return reportClient;
};

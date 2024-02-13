import { IReport } from '@/models';
import { isUndefined, useEffectAsync } from '@/utils';
import { useCallback, useState } from 'react';
import { useReportClient } from './useReportClient';

export type UseReportResult = {
    /** Report */
    report: IReport | undefined;
    /** Whether report is loading */
    isLoading: boolean;
    /** Function to refresh the report */
    refresh: () => void;
    /** Function to update the report */
    updateReport: (updatedReport: IReport) => Promise<void>;
    /** Whether report update is submitting */
    isSubmitting: boolean;
};

/**
 * Hook to load and interact with a single report
 * By using a hook for this common operation, we can avoid redundant code
 * If we add additional features (deleting, error handling, etc.) all pages will benefit
 * at the same time!
 */
export const useReport = (reportId: string): UseReportResult => {
    const reportClient = useReportClient();

    const [report, setReport] = useState<IReport | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const isLoading = isUndefined(report);

    useEffectAsync(async () => {
        if (!isUndefined(reportId)) {
            const result = await reportClient.getReport(reportId);
            setReport(result);
        }
    }, [reportId]);

    const refresh = useCallback(() => setReport(undefined), [setReport]);

    const updateReport = async (newReport: IReport): Promise<void> => {
        setIsSubmitting(true);
        await reportClient.putReport(newReport);
        setIsSubmitting(false);
        refresh();
    };

    return {
        report,
        isLoading,
        refresh,
        updateReport,
        isSubmitting,
    };
};

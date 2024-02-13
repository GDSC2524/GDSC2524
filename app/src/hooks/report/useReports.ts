import { IReport } from '@/models';
import { isUndefined, useEffectAsync } from '@/utils';
import { useCallback, useState } from 'react';
import { useReportClient } from './useReportClient';
import { GridFilterItem } from '@mui/x-data-grid';
import { ReportFields } from '@/models';

export type UseReportsResult = {
    /** List of reports */
    /** NOTE: reports should NOT be undefined.
     * I'm feeding the reports to MUI Datagrid directly and it does not take undefined values, empty array is good*/
    reports: IReport[];
    /** Whether list is loading */
    isLoading: boolean;
    /** Load messages with filtering or sorting based on any catergory */
    loadReports: () => void;
    /** Refresh messages to update the list with filter or sort applied */
    refreshReports: () => void;
};

// TODO: add sort and filter category in the parameter of useReports()
export const useReports = (
    queryOptions: GridFilterItem[],
    sortOptions?: boolean
): UseReportsResult => {
    const reportClient = useReportClient();
    const [reports, setReports] = useState<IReport[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // TODO: add sort and filter category here
    const loadReports = useCallback(async () => {
        setIsLoading(true);
        try {
            if (queryOptions.length > 0 && queryOptions[0].value !== undefined) {
                /**
                 * field: the report field that was applied a filter, ex: Status, Issues
                 * value: the filter value, ex: Status filter was set to 'Submitted'
                 * */
                const { field, value } = queryOptions[0];

                if (field === ReportFields.Status_Of_Report && value) {
                    const result = await reportClient.listReportsByStatus(value, sortOptions);
                    setReports(result?.reports || []);
                } else if (field === ReportFields.Report_Category && value) {
                    const result = await reportClient.listReportsByCategory(value, sortOptions);
                    setReports(result?.reports || []);
                }
            } else {
                const result = await reportClient.listReports();
                setReports(result?.reports || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [reportClient, setReports, queryOptions, sortOptions]);

    const refreshReports = useCallback(async () => {
        setIsLoading(true);
        setReports([]);
        await loadReports();
        setIsLoading(false);
    }, [loadReports, setReports]);

    // Load automatically on entering page
    useEffectAsync(async () => {
        setIsLoading(true);
        await loadReports();
        setIsLoading(false);
    }, [loadReports]);

    return {
        reports,
        isLoading,
        loadReports,
        refreshReports,
    };
};

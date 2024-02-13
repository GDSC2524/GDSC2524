import { IReport } from '../data';

/** Interface for report clients */
export interface IReportClient {
    /** Create report */
    createReport(report: Omit<IReport, 'reportId'>): Promise<IReport | undefined>;
    /** Get report */
    getReport(reportId: string): Promise<IReport | undefined>;
    /* List all reports */
    listReports(paginationToken?: string): Promise<{
        reports: IReport[];
        paginationToken: string | undefined;
    }>;
    /** Put report */
    putReport(report: IReport): Promise<IReport | undefined>;

    /** Filter by category and/or sort by newest/oldest submitted reports
     * @param {string} category - The category of the reports to filter by, ex: Illegal Dumping
     * @param {boolean} ascending - The sort order by submission time, ex: newest, oldest
     * @param {string} paginationToken - A token to fetch the next set of reports in pagination.
     */
    listReportsByCategory(
        category: string,
        ascending?: boolean,
        paginationToken?: string
    ): Promise<{ reports: IReport[]; paginationToken: string | undefined }>;

    /** Filter by status and/or sort by newest/oldest submitted reports
     * @param {string} status - The status of the reports to filter by, ex: Submitted
     * @param {boolean} ascending - The sort order by submission time, ex: newest, oldest
     * @param {string} paginationToken - A token to fetch the next set of reports in pagination.
     */
    listReportsByStatus(
        status: string,
        ascending?: boolean,
        paginationToken?: string
    ): Promise<{
        reports: IReport[];
        paginationToken: string | undefined;
    }>;
}

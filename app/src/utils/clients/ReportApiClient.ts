import { HttpMethod, IReportClient, IReport } from '@/models';
import { ICreateReportResponse } from '@/pages/api/report/create';
import { IGetReportResponse } from '@/pages/api/report/[id]';
import { IListReportResponse } from '@/pages/api/report/list';

const CREATE_REPORT_ENDPOINT = '/api/report/create';
const GET_REPORT_BASE_ENDPOINT = '/api/report';
const LIST_REPORTS_ENDPOINT = '/api/report/list';
const PUT_REPORT_BASE_ENDPOINT = '/api/report';

/** Client to interact with report API */
// TODO implement error handling
export class ReportApiClient implements IReportClient {
    /** Create report */
    async createReport(report: Omit<IReport, 'reportId'>) {
        const response = await fetch(CREATE_REPORT_ENDPOINT, {
            method: HttpMethod.POST,
            body: JSON.stringify(report),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const json: ICreateReportResponse = await response.json();

        return json.report;
    }

    /** Get report */
    async getReport(reportId: string) {
        const response = await fetch(`${GET_REPORT_BASE_ENDPOINT}/${reportId}`);
        const json: IGetReportResponse = await response.json();

        return json.report;
    }

    /** List all reports */
    async listReports(paginationToken?: string) {
        const response = await fetch(`${LIST_REPORTS_ENDPOINT}?paginationToken=${paginationToken}`);
        const json: IListReportResponse = await response.json();

        return json;
    }
  
    async listReportsByCategory(category: string, ascending?: boolean, paginationToken?: string) {
        const response = await fetch(
            `${LIST_REPORTS_ENDPOINT}?paginationToken=${paginationToken}&category=${category}&ascending=${ascending}`
        );
        const json: IListReportResponse = await response.json();
        return json;
    }

    async listReportsByStatus(status: string, ascending?: boolean, paginationToken?: string) {
        const response = await fetch(
            `${LIST_REPORTS_ENDPOINT}?paginationToken=${paginationToken}&status=${status}&ascending=${ascending}`
        );
        const json: IListReportResponse = await response.json();
        return json;
    }

    /** Put report */
    async putReport(report: IReport) {
        const response = await fetch(`${PUT_REPORT_BASE_ENDPOINT}/${report.reportId}`, {
            method: HttpMethod.PUT,
            body: JSON.stringify(report),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const json: IGetReportResponse = await response.json();

        return json.report;
    }
}

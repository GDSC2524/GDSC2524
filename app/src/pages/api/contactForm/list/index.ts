import {
    HttpMethod,
    IApiErrorResponse,
    IReport,
    INTERNAL_SERVER_ERROR,
    METHOD_NOT_ALLOWED,
    BAD_REQUEST,
} from '@/models';
import { isUndefined } from '@/utils';
import { ReportDbClient } from '@/utils/clients/ReportDbClient';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface IListReportResponse {
    /** Reports */
    reports: IReport[];
    /** Pagination token */
    paginationToken: string | undefined;
}

/**
 * Return a list of report and pagination token upon a LIST request
 *
 * Allowed methods: GET
 *
 * Response: IListReportResponse
 *
 * Potential errors:
 *  - 405: when non-allowed method is used
 *  - 500: internal server error
 */

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IListReportResponse | IApiErrorResponse>
) {
    if (req.method !== HttpMethod.GET) {
        return res.status(405).send({ message: METHOD_NOT_ALLOWED });
    }

    /** Extract and validate queries from request sent by frontend */
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const ascending =
        typeof req.query.ascending === 'string' ? req.query.ascending === 'true' : undefined;

    try {
        const reportClient = new ReportDbClient();
      
        if (status) {
            const { reports, paginationToken } = await reportClient.listReportsByStatus(
                status,
                ascending
            );
            return res.status(200).json({ reports, paginationToken });
        } else if (category) {
            const { reports, paginationToken } = await reportClient.listReportsByCategory(
                category,
                ascending
            );
            return res.status(200).json({ reports, paginationToken });
        } else {
            const { reports, paginationToken } = await reportClient.listReports();
            return res.status(200).json({ reports, paginationToken });
        }
    } catch (err) {
        console.error(err);

        return res.status(500).send({ message: INTERNAL_SERVER_ERROR });
    }
}

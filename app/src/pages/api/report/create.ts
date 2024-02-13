import {
    BAD_REQUEST,
    HttpMethod,
    IApiErrorResponse,
    IReport,
    INTERNAL_SERVER_ERROR,
    METHOD_NOT_ALLOWED,
} from '@/models';
import { ReportDbClient, isUndefined, VALIDATION_SCHEMA } from '@/utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';

export interface ICreateReportResponse {
    report: IReport;
}

/**
 * Create new report
 *
 * Allowed methods: POST
 *
 * Parameters:
 *  - body: IReport, new report to pUT
 *
 * Response: IGetReportResponse
 *
 * Potential errors:
 *  - 400: when body is invalid or not provided
 *  - 405: when non-allowed method is used
 *  - 500: internal server error
 */

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ICreateReportResponse | IApiErrorResponse>
) {
    if (req.method !== HttpMethod.POST) {
        return res.status(405).send({ message: METHOD_NOT_ALLOWED });
    }

    try {
        const reportClient = new ReportDbClient();

        const params = req.body as IReport;

        // Validate the request body against the validation schema
        try {
            await VALIDATION_SCHEMA.partial().validate(params, { abortEarly: false });

            // Check if the 'params.reportId' is undefined
            const isValidRequest = isUndefined(params?.reportId);

            if (!isValidRequest) {
                // Don't store bad data in the database!
                return res.status(400).json({ message: BAD_REQUEST });
            }
        } catch (validationError) {
            // Check if the validationError is an instance of Yup.ValidationError
            if (validationError instanceof Yup.ValidationError) {
                // Validation failed, return error response
                return res.status(400).json({
                    message: BAD_REQUEST,
                    errors: validationError.errors,
                });
            } else {
                return res.status(500).json({
                    message: INTERNAL_SERVER_ERROR,
                });
            }
        }

        const report = await reportClient.createReport(params);

        if (isUndefined(report)) {
            // Report was successfully created but could not be found
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR });
        }

        return res.status(200).json({ report: report! });
    } catch (err) {
        return res.status(500).send({ message: INTERNAL_SERVER_ERROR });
    }
}

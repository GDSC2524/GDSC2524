import { IDBReport, IReportClient, IReport } from '@/models';
import { AttributeValue, DynamoDB } from '@aws-sdk/client-dynamodb';
import { getDynamoDbClient } from '../api';
import { getUuid, isUndefined } from '../common';
import { getStage, getTenant } from '../environment';
import { NOT_FOUND } from '@/models';

const BASE_TABLE_NAME = 'ReportsTable';
const CATEGORY_INDEX_NAME = 'ReportCategoryIndex';
const STATUS_INDEX_NAME = 'ReportStatusIndex';

/** Client to interact with report DynamoDB */
export class ReportDbClient implements IReportClient {
    ddbClient: DynamoDB;

    constructor() {
        this.ddbClient = getDynamoDbClient();
    }

    /** Create report */
    async createReport(
        report: Omit<IReport, 'reportId' | 'statusOfReport' | 'dateTimeOfSubmission'>
    ) {
        const reportId = getUuid();
        const statusOfReport = 'Submitted';
        const dateTimeOfSubmission = new Date().toISOString();

        await this.ddbClient.putItem({
            TableName: getTableName(),
            Item: marshalReport({
                ...report,
                reportId,
                statusOfReport,
                dateTimeOfSubmission,
            }),
        });

        return this.getReport(reportId);
    }

    /** Get report */
    async getReport(reportId: string) {
        const key: Pick<IDBReport, 'ReportID'> = {
            ReportID: {
                S: reportId,
            },
        };

        try {
            const getData = await this.ddbClient.getItem({
                TableName: getTableName(),
                Key: key,
            });

            return unmarshalReport(getData.Item as unknown as IDBReport);
        } catch (error) {
            return Promise.reject({
                status: 404,
                message: NOT_FOUND,
            });
        }
    }

    /** List reports */
    async listReports(paginationToken?: string) {
        // TODO handle pagination

        const scanData = await this.ddbClient.scan({
            TableName: getTableName(),
        });

        return {
            reports: unmarshalReports(scanData.Items as unknown as IDBReport[]),
            paginationToken: undefined,
        };
    }

    /** List reports by category */
    async listReportsByCategory(category: string, ascending?: boolean, paginationToken?: string) {
        // TODO handle pagination

        const queryData = await this.ddbClient.query({
            TableName: getTableName(),
            IndexName: CATEGORY_INDEX_NAME,
            KeyConditionExpression: 'ReportCategory = :category',
            ExpressionAttributeValues: {
                ':category': {
                    S: category,
                },
            },
            ScanIndexForward: ascending ?? false,
        });

        return {
            reports: unmarshalReports(queryData.Items as unknown as IDBReport[]),
            paginationToken: undefined,
        };
    }
    /** List reports by status
     *
     * ascending - true: oldest to newest
     * descending- false: newest to oldest
     */
    async listReportsByStatus(status: string, ascending?: boolean, paginationToken?: string) {
        // TODO handle pagination

        const queryData = await this.ddbClient.query({
            TableName: getTableName(),
            IndexName: STATUS_INDEX_NAME,
            KeyConditionExpression: '#status = :status',
            ExpressionAttributeNames: {
                '#status': 'StatusOfReport',
            },
            ExpressionAttributeValues: {
                ':status': {
                    S: status,
                },
            },
            ScanIndexForward: ascending ?? false,
        });

        return {
            reports: unmarshalReports(queryData.Items as unknown as IDBReport[]),
            paginationToken: undefined,
        };
    }

    /** Put report */
    async putReport(report: IReport) {
        const dateTimeLastEdited = new Date().toISOString();

        await this.ddbClient.putItem({
            TableName: getTableName(),
            Item: marshalReport({ ...report, dateTimeLastEdited }),
        });

        return this.getReport(report.reportId);
    }
}

/** Get DynamoDB table name */
function getTableName(): string {
    return `${BASE_TABLE_NAME}-${getStage()}-${getTenant()}`;
}

/** Unmarshal reports to DynamoDB */
function marshalReport(report: IReport): Record<string, AttributeValue> {
    const marshalledReport: IDBReport = {
        ReportID: {
            S: report!.reportId,
        },
        Name: {
            S: report!.name,
        },
        EmailAddress: {
            S: report!.emailAddress,
        },
        PhoneNumber: {
            S: report!.phoneNumber,
        },
        ReportCategory: {
            S: report!.reportCategory,
        },
        OtherCategory: {
            S: report!.otherCategory,
        },
        Address: {
            S: report!.address,
        },
        GpsCoordinates: {
            S: report!.gpsCoordinates,
        },
        IssueDescription: {
            S: report!.issueDescription,
        },
        Attachments: {
            S: report!.attachments,
        },
        Email: {
            BOOL: report!.email,
        },
        Sms: {
            BOOL: report!.sms,
        },
        StatusOfReport: {
            S: report!.statusOfReport,
        },
        DateTimeOfSubmission: {
            S: report!.dateTimeOfSubmission,
        },
        DateTimeLastEdited: {
            S: report!.dateTimeLastEdited,
        },
    };

    return marshalledReport as unknown as Record<string, AttributeValue>;
}

/** Unmarshal reports from DynamoDB */
function unmarshalReports(reports?: IDBReport[]): IReport[] {
    return reports?.map((report) => unmarshalReport(report)!) || [];
}

/** Unmarshal portfolio from DynamoDB */
function unmarshalReport(report?: IDBReport): IReport | undefined {
    if (isUndefined(report)) {
        return;
    }

    return {
        reportId: report?.ReportID?.S!,
        name: report?.Name?.S!,
        emailAddress: report?.EmailAddress?.S!,
        phoneNumber: report?.PhoneNumber?.S!,
        reportCategory: report?.ReportCategory?.S!,
        otherCategory: report?.OtherCategory?.S!,
        address: report?.Address?.S!,
        gpsCoordinates: report?.GpsCoordinates?.S!,
        issueDescription: report?.IssueDescription?.S!,
        attachments: report?.Attachments?.S!,
        email: report?.Email?.BOOL!,
        sms: report?.Sms?.BOOL!,
        statusOfReport: report?.StatusOfReport?.S!,
        dateTimeOfSubmission: report?.DateTimeOfSubmission?.S!,
        dateTimeLastEdited: report?.DateTimeLastEdited?.S!,
    };
}
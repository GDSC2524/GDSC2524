import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Stage, Tenant } from '../core/enums';
import { BaseStackProps } from '../core/types';

const BASE_TABLE_NAME = 'ReportsTable';

/** DynamoDB table storing reports */
export class ReportsTableStack extends cdk.Stack {
    private stage: Stage;
    private tenant: Tenant;

    constructor(scope: Construct, id: string, props: BaseStackProps) {
        super(scope, id, props);

        this.stage = props.stage;
        this.tenant = props.tenant;

        const reportsTable = new dynamodb.Table(
            this,
            `ReportsTable-${props.stage}-${props.tenant}`,
            {
                tableName: this.getTableName(),
                partitionKey: { name: 'ReportID', type: dynamodb.AttributeType.STRING },
                removalPolicy: cdk.RemovalPolicy.RETAIN,
            }
        );

        /** Filter by status, then within the filtered result, sort by submission date */
        reportsTable.addGlobalSecondaryIndex({
            indexName: 'ReportStatusIndex',
            partitionKey: { name: 'StatusOfReport', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'DateTimeOfSubmission', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        });
        reportsTable.addGlobalSecondaryIndex({
            indexName: 'ReportCategoryIndex',
            partitionKey: { name: 'ReportCategory', type: dynamodb.AttributeType.STRING },
            /** TODO: sortkey can be something esle */
            sortKey: { name: 'DateTimeOfSubmission', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        });
    }

    /** Get DynamoDB table name */
    getTableName(): string {
        return `${BASE_TABLE_NAME}-${this.stage}-${this.tenant}`;
    }
}

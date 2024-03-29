import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Stage, Tenant } from '../core/enums';
import { BaseStackProps } from '../core/types';

const BASE_TABLE_NAME = 'ContactFormsTable';

/** DynamoDB table storing contactForms */
export class ContactFormsTableStack extends cdk.Stack {
    private stage: Stage;
    private tenant: Tenant;

    constructor(scope: Construct, id: string, props: BaseStackProps) {
        super(scope, id, props);

        this.stage = props.stage;
        this.tenant = props.tenant;

        const contactFormsTable = new dynamodb.Table(
            this,
            `ContactFormsTable-${props.stage}-${props.tenant}`,
            {
                tableName: this.getTableName(),
                partitionKey: { name: 'ContactFormID', type: dynamodb.AttributeType.STRING },
                removalPolicy: cdk.RemovalPolicy.RETAIN,
            }
        );

        /** Filter by status, then within the filtered result, sort by submission date */
        contactFormsTable.addGlobalSecondaryIndex({
            indexName: 'ContactFormStatusIndex',
            partitionKey: { name: 'StatusOfContactForm', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'DateTimeOfSubmission', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        });
    }

    /** Get DynamoDB table name */
    getTableName(): string {
        return `${BASE_TABLE_NAME}-${this.stage}-${this.tenant}`;
    }
}

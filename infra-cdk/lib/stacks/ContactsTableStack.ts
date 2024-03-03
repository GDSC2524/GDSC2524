import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Stage, Tenant } from '../core/enums';
import { BaseStackProps } from '../core/types';

const BASE_TABLE_NAME = 'ContactsTable';

/** DynamoDB table storing contacts */
export class ContactsTableStack extends cdk.Stack {
    private stage: Stage;
    private tenant: Tenant;

    constructor(scope: Construct, id: string, props: BaseStackProps) {
        super(scope, id, props);

        this.stage = props.stage;
        this.tenant = props.tenant;

        const contactsTable = new dynamodb.Table(
            this,
            `ContactsTable-${props.stage}-${props.tenant}`,
            {
                tableName: this.getTableName(),
                partitionKey: { name: 'ContactID', type: dynamodb.AttributeType.STRING },
                removalPolicy: cdk.RemovalPolicy.RETAIN,
            }
        );

        /** Filter by status, then within the filtered result, sort by submission date */
        contactsTable.addGlobalSecondaryIndex({
            indexName: 'ContactStatusIndex',
            partitionKey: { name: 'StatusOfContact', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'DateTimeOfSubmission', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        });
    }

    /** Get DynamoDB table name */
    getTableName(): string {
        return `${BASE_TABLE_NAME}-${this.stage}-${this.tenant}`;
    }
}

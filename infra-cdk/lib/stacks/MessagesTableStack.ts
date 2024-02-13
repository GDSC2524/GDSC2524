import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Stage, Tenant } from '../core/enums';
import { BaseStackProps } from '../core/types';

const BASE_TABLE_NAME = 'MessagesTable';

/** DynamoDB table storing guest book messages */
export class MessagesTableStack extends cdk.Stack {
    private stage: Stage;
    private tenant: Tenant;

    constructor(scope: Construct, id: string, props: BaseStackProps) {
        super(scope, id, props);

        this.stage = props.stage;
        this.tenant = props.tenant;

        const messagesTable = new dynamodb.Table(
            this,
            `MessagesTable-${props.stage}-${props.tenant}`,
            {
                tableName: this.getTableName(),
                partitionKey: { name: 'MessageID', type: dynamodb.AttributeType.STRING },
                removalPolicy: cdk.RemovalPolicy.RETAIN,
            }
        );

        messagesTable.addGlobalSecondaryIndex({
            indexName: 'AuthorIndex',
            partitionKey: { name: 'Author', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'MessageID', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        });
    }

    /** Get DynamoDB table name */
    getTableName(): string {
        return `${BASE_TABLE_NAME}-${this.stage}-${this.tenant}`;
    }
}

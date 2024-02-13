import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { getAccessKeyId, getSecretAccessKeyId, getStage } from '../environment';

const DEV_STAGE = 'dev';

/** Gets DynamoDB client */
export function getDynamoDbClient(): DynamoDB {
    const ddbConfig: DynamoDBClientConfig = {
        apiVersion: '2012-08-10',
        region: 'us-east-1',
    };

    // Local dev environment uses access keys in env variables
    if (getStage() === DEV_STAGE) {
        ddbConfig.credentials = {
            accessKeyId: getAccessKeyId()!,
            secretAccessKey: getSecretAccessKeyId()!,
        };
    }

    const ddb = new DynamoDB(ddbConfig);

    return ddb;
}

import { IDBGuestBookMessage, IGuestBookClient, IGuestBookMessage } from '@/models';
import { AttributeValue, DynamoDB } from '@aws-sdk/client-dynamodb';
import { getDynamoDbClient } from '../api';
import { getUuid, isUndefined } from '../common';
import { getStage, getTenant } from '../environment';

const BASE_TABLE_NAME = 'MessagesTable';
const AUTHOR_INDEX_NAME = 'AuthorIndex';

/** Client to interact with guest book DynamoDB */
export class GuestBookDbClient implements IGuestBookClient {
    ddbClient: DynamoDB;

    constructor() {
        this.ddbClient = getDynamoDbClient();
    }

    /** Create guest book message */
    async createMessage(message: Omit<IGuestBookMessage, 'messageId'>) {
        const messageId = getUuid();

        await this.ddbClient.putItem({
            TableName: getTableName(),
            Item: marshalMessage({
                ...message,
                messageId,
            }),
        });

        return this.getMessage(messageId);
    }

    /** Get guest book message */
    async getMessage(messageId: string) {
        const key: Omit<IDBGuestBookMessage, 'Author' | 'Message'> = {
            MessageID: {
                S: messageId,
            },
        };

        const getData = await this.ddbClient.getItem({
            TableName: getTableName(),
            Key: key,
        });

        return unmarshalMessage(getData.Item as unknown as IDBGuestBookMessage);
    }

    /** List guest book messages */
    async listMessages(paginationToken?: string) {
        // TODO handle pagination

        const scanData = await this.ddbClient.scan({
            TableName: getTableName(),
        });

        return {
            messages: unmarshalMessages(scanData.Items as unknown as IDBGuestBookMessage[]),
            paginationToken: undefined,
        };
    }

    /** List guest book messages by author */
    async listMessagesByAuthor(author: string, paginationToken?: string) {
        // TODO handle pagination

        const queryData = await this.ddbClient.query({
            TableName: getTableName(),
            IndexName: AUTHOR_INDEX_NAME,
            KeyConditionExpression: 'Author = :author',
            ExpressionAttributeValues: {
                ':author': {
                    S: author,
                },
            },
        });

        return {
            messages: unmarshalMessages(queryData.Items as unknown as IDBGuestBookMessage[]),
            paginationToken: undefined,
        };
    }

    /** Put guest book message */
    async putMessage(message: IGuestBookMessage) {
        await this.ddbClient.putItem({
            TableName: getTableName(),
            Item: marshalMessage(message),
        });

        return this.getMessage(message.messageId);
    }
}

/** Get DynamoDB table name */
function getTableName(): string {
    return `${BASE_TABLE_NAME}-${getStage()}-${getTenant()}`;
}

/** Unmarshal guest book messages to DynamoDB */
function marshalMessage(message: IGuestBookMessage): Record<string, AttributeValue> {
    const marshalledMessage: IDBGuestBookMessage = {
        MessageID: {
            S: message!.messageId,
        },
        Author: {
            S: message!.author,
        },
        Message: {
            S: message!.message,
        },
    };

    return marshalledMessage as unknown as Record<string, AttributeValue>;
}

/** Unmarshal guest book messages from DynamoDB */
function unmarshalMessages(messages?: IDBGuestBookMessage[]): IGuestBookMessage[] {
    return messages?.map((message) => unmarshalMessage(message)!) || [];
}

/** Unmarshal portfolio from DynamoDB */
function unmarshalMessage(message?: IDBGuestBookMessage): IGuestBookMessage | undefined {
    if (isUndefined(message)) {
        return;
    }

    return {
        messageId: message?.MessageID?.S!,
        author: message?.Author?.S!,
        message: message?.Message?.S!,
    };
}

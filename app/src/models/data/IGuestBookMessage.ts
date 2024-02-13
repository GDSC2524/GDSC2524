/** Guest book message (application model) */
export interface IGuestBookMessage {
    /** Unique message ID */
    messageId: string;
    /** Author name */
    author: string;
    /** Message */
    message: string;
}

/** Guest book messages (DynamoDB model) */
export interface IDBGuestBookMessage {
    /** Unique message ID */
    MessageID: { S: string };
    /** Author name */
    Author: { S: string };
    /** Message */
    Message: { S: string };
}

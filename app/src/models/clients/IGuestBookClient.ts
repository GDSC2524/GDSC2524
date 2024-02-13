import { IGuestBookMessage } from '../data';

/** Interface for guest book clients */
export interface IGuestBookClient {
    /** Create guest book message */
    createMessage(
        message: Omit<IGuestBookMessage, 'messageId'>
    ): Promise<IGuestBookMessage | undefined>;
    /** Get guest book message */
    getMessage(messageId: string): Promise<IGuestBookMessage | undefined>;
    /** List guest book messages */
    listMessages(paginationToken?: string): Promise<{
        messages: IGuestBookMessage[];
        paginationToken: string | undefined;
    }>;
    /** List guest book messages by an author */
    listMessagesByAuthor(
        author: string,
        paginationToken?: string
    ): Promise<{
        messages: IGuestBookMessage[];
        paginationToken: string | undefined;
    }>;
    /** Put guest book message */
    putMessage(message: IGuestBookMessage): Promise<IGuestBookMessage | undefined>;
}

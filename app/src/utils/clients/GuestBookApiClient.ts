import { HttpMethod, IGuestBookClient, IGuestBookMessage } from '@/models';
import { IListGuestBookMessagesResponse } from '@/pages/api/guestbook/list';
import { IListGuestBookMessagesByAuthorResponse } from '@/pages/api/guestbook/list/[author]';
import { IGetGuestBookMessageResponse } from '@/pages/api/guestbook/[id]';

const CREATE_MESSAGE_ENDPOINT = '/api/guestbook/create';
const GET_MESSAGE_BASE_ENDPOINT = '/api/guestbook';
const LIST_MESSAGES_ENDPOINT = '/api/guestbook/list';
const PUT_MESSAGE_BASE_ENDPOINT = '/api/guestbook';

/** Client to interact with guest book API */
// TODO implement error handling
export class GuestBookApiClient implements IGuestBookClient {
    /** Create guest book message */
    async createMessage(message: Omit<IGuestBookMessage, 'messageId'>) {
        const response = await fetch(CREATE_MESSAGE_ENDPOINT, {
            method: HttpMethod.POST,
            body: JSON.stringify(message),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const json: IGetGuestBookMessageResponse = await response.json();

        return json.message;
    }

    /** List guest book messages */
    async getMessage(messageId: string) {
        const response = await fetch(`${GET_MESSAGE_BASE_ENDPOINT}/${messageId}`);
        const json: IGetGuestBookMessageResponse = await response.json();

        return json.message;
    }

    /** List guest book messages */
    async listMessages(paginationToken?: string) {
        const response = await fetch(
            `${LIST_MESSAGES_ENDPOINT}?paginationToken=${paginationToken}`
        );
        const json: IListGuestBookMessagesResponse = await response.json();

        return json;
    }

    /** List guest book messages by author */
    async listMessagesByAuthor(author: string, paginationToken?: string) {
        const response = await fetch(
            `${LIST_MESSAGES_ENDPOINT}/${author}?paginationToken=${paginationToken}`
        );
        const json: IListGuestBookMessagesByAuthorResponse = await response.json();

        return json;
    }

    /** Put guest book message */
    async putMessage(message: IGuestBookMessage) {
        const response = await fetch(`${PUT_MESSAGE_BASE_ENDPOINT}/${message.messageId}`, {
            method: HttpMethod.PUT,
            body: JSON.stringify(message),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const json: IGetGuestBookMessageResponse = await response.json();

        return json.message;
    }
}

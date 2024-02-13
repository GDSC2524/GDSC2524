import {
    HttpMethod,
    IApiErrorResponse,
    IGuestBookMessage,
    INTERNAL_SERVER_ERROR,
    METHOD_NOT_ALLOWED,
} from '@/models';
import { GuestBookDbClient } from '@/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface IListGuestBookMessagesResponse {
    /** Guest book messages */
    messages: IGuestBookMessage[];
    /** Pagination token */
    paginationToken: string | undefined;
}

/**
 * List guest book messages
 *
 * Allowed methods: GET
 *
 * Response: IListGuestBookMessagesResponse
 *
 * Potential errors:
 *  - 405: when non-allowed method is used
 *  - 500: internal server error
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IListGuestBookMessagesResponse | IApiErrorResponse>
) {
    if (req.method !== HttpMethod.GET) {
        return res.status(405).send({ message: METHOD_NOT_ALLOWED });
    }

    try {
        const guestBookClient = new GuestBookDbClient();

        const { messages, paginationToken } = await guestBookClient.listMessages();

        return res.status(200).json({ messages, paginationToken });
    } catch (err) {
        console.error(err);

        return res.status(500).send({ message: INTERNAL_SERVER_ERROR });
    }
}

import {
    BAD_REQUEST,
    HttpMethod,
    IApiErrorResponse,
    IGuestBookMessage,
    INTERNAL_SERVER_ERROR,
    METHOD_NOT_ALLOWED,
} from '@/models';
import { GuestBookDbClient, isUndefined } from '@/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface IListGuestBookMessagesByAuthorResponse {
    /** Messages by the author */
    messages: IGuestBookMessage[];
    /** Pagination token */
    paginationToken: string | undefined;
}

/**
 * List guest book messages by author
 *
 * Allowed methods: GET
 *
 * Parameters:
 *  - author: string, author filter value
 *
 * Response: IListGuestBookMessagesByAuthorResponse
 *
 * Potential errors:
 *  - 400: when author parameter is invalid or not provided
 *  - 405: when non-allowed method is used
 *  - 500: internal server error
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IListGuestBookMessagesByAuthorResponse | IApiErrorResponse>
) {
    if (req.method !== HttpMethod.GET) {
        return res.status(405).send({ message: METHOD_NOT_ALLOWED });
    }

    const { author } = req.query;

    if (isUndefined(author) || typeof author !== 'string') {
        // Do not perform search when author is invalid or not provided
        return res.status(400).send({ message: BAD_REQUEST });
    }

    try {
        const guestBookClient = new GuestBookDbClient();

        const { messages, paginationToken } = await guestBookClient.listMessagesByAuthor(
            author as string
        );

        return res.status(200).json({ messages, paginationToken });
    } catch (err) {
        console.error(err);

        return res.status(500).send({ message: INTERNAL_SERVER_ERROR });
    }
}

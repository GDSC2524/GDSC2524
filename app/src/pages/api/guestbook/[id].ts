import {
    BAD_REQUEST,
    HttpMethod,
    IApiErrorResponse,
    IGuestBookMessage,
    INTERNAL_SERVER_ERROR,
    METHOD_NOT_ALLOWED,
    NOT_FOUND,
} from '@/models';
import { GuestBookDbClient, isUndefined } from '@/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface IGetGuestBookMessageResponse {
    message: IGuestBookMessage;
}

/**
 * Get or update existing guest book message
 *
 * Allowed methods: GET, PUT
 *
 * Parameters:
 *  - id: string, guest book message ID
 *  - body: IGuestBookMessage, new guest book message to pUT
 *
 * Response: IGetGuestBookMessageResponse
 *
 * Potential errors:
 *  - 400: when body is invalid or not provided
 *  - 404: when message does not exist
 *  - 405: when non-allowed method is used
 *  - 500: internal server error
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IGetGuestBookMessageResponse | IApiErrorResponse>
) {
    if (req.method !== HttpMethod.GET && req.method !== HttpMethod.PUT) {
        return res.status(405).send({ message: METHOD_NOT_ALLOWED });
    }

    const { id } = req.query;

    try {
        const guestBookClient = new GuestBookDbClient();

        if (req.method === HttpMethod.PUT) {
            // PUT request: store the payload in the database
            const params = req.body as IGuestBookMessage;
            const isValidRequest =
                id === params.messageId &&
                !isUndefined(params?.messageId) &&
                !isUndefined(params?.author && !isUndefined(params?.message));

            if (!isValidRequest) {
                // Don't store bad data in the database!
                return res.status(400).send({ message: BAD_REQUEST });
            }

            const message = await guestBookClient.putMessage(params);

            if (isUndefined(message)) {
                return res.status(404).send({ message: NOT_FOUND });
            }

            return res.status(200).json({ message: message! });
        } else {
            const message = await guestBookClient.getMessage(id as string);

            if (isUndefined(message)) {
                return res.status(404).send({ message: NOT_FOUND });
            }

            return res.status(200).json({ message: message! });
        }
    } catch (err) {
        console.error(err);

        return res.status(500).send({ message: INTERNAL_SERVER_ERROR });
    }
}

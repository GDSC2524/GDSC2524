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

export interface ICreateGuestBookMessageResponse {
    message: IGuestBookMessage;
}

/**
 * Create new guest book message
 *
 * Allowed methods: POST
 *
 * Parameters:
 *  - body: IGuestBookMessage, new guest book message to pUT
 *
 * Response: IGetGuestBookMessageResponse
 *
 * Potential errors:
 *  - 400: when body is invalid or not provided
 *  - 405: when non-allowed method is used
 *  - 500: internal server error
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ICreateGuestBookMessageResponse | IApiErrorResponse>
) {
    if (req.method !== HttpMethod.POST) {
        return res.status(405).send({ message: METHOD_NOT_ALLOWED });
    }

    const { id } = req.query;

    try {
        const guestBookClient = new GuestBookDbClient();

        const params = req.body as IGuestBookMessage;
        const isValidRequest =
            isUndefined(params?.messageId) &&
            !isUndefined(params?.author && !isUndefined(params?.message));

        if (!isValidRequest) {
            // Don't store bad data in the database!
            return res.status(400).send({ message: BAD_REQUEST });
        }

        const message = await guestBookClient.createMessage(params);

        if (isUndefined(message)) {
            // Message was successfully created but could not be found
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR });
        }

        return res.status(200).json({ message: message! });
    } catch (err) {
        console.error(err);

        return res.status(500).send({ message: INTERNAL_SERVER_ERROR });
    }
}

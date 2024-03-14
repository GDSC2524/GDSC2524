import {
    HttpMethod,
    IApiErrorResponse,
    IContactForm,
    INTERNAL_SERVER_ERROR,
    METHOD_NOT_ALLOWED,
    NOT_FOUND,
} from '@/models';
import { ContactFormDbClient, isUndefined } from '@/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface IGetContactFormResponse {
    contactForm: IContactForm;
}

/**
 * Get or update existing contactForm
 *
 * Allowed methods: GET, PUT
 *
 * Parameters:
 *  - id: string, contactForm ID
 *  - body: IContactForm, new contactForm to pUT
 *
 * Response: IGetContactFormResponse
 *
 * Potential errors:
 *  - 400: when body is invalid or not provided
 *  - 404: when contactForm does not exist
 *  - 405: when non-allowed method is used
 *  - 500: internal server error
 */

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IGetContactFormResponse | IApiErrorResponse>
) {
    if (req.method !== HttpMethod.GET && req.method !== HttpMethod.PUT) {
        return res.status(405).send({ message: METHOD_NOT_ALLOWED });
    }

    const { id } = req.query;

    try {
        const contactFormClient = new ContactFormDbClient();

        const contactForm = await contactFormClient.getContactForm(id as string);

        if (isUndefined(contactForm)) {
            return res.status(404).send({ message: NOT_FOUND });
        }

        return res.status(200).json({ contactForm: contactForm! });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: INTERNAL_SERVER_ERROR });
    }
}

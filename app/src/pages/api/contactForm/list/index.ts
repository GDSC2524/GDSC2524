import {
    HttpMethod,
    IApiErrorResponse,
    IContactForm,
    INTERNAL_SERVER_ERROR,
    METHOD_NOT_ALLOWED,
} from '@/models';
import { ContactFormDbClient } from '@/utils/clients/ContactFormDbClient';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface IListContactFormResponse {
    /** ContactForms */
    contactForms: IContactForm[];
    /** Pagination token */
    paginationToken: string | undefined;
}

/**
 * Return a list of contactForm and pagination token upon a LIST request
 *
 * Allowed methods: GET
 *
 * Response: IListContactFormResponse
 *
 * Potential errors:
 *  - 500: internal server error
 */

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IListContactFormResponse | IApiErrorResponse>
) {
    if (req.method !== HttpMethod.GET) {
        return res.status(405).send({ message: METHOD_NOT_ALLOWED });
    }

    /** Extract and validate queries from request sent by frontend */
    try {
        const contactFormClient = new ContactFormDbClient();
        const { contactForms, paginationToken } = await contactFormClient.getlistContactForms();
        return res.status(200).json({ contactForms, paginationToken });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: INTERNAL_SERVER_ERROR });
    }
}

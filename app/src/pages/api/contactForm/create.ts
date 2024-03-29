import {
    BAD_REQUEST,
    HttpMethod,
    IApiErrorResponse,
    IContactForm,
    INTERNAL_SERVER_ERROR,
    METHOD_NOT_ALLOWED,
} from '@/models';
import { ContactFormDbClient, isUndefined, VALIDATION_SCHEMA } from '@/utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';

export interface ICreateContactFormResponse {
    contactForm: IContactForm;
}

/**
 * Create new contactForm
 *
 * Allowed methods: POST
 *
 * Parameters:
 *  - body: IContactForm, new contactForm to PUT
 *
 * Response: IGetContactFormResponse
 *
 * Potential errors:
 *  - 400: when body is invalid or not provided
 *  - 405: when non-allowed method is used
 *  - 500: internal server error
 */

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ICreateContactFormResponse | IApiErrorResponse>
) {
    if (req.method !== HttpMethod.POST) {
        return res.status(405).send({ message: METHOD_NOT_ALLOWED });
    }
    try {
        const contactFormClient = new ContactFormDbClient();

        const params = req.body as IContactForm;

        try {
            await VALIDATION_SCHEMA.partial().validate(params, { abortEarly: false });
            const isValidRequest = isUndefined(params?.contactFormId);
            if (!isValidRequest) {
                return res.status(400).json({ message: BAD_REQUEST });
            }
        } catch (validationError) {
            if (validationError instanceof Yup.ValidationError) {
                // Validation failed, return error response
                return res.status(400).json({
                    message: BAD_REQUEST,
                    errors: validationError.errors,
                });
            } else {
                return res.status(500).json({
                    message: INTERNAL_SERVER_ERROR,
                });
            }
        }

        const contactForm = await contactFormClient.createContactForm(params);

        if (isUndefined(contactForm)) {
            // ContactForm was successfully created but could not be found
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR });
        }

        return res.status(200).json({ contactForm: contactForm! });
    } catch (err) {
        return res.status(500).send({ message: INTERNAL_SERVER_ERROR });
    }
}

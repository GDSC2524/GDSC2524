import {
    BAD_REQUEST,
    HttpMethod,
    IApiErrorResponse,
    IContactForm,
    INTERNAL_SERVER_ERROR,
    METHOD_NOT_ALLOWED,
    NOT_FOUND,
} from '@/models';
import { ContactFormDbClient, isUndefined, VALIDATION_SCHEMA } from '@/utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';

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

        if (req.method === HttpMethod.PUT) {
            // PUT request: store the payload in the database
            const params = req.body as IContactForm;

            // Validate the request body against the validation schema
            try {
                await VALIDATION_SCHEMA.partial().validate(params, { abortEarly: false });

                // Check if the 'id' matches 'params.contactFormId' and 'params.contactFormId' is not undefined
                const isValidRequest = id === params?.contactFormId && !isUndefined(params?.contactFormId);

                if (!isValidRequest) {
                    // Don't store bad data in the database!
                    return res.status(400).json({ message: BAD_REQUEST });
                }
            } catch (validationError) {
                // Check if the validationError is an instance of Yup.ValidationError
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

            const contactForm = await contactFormClient.putContactForm(params);

            if (isUndefined(contactForm)) {
                return res.status(404).send({ message: NOT_FOUND });
            }

            return res.status(200).json({ contactForm: contactForm! });
        } else {
            const contactForm = await contactFormClient.getContactForm(id as string);

            if (isUndefined(contactForm)) {
                return res.status(404).send({ message: NOT_FOUND });
            }

            return res.status(200).json({ contactForm: contactForm! });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: INTERNAL_SERVER_ERROR });
    }
}

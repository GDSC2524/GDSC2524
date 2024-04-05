import { HttpMethod, IContactFormClient, IContactForm } from '@/models';
import { ICreateContactFormResponse } from '@/pages/api/contactForm/create';
import { IGetContactFormResponse } from '@/pages/api/contactForm/[id]';
import { ISendEmailResponse } from '@/pages/api/contactForm/send';
//import Brevo from '@getbrevo/brevo';

const CREATE_CONTACTFORM_ENDPOINT = '/api/contactForm/create';
const GET_CONTACTFORM_BASE_ENDPOINT = '/api/contactForm/get';
const SENDING_EMAIL_BASE_ENDPOINT = '/api/contactForm/send';
/** Client to interact with report API */
// TODO implement error handling
export class ContactFormApiClient implements IContactFormClient {
    async createContactForm(contactForm: Omit<IContactForm, 'contactFormId'>) {
        const response = await fetch(CREATE_CONTACTFORM_ENDPOINT, {
            method: HttpMethod.POST,
            body: JSON.stringify(contactForm),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const json: ICreateContactFormResponse = await response.json();

        return json.contactForm;
    }

    async getContactForm(contactFormId: string) {
        const response = await fetch(`${GET_CONTACTFORM_BASE_ENDPOINT}/${contactFormId}`);
        const json: IGetContactFormResponse = await response.json();

        return json.contactForm;
    }

    async sending(contactForm: IContactForm) {
        const response = await fetch(SENDING_EMAIL_BASE_ENDPOINT, {
            method: HttpMethod.POST,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactForm),
        });

        const json: ISendEmailResponse = await response.json();
        return json.contactForm;
    }
}

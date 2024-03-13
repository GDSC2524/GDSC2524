import { HttpMethod, IContactFormClient, IContactForm } from '@/models';
import { ICreateContactFormResponse } from '@/pages/api/contactForm/create';
import { IGetContactFormResponse } from '@/pages/api/contactForm/[id]';

const CREATE_CONTACTFORM_ENDPOINT = '/api/contactForm/create';
const GET_CONTACTFORM_BASE_ENDPOINT = '/api/contactForm';
const PUT_CONTACTFORM_BASE_ENDPOINT = '/api/contactForm';

/** Client to interact with report API */
// TODO implement error handling
export class ContactFormApiClient implements IContactFormClient {
    async createContactForm(contactForm: Omit<IContactForm, 'contactFormId'>): Promise<IContactForm | undefined> {
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
    async getContactForm(contactFormId: string): Promise<IContactForm | undefined> {
        const response = await fetch(`${GET_CONTACTFORM_BASE_ENDPOINT}/${contactFormId}`);
        const json: IGetContactFormResponse = await response.json();

        return json.contactForm;
    }
    async putContactForm(contactForm: IContactForm): Promise<IContactForm | undefined> {
        const response = await fetch(`${PUT_CONTACTFORM_BASE_ENDPOINT}/${contactForm.contactFormId}`, {
            method: HttpMethod.PUT,
            body: JSON.stringify(contactForm),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const json: IGetContactFormResponse = await response.json();
        return json.contactForm;
    }
}

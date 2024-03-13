import { IContactForm } from '../data';

/** Interface for contactForm clients */
export interface IContactFormClient {
    /** Create contactForm */
    createContactForm(contactForm: Omit<IContactForm, 'contactFormId'>): Promise<IContactForm | undefined>;
    /** Get contactForm */
    getContactForm(contactFormId: string): Promise<IContactForm | undefined>;
}

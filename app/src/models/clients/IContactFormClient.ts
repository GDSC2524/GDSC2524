import { IContactForm } from '../data';

/** Interface for contactForm clients */
export interface IContactFormClient {
    /** Create contactForm */
    createContactForm(contactForm: Omit<IContactForm, 'contactFormId'>): Promise<IContactForm | undefined>;
    /** Get contactForm */
    getContactForm(contactFormId: string): Promise<IContactForm | undefined>;
    /* List all contactForms */
    listContactForms(paginationToken?: string): Promise<{
        contactForms: IContactForm[];
        paginationToken: string | undefined;
    }>;
    /** Put contactForm */
    putContactForm(contactForm: IContactForm): Promise<IContactForm | undefined>;

    /** Filter by status and/or sort by newest/oldest submitted contactForms
     * @param {string} status - The status of the contactForms to filter by, ex: Submitted
     * @param {boolean} ascending - The sort order by submission time, ex: newest, oldest
     * @param {string} paginationToken - A token to fetch the next set of contactForms in pagination.
     */
    listContactFormsByStatus(
        status: string,
        ascending?: boolean,
        paginationToken?: string
    ): Promise<{
        contactForms: IContactForm[];
        paginationToken: string | undefined;
    }>;
}

import { IContactFormClient } from '@/models';
import { ContactFormApiClient } from '@/utils';
import { useMemo } from 'react';

/** Hook to abstract loading a single report */
export const useContactFormClient = (): IContactFormClient => {
    const contactFormClient = useMemo<IContactFormClient>(() => new ContactFormApiClient(), []);

    return contactFormClient;
};

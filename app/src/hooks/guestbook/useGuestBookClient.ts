import { IGuestBookClient } from '@/models';
import { GuestBookApiClient } from '@/utils';
import { useMemo } from 'react';

/** Hook to abstract loading a single guest book message */
export const useGuestBookClient = (): IGuestBookClient => {
    const guestBookClient = useMemo<IGuestBookClient>(() => new GuestBookApiClient(), []);

    return guestBookClient;
};

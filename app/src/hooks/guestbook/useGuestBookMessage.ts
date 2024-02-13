import { IGuestBookMessage } from '@/models';
import { isUndefined, useEffectAsync } from '@/utils';
import { useCallback, useState } from 'react';
import { useGuestBookClient } from './useGuestBookClient';

export type UseGuestBookMessageResult = {
    /** Guest book message */
    message: IGuestBookMessage | undefined;
    /** Whether guest book message is loading */
    isLoading: boolean;
    /** Function to refresh the guest book message */
    refresh: () => void;
    /** Function to update the guest book message */
    updateMessage: (updatedMessage: IGuestBookMessage) => Promise<void>;
    /** Whether guest book message update is submitting */
    isSubmitting: boolean;
};

/**
 * Hook to load and interact with a single guest book message
 * By using a hook for this common operation, we can avoid redundant code
 * If we add additional features (deleting, error handling, etc.) all pages will benefit
 * at the same time!
 */
export const useGuestBookMessage = (messageId: string): UseGuestBookMessageResult => {
    const guestBookClient = useGuestBookClient();

    const [message, setMessage] = useState<IGuestBookMessage | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const isLoading = isUndefined(message);

    useEffectAsync(async () => {
        if (!isUndefined(messageId)) {
            const result = await guestBookClient.getMessage(messageId);
            setMessage(result);
        }
    }, [messageId]);

    const refresh = useCallback(() => setMessage(undefined), [setMessage]);

    const updateMessage = async (newMessage: IGuestBookMessage): Promise<void> => {
        setIsSubmitting(true);
        await guestBookClient.putMessage(newMessage);
        setIsSubmitting(false);
        refresh();
    };

    return {
        message,
        isLoading,
        refresh,
        updateMessage,
        isSubmitting,
    };
};

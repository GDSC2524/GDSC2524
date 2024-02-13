import { IGuestBookMessage } from '@/models';
import { isUndefined, useEffectAsync } from '@/utils';
import { useCallback, useState } from 'react';
import { useGuestBookClient } from './useGuestBookClient';

export type UseGuestBookMessagesResult = {
    /** Guest book messages */
    messages: IGuestBookMessage[] | undefined;
    /** Whether guest book messages are loading */
    isLoading: boolean;
    /** Load messages with author filter, without clearing cache */
    loadMessages: () => void;
    /** Refresh messages with author filter, clearing cache */
    refreshMessages: () => void;
};

/**
 * Hook to load and interact with a guest book message list
 * By using a hook for this common operation, we can avoid redundant code
 * If we add additional features (deleting, error handling, etc.) all pages will benefit
 * at the same time!
 */
export const useGuestBookMessages = (authorFilter: string): UseGuestBookMessagesResult => {
    const guestBookClient = useGuestBookClient();

    const [messages, setMessages] = useState<IGuestBookMessage[] | undefined>([]);
    const isLoading = isUndefined(messages);

    const loadMessages = useCallback(async () => {
        if (!authorFilter) {
            const result = await guestBookClient.listMessages();
            setMessages(result?.messages!);
        } else {
            const result = await guestBookClient.listMessagesByAuthor(authorFilter);
            setMessages(result?.messages!);
        }
    }, [guestBookClient, setMessages, authorFilter]);

    const refreshMessages = useCallback(async () => {
        setMessages(undefined);
        await loadMessages();
    }, [loadMessages, setMessages]);

    // Load automatically on entering page
    useEffectAsync(async () => {
        await loadMessages();
    }, []);

    return {
        messages,
        isLoading,
        loadMessages,
        refreshMessages,
    };
};

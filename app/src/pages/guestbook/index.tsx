import ButtonLink from '@/components/ButtonLink';
import FilterByAuthor from '@/components/guestbook/FilterByAuthor';
import GuestBookMessageCard from '@/components/guestbook/GuestBookMessageCard';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import { useGuestBookMessages } from '@/hooks';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';

/** List existing guest book messages */
export default function GuestBookListing() {
    const [authorFilter, setAuthorFilter] = useState<string>('');
    const { messages, isLoading, refreshMessages } = useGuestBookMessages(authorFilter);
    const isEmpty = useMemo<boolean>(
        () => !isLoading && messages?.length === 0,
        [isLoading, messages]
    );

    return (
        <>
            <Head>
                <title>Guest Book Messages</title>
            </Head>
            <main>
                <Container>
                    <Stack gap={3}>
                        <PageHeader>Guest Book Messages</PageHeader>

                        <Stack gap={1}>
                            <FilterByAuthor
                                authorFilter={authorFilter}
                                setAuthorFilter={setAuthorFilter}
                                onSubmitFilter={refreshMessages}
                            />
                            <ButtonLink
                                variant="outline-success"
                                href="/guestbook/create"
                                size="sm"
                            >
                                Add guestbook message
                            </ButtonLink>
                        </Stack>

                        <Loading isLoading={isLoading}>Loading guest book messages....</Loading>
                        {isEmpty && <p>No guest book messages yet.</p>}
                        {!isLoading &&
                            messages!.map((message) => (
                                <GuestBookMessageCard key={message.messageId} message={message} />
                            ))}
                    </Stack>
                </Container>
            </main>
        </>
    );
}

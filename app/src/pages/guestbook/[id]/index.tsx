import GuestBookMessageCard from '@/components/guestbook/GuestBookMessageCard';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import { useGuestBookMessage } from '@/hooks';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';

const BASE_PAGE_TITLE = 'Guest Book Message';

/** View an existing guest book message */
export default function GuestBookDetail() {
    const router = useRouter();
    const { message, isLoading } = useGuestBookMessage(router.query.id as string);

    const pageTitle = isLoading
        ? BASE_PAGE_TITLE
        : `${BASE_PAGE_TITLE} - Message from ${message?.author!}`;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <main>
                <Container>
                    <Stack gap={3}>
                        <PageHeader>{pageTitle}</PageHeader>
                        <Loading isLoading={isLoading}>Loading guest book message....</Loading>
                        {!isLoading && <GuestBookMessageCard message={message!} />}
                    </Stack>
                </Container>
            </main>
        </>
    );
}

import GuestBookMessageEdit from '@/components/guestbook/GuestBookMessageEdit';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import { useGuestBookMessage } from '@/hooks';
import { IGuestBookMessage } from '@/models';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';

const BASE_PAGE_TITLE = 'Edit Guest Book Message';

/** Edit an existing guest book message */
export default function GuestBookEdit() {
    const router = useRouter();
    const {
        message,
        isLoading: isMessageLoading,
        updateMessage,
        isSubmitting,
    } = useGuestBookMessage(router.query.id as string);
    const detailsHref = `/guestbook/${message?.messageId}`;

    const isLoading = isMessageLoading;

    // `message` is the unaltered message originally fetched from the API
    const pageTitle = isLoading
        ? BASE_PAGE_TITLE
        : `${BASE_PAGE_TITLE} - Message from ${message?.author!}`;

    const handleSubmit = async (message: IGuestBookMessage) => {
        await updateMessage(message!);
        router.push(detailsHref);
    };

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
                        {!isLoading && (
                            <GuestBookMessageEdit
                                message={message!}
                                submitLabel="Save"
                                onEdit={handleSubmit}
                                cancelHref={detailsHref}
                            />
                        )}
                    </Stack>
                </Container>
            </main>
        </>
    );
}

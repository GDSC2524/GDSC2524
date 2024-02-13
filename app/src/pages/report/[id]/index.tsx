import ReportCardView from '@/components/report/ReportCardView';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import { useReport } from '@/hooks';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import { PageTitle } from '@/styles/StyleCardView';

const BASE_PAGE_TITLE = 'Report Details';

/** View an existing report */
export default function ReportDetail() {
    const router = useRouter();
    const { report, isLoading } = useReport(router.query.id as string);

    const pageTitle = isLoading ? (
        BASE_PAGE_TITLE
    ) : (
        <PageTitle variant="h4">Report Details</PageTitle>
    );
    return (
        <>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <main>
                <Container>
                    <Stack>
                        <PageHeader>{pageTitle}</PageHeader>
                        <Loading isLoading={isLoading}>Loading report details...</Loading>
                        {!isLoading && <ReportCardView report={report!} />}
                    </Stack>
                </Container>
            </main>
        </>
    );
}

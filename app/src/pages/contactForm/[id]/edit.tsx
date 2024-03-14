import ReportCardEdit from '@/components/report/ReportCardEdit';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import { useReport } from '@/hooks';
import { IReport } from '@/models';
import { isUndefined } from '@/utils';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import { PageTitle } from '@/styles/StyleCardView';

const BASE_PAGE_TITLE = 'Report Edit';

/** Edit an existing report */
export default function ReportEdit() {
    const router = useRouter();
    const {
        report,
        isLoading: isReportLoading,
        updateReport,
    } = useReport(router.query.id as string);
    const detailsHref = `/report/${report?.reportId}`;

    const isLoading = isReportLoading;

    // `report` is the unaltered report originally fetched from the API
    const pageTitle = isLoading ? BASE_PAGE_TITLE : <PageTitle variant="h4">Report Edit</PageTitle>;
    const handleSubmit = async (report: IReport) => {
        if (!isUndefined(report)) {
            await updateReport(report!);
            router.push(detailsHref);
        }
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
                        <Loading isLoading={isLoading}>Loading report...</Loading>
                        {!isLoading && (
                            <ReportCardEdit
                                report={report!}
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

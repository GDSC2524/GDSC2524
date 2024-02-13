import ReportCardEdit from '@/components/report/ReportCardEdit';
import PageHeader from '@/components/PageHeader';
import { useReportClient } from '@/hooks';
import { IReport } from '@/models';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';

type NewReport = Omit<IReport, 'reportId'>;

/** Create a new report */
export default function ReportCreate() {
    const router = useRouter();
    const reportClient = useReportClient();

    const createReport = async (newReport: NewReport): Promise<IReport> => {
        const createdReport = await reportClient.createReport(newReport);
        return createdReport!;
    };

    const handleSubmit = async (report: NewReport) => {
        const createdReport = await createReport(report!);
        router.push(`/report/${createdReport.reportId}`);
    };

    return (
        <>
            <Head>
                <title>New Report</title>
            </Head>
            <main>
                <Container>
                    <Stack gap={3}>
                        <PageHeader>New Report</PageHeader>
                        <ReportCardEdit
                            report={undefined}
                            submitLabel="Create"
                            onCreate={handleSubmit}
                            cancelHref={'/report'}
                        />
                    </Stack>
                </Container>
            </main>
        </>
    );
}
import { PageTitle, GroupedBox } from '@/styles/StyleDashboard';
import Head from 'next/head';
import DataAnalytics from '@/components/dashboard/DataAnalytics';
import FAQ from '@/components/dashboard/FAQ';
import ContactForm from '@/components/dashboard/ContactForm';
import ContactInfo from '@/components/dashboard/ContactInfo';

// Dashboard page
export default function Dashboard() {
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <main>
                <PageTitle>Dashboard</PageTitle>
                <GroupedBox>
                    <DataAnalytics />
                </GroupedBox>
                <GroupedBox>
                    <FAQ />
                </GroupedBox>
                <GroupedBox>
                    <ContactForm />
                </GroupedBox>
                <GroupedBox>
                    <ContactInfo />
                </GroupedBox>
            </main>
        </>
    );
}

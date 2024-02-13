import { IReport } from '@/models';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import { Typography, Grid } from '@mui/material';
import {
    StyledReportDetails,
    GroupedBox,
    Heading,
    FooterDetails,
    IDText,
    StyledButton,
    TextBtn,
} from '@/styles/StyleCardView';
import { ReportCategories } from '@/models';
import Image from 'next/image';

export type ReportCardProps = {
    report: IReport;
};

function translateISOTimestamp(ISOTimestamp: string): string {
    const ISOTime = new Date(ISOTimestamp);
    const localTime = ISOTime.toLocaleString('en-US');
    return localTime;
}

/** Report Card View */
export default function ReportCard({ report }: ReportCardProps) {
    return (
        <Card>
            <StyledReportDetails>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <GroupedBox>
                            <Heading>Contact Information</Heading>
                            <Typography>
                                <strong>Name:</strong> {report.name}
                            </Typography>
                            <Typography>
                                <strong>Email Address:</strong> {report.emailAddress}
                            </Typography>
                            <Typography>
                                <strong>Phone Number:</strong> {report.phoneNumber}
                            </Typography>
                        </GroupedBox>
                        <GroupedBox>
                            <Typography>
                                <strong>Report Category:</strong>{' '}
                                {report.reportCategory === ReportCategories.Other
                                    ? report.otherCategory // Show the custom category value if "Other" is selected
                                    : report.reportCategory}
                            </Typography>
                        </GroupedBox>
                        <GroupedBox>
                            <Heading>Issue Location</Heading>
                            <Typography whiteSpace="pre-wrap">
                                <strong>Address:</strong> {report.address}
                            </Typography>
                        </GroupedBox>
                        <GroupedBox>
                            <Typography whiteSpace="pre-wrap">
                                <strong>Issue Description:</strong> {report.issueDescription}
                            </Typography>
                        </GroupedBox>
                        <GroupedBox>
                            <Heading>Status Updates</Heading>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography>
                                        <strong>Email:</strong> {report.email ? 'Yes' : 'No'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>
                                        <strong>SMS:</strong> {report.sms ? 'Yes' : 'No'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </GroupedBox>
                    </Grid>
                    <Grid item xs={6}>
                        <GroupedBox>
                            <Typography>
                                <strong>Attachments:</strong>
                            </Typography>
                            <Image
                                src="/https://smaller-pictures.appspot.com/images/dreamstime_xxl_65780868_small.jpg" // Fake image for now
                                width={500}
                                height={500}
                                alt="Attachment Image"
                            />
                        </GroupedBox>
                        <GroupedBox>
                            <Typography>
                                <strong>Status of Report:</strong> {report.statusOfReport}
                            </Typography>
                            <Typography>
                                <strong>Date and Time of Submission:</strong>{' '}
                                {translateISOTimestamp(report.dateTimeOfSubmission)}
                            </Typography>
                            <Typography>
                                <strong>Date and Time Last Edited:</strong>{' '}
                                {report.dateTimeLastEdited
                                    ? translateISOTimestamp(report.dateTimeLastEdited)
                                    : 'Never Edited'}
                            </Typography>
                        </GroupedBox>
                    </Grid>
                </Grid>
            </StyledReportDetails>
            <FooterDetails>
                <GroupedBox>
                    <Stack direction="horizontal" gap={3}>
                        <p className="font-monospace me-auto my-auto">
                            <IDText>ID: </IDText> {report.reportId}
                        </p>
                        <div className="vr"></div>
                        <StyledButton variant="secondary" href={`/report/${report.reportId}/edit`}>
                            <TextBtn>Edit</TextBtn>
                        </StyledButton>
                    </Stack>
                </GroupedBox>
            </FooterDetails>
        </Card>
    );
}

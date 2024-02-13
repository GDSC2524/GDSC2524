import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Grid,
    Typography,
} from '@mui/material';
import { DARK_PRIMARY } from '@/styles/ColorScheme';
import { StyledText } from '@/styles/StyleDashboard';
import { ContactInformation } from '@/models';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQ() {
    return (
        <Box pt={2} px={{ xs: 2, sm: 4 }}>
            <Box textAlign="center" mb={4}>
                <Typography
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: DARK_PRIMARY,
                        fontSize: '1.5rem',
                        margin: '0 auto',
                        maxWidth: '600px',
                    }}
                >
                    Frequently Asked Questions
                </Typography>
            </Box>
            <Box marginBottom={2}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <StyledText>
                                    Can I report multiple issues in one submission?
                                </StyledText>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    While we appreciate your diligence in reporting multiple issues,
                                    to ensure each problem is directed to the right department, we
                                    kindly request that you fill a separate report for each issue.
                                    This will help us address each concern efficiently and provide
                                    you with the best possible support.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <StyledText>
                                    What should I do if I&apos;m not sure about the issue location?
                                </StyledText>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    If you&apos;re unsure about the issue&apos;s location, please provide as
                                    much information as possible, such as landmarks, nearby
                                    addresses, or any other helpful details. Additionally, we do
                                    have a Location Map Picker available to help you precisely
                                    pinpoint the problem area. This will assist our team in
                                    accurately identifying the problem area.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <StyledText>
                                    Can I track the status of my reported issue?
                                </StyledText>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Yes, you can track the status of your reported issues. Upon
                                    submitting a report, we provide regular status updates via email
                                    or SMS, ensuring you stay informed about any progress or
                                    developments regarding your concern. Ensuring you have timely
                                    and detailed information is our top priority.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <StyledText>
                                    What should I do if I need to provide additional information?
                                </StyledText>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    If you need to provide additional information after the initial
                                    submission, please contact our support team by using the contact
                                    form on our website. Alternatively, you can access your report
                                    in the Report List section, where you&apos;ll find an Edit button
                                    that allows you to update your report with any relevant details.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <StyledText>
                                    What should I do if I encounter technical issues with the
                                    dashboard?
                                </StyledText>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    If you encounter any technical issues with the dashboard, you
                                    can try restarting the website. If the issue persists, please
                                    report it to our technical support team by sending an email to [
                                    {ContactInformation.Customer_Support}], calling{' '}
                                    {ContactInformation.City_Helpline}, or using the contact form on
                                    our website.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <StyledText>
                                    How can I provide feedback or suggestions for improving the
                                    platform?
                                </StyledText>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    We value your feedback and suggestions for enhancing our
                                    platform&apos;s functionality and user experience. Please feel free
                                    to share your thoughts with us through the provided contact
                                    form, email [{ContactInformation.Customer_Support}], or city
                                    helpline {ContactInformation.City_Helpline}.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

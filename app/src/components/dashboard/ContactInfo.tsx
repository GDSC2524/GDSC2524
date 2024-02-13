import { Box, Grid, Typography, Stack } from '@mui/material';
import { DARK_PRIMARY } from '@/styles/ColorScheme';
import { ContactInformation } from '@/models';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function ContactInfo() {
    return (
        <Box pt={2} px={2}>
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
                    Contact Information
                </Typography>
            </Box>
            <Box marginBottom={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <PhoneIcon sx={{ color: 'primary.main' }} />
                            <Typography
                                variant="h6"
                                sx={{ color: 'primary.main', fontWeight: 'bold' }}
                            >
                                City Helpline
                            </Typography>
                            <Typography>{ContactInformation.City_Helpline}</Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <EmailIcon sx={{ color: 'success.main' }} />
                            <Typography
                                variant="h6"
                                sx={{ color: 'success.main', fontWeight: 'bold' }}
                            >
                                Customer Support
                            </Typography>
                            <Typography>{ContactInformation.Customer_Support}</Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <LocationOnIcon sx={{ color: 'error.main' }} />
                            <Typography
                                variant="h6"
                                sx={{ color: 'error.main', fontWeight: 'bold' }}
                            >
                                Office Address
                            </Typography>
                            <Typography>123 Main St, Cityville, ST 12345</Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <AccessTimeIcon sx={{ color: 'warning.main' }} />
                            <Typography
                                variant="h6"
                                sx={{ color: 'warning.main', fontWeight: 'bold' }}
                            >
                                Office Hours
                            </Typography>
                            <Typography>Monday - Friday: 10 a.m - 4 p.m</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

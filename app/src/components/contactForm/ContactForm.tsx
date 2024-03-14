import { Box, Typography, TextField, Button } from '@mui/material';
import { DARK_PRIMARY } from '@/styles/ColorScheme';
import { useState } from 'react';
import styles from '../../styles/ContactForm.module.css';
import { Form } from 'react-bootstrap';

export default function ContactForm() {
    const [name, setName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [message, setMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [sms, setSms] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // submit logic
    };

    return (
        <Box pt={2} px={2} component="form" onSubmit={handleSubmit}>
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
                    Contact Form
                </Typography>
            </Box>
            <Box marginBottom={2}>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="dense"
                />

                <TextField
                    label="EmailAddress"
                    variant="outlined"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    fullWidth
                    margin="dense"
                />

                <TextField
                    label="PhoneNumber"
                    variant="outlined"
                    multiline
                    rows={1}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    fullWidth
                    margin="dense"
                />

                <Form.Group
                    className={styles['contactForm-group']}
                    controlId="EditContactForm.Email"
                >
                    <Form.Check
                        name="email"
                        type="checkbox"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(email!)}
                    />
                </Form.Group>

                <Form.Group className={styles['contactForm-group']} controlId="EditContactForm.Sms">
                    <Form.Check
                        name="sms"
                        type="checkbox"
                        label="SMS"
                        onChange={(e) => setEmail(sms!)}
                    />
                </Form.Group>

                <TextField
                    label="Message"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                    margin="dense"
                />

                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </Box>
        </Box>
    );
}

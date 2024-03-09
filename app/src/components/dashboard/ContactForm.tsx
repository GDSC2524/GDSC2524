import { Box, Typography, TextField, Button } from '@mui/material';
import { DARK_PRIMARY } from '@/styles/ColorScheme';
import { useState } from 'react';
import styles from '../../styles/ContactForm.module.css';
import { IContactForm } from '@/models';
import { Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useContactFormClient } from '@/hooks';

type NewContactForm = Omit<IContactForm, 'contactFormId'>;


export default function ContactForm() {
    const [name, setName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState(false);
    const [sms, setSms] = useState(false);
    const [message, setMessage] = useState('');
    
    const contactFormClient = useContactFormClient();

    const createContactForm = async (newContactForm: NewContactForm): Promise<IContactForm> => {
        const createdContactForm = await contactFormClient.createContactForm(newContactForm);
        return createdContactForm!;
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const contactForm: NewContactForm = {
            name: name,
            emailAddress: emailAddress,
            phoneNumber: phoneNumber,
            email: email,
            sms: sms,
            message: message,
            statusOfContactForm: '',
            dateTimeOfSubmission: '',
            dateTimeLastEdited: ''
        };
        const createdReport = await createContactForm(contactForm!);
        alert('Form submitted!');
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
                    label="Email"
                    variant="outlined"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    fullWidth
                    margin="dense"
                />

                <TextField
                    label="Phone Number"
                    variant="outlined"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    fullWidth
                    margin="dense"
                />
                
                <div className={styles['form-group-container']}>
                    <Form.Group className={styles['form-group']}>
                        <Form.Check
                            name="email"
                            type="checkbox"
                            label="Email"
                            checked={email}
                            onChange={(e) => setEmail(e.target.checked)}
                        />
                    </Form.Group>
                    <Form.Group className={styles['form-group']}>
                        <Form.Check
                            name="sms"
                            type="checkbox"
                            label="SMS"
                            checked={sms}
                            onChange={(e) => setSms(e.target.checked)}
                        />
                    </Form.Group>
                </div>

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

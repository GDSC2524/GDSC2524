import { Box, Typography, TextField, Button } from '@mui/material';
import { DARK_PRIMARY } from '@/styles/ColorScheme';
import { useState } from 'react';
import styles from '../../styles/ContactForm.module.css';
import { Form } from 'react-bootstrap';
import { useContactFormClient } from '../../hooks/contactForm/useContactFormClient';
import { IContactForm } from '@/models';

type NewContactForm = Omit<IContactForm, 'contactFormId'>;

export default function ContactForm() {
    const [name, setName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [message, setMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [sms, setSms] = useState<boolean>(false);
    const [email, setEmail] = useState<boolean>(false);

    const create_contactform = useContactFormClient();

    const createContactForm = async (newContactForm: NewContactForm): Promise<IContactForm> => {
        const newIcontactForm = await create_contactform.createContactForm(newContactForm);
        return newIcontactForm!;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        //e.preventDefault();
        const newContact: NewContactForm = {
            name: name,
            emailAddress: emailAddress,
            phoneNumber: phoneNumber,
            email: email,
            sms: sms,
            message: message,
            statusOfContactForm: '',
            dateTimeOfSubmission: '',
            dateTimeLastEdited: '',
        };
        const createdContactForm = await createContactForm(newContact);
        console.log(123123123213);
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
                        checked={email}
                        onChange={(e) => setEmail(!email)}
                    />
                </Form.Group>

                <Form.Group className={styles['contactForm-group']} controlId="EditContactForm.Sms">
                    <Form.Check
                        name="sms"
                        type="checkbox"
                        label="SMS"
                        checked={sms}
                        onChange={(e) => setSms(!sms)}
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

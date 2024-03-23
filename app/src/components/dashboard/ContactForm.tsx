import { Box, Typography, TextField, Button } from '@mui/material';
import { DARK_PRIMARY } from '@/styles/ColorScheme';
import { useState } from 'react';
import styles from '../../styles/ContactForm.module.css';
import { Form } from 'react-bootstrap';
import { useContactFormClient } from '../../hooks/contactForm/useContactFormClient';
import { IContactForm } from '@/models';
import { useFormik, FormikHelpers } from 'formik';
import { ContactForm_VALIDATION_SCHEMA } from '@/utils';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

type NewContactForm = Omit<IContactForm, 'contactFormId'>;
type InitialValuesType = NewContactForm | IContactForm;

const getInitialContactForm = (): NewContactForm => ({
    name: '',
    emailAddress: '',
    phoneNumber: '',
    email: false,
    sms: false,
    message: '',
    statusOfContactForm: '',
    dateTimeOfSubmission: '',
    dateTimeLastEdited: '',
});

export default function ContactForm() {
    const [showThankYouMessage, setShowThankYouMessage] = useState(false);
    const create_contactform = useContactFormClient();

    const createContactForm = async (newContactForm: NewContactForm): Promise<IContactForm> => {
        const newIcontactForm = await create_contactform.createContactForm(newContactForm);
        return newIcontactForm!;
    };

    const handleSubmit = async (
        values: InitialValuesType,
        formikHelpers: FormikHelpers<InitialValuesType>
    ) => {
        const { setSubmitting } = formikHelpers;
        await createContactForm(values);
        console.log(123123123213);
        setShowThankYouMessage(true);
    };

    const formik = useFormik<InitialValuesType>({
        initialValues: getInitialContactForm(),
        validationSchema: ContactForm_VALIDATION_SCHEMA,
        onSubmit: handleSubmit,
    });

    return (
        <Box pt={2} px={2}>
            {showThankYouMessage ? (
                <Box textAlign="center" className={styles['animate-fade']}>
                    <Typography variant="h5" gutterBottom>
                        Thank you for submitting the form!
                    </Typography>
                    <Box className={styles['form-data']}>
                        <Typography variant="body1" gutterBottom>
                            Name: {formik.values.name}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Email Address: {formik.values.emailAddress}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Phone Number: {formik.values.phoneNumber}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Preferred Contact Method:
                            {formik.values.email && formik.values.sms
                                ? ' Email and SMS'
                                : formik.values.email
                                ? ' Email'
                                : formik.values.sms
                                ? ' SMS'
                                : ' None'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Message: {formik.values.message}
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box component="form" onSubmit={formik.handleSubmit}>
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
                        <Form.Group
                            className={styles['contactForm-group']}
                            controlId="EditReport.Name"
                        >
                            <Form.Label className={styles['label']}>Name</Form.Label>
                            <Form.Control
                                name="name"
                                type="text"
                                placeholder="Please enter your name"
                                value={formik.values.name}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                className={styles['input']}
                                isInvalid={formik.touched.name && !!formik.errors.name}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="text-danger">
                                    <ErrorOutlineIcon /> {formik.errors.name}
                                </div>
                            ) : formik.touched.name && !formik.errors.name ? (
                                <div style={{ color: 'blue' }}>
                                    <CheckCircleOutlineIcon />
                                </div>
                            ) : null}
                        </Form.Group>

                        <Form.Group
                            className={styles['contactForm-group']}
                            controlId="EditReport.EmailAddress"
                        >
                            <Form.Label className={styles['label']}>Email Address</Form.Label>
                            <Form.Control
                                name="emailAddress"
                                type="email"
                                placeholder="Please enter your email address"
                                value={formik.values.emailAddress}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                className={styles['input']}
                                isInvalid={
                                    !!(formik.touched.emailAddress && formik.errors.emailAddress)
                                }
                            />
                            {formik.touched.emailAddress && formik.errors.emailAddress ? (
                                <div className="text-danger">
                                    <ErrorOutlineIcon /> {formik.errors.emailAddress}
                                </div>
                            ) : formik.touched.emailAddress && !formik.errors.emailAddress ? (
                                <div style={{ color: 'blue' }}>
                                    <CheckCircleOutlineIcon />
                                </div>
                            ) : null}
                        </Form.Group>

                        <Form.Group
                            className={styles['contactForm-group']}
                            controlId="EditReport.PhoneNumber"
                        >
                            <Form.Label className={styles['label']}>Phone Number</Form.Label>
                            <Form.Control
                                name="phoneNumber"
                                type="tel"
                                placeholder="Please enter your phone number"
                                value={formik.values.phoneNumber}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                className={styles['input']}
                                isInvalid={
                                    !!(formik.touched.phoneNumber && formik.errors.phoneNumber)
                                }
                            />
                            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                <div className="text-danger">
                                    <ErrorOutlineIcon /> {formik.errors.phoneNumber}
                                </div>
                            ) : formik.touched.phoneNumber && !formik.errors.phoneNumber ? (
                                <div style={{ color: 'blue' }}>
                                    <CheckCircleOutlineIcon />
                                </div>
                            ) : null}
                        </Form.Group>

                        <Form.Group
                            className={styles['contactForm-group']}
                            controlId="EditReport.Email"
                        >
                            <Form.Check
                                name="email"
                                type="checkbox"
                                label="Email"
                                checked={formik.values.email}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                            />
                        </Form.Group>
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-danger">{formik.errors.email}</p>
                        )}

                        <Form.Group
                            className={styles['contactForm-group']}
                            controlId="EditReport.Sms"
                        >
                            <Form.Check
                                name="sms"
                                type="checkbox"
                                label="SMS"
                                checked={formik.values.sms}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                            />
                        </Form.Group>
                        {formik.touched.sms && formik.errors.sms && (
                            <p className="text-danger">{formik.errors.sms}</p>
                        )}

                        <Form.Group
                            className={styles['contactForm-group']}
                            controlId="EditReport.Message"
                        >
                            <Form.Label className={styles['label']}>Message</Form.Label>
                            <Form.Control
                                name="message"
                                as="textarea"
                                rows={4}
                                placeholder="Please enter your message"
                                value={formik.values.message}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                className={styles['input']}
                                isInvalid={formik.touched.message && !!formik.errors.message}
                            />
                            {formik.touched.message && formik.errors.message ? (
                                <div className="text-danger">
                                    <ErrorOutlineIcon /> {formik.errors.message}
                                </div>
                            ) : formik.touched.message && !formik.errors.message ? (
                                <div style={{ color: 'blue' }}>
                                    <CheckCircleOutlineIcon />
                                </div>
                            ) : null}
                        </Form.Group>

                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

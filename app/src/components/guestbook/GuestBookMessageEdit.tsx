import { IGuestBookMessage } from '@/models';
import { useMemo } from 'react';
import { Spinner, Stack, Button, Form } from 'react-bootstrap';
import ButtonLink from '../ButtonLink';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { isUndefined } from '@/utils';

//Initial values for name and message
type NewGuestBookMessage = Omit<IGuestBookMessage, 'messageId'>;
type InitialValuesType = NewGuestBookMessage | IGuestBookMessage;

const getInitialMessage = (): NewGuestBookMessage => ({
    author: '',
    message: '',
});

// Names to randomly select from for name placeholder
const PLACEHOLDER_NAMES = ['Zhanping', 'Min', 'Sophie', 'Andrey'];

// Form validation for any form with name === author or message
const VALIDATION_SCHEMA = Yup.object({
    author: Yup.string()
        .matches(
            /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
            'Name can only contain Latin letters.'
        )
        .min(2, 'Too short!')
        .max(50, 'Too long!')
        .required('Required!'),
    message: Yup.string().min(2, 'Too short!').max(1000, 'Too long!').required('Required!'),
});

export type GuestBookMessageEditProps = {
    message: IGuestBookMessage | undefined;
    submitLabel: string;
    onCreate?: (message: NewGuestBookMessage) => void;
    onEdit?: (message: IGuestBookMessage) => void;
    cancelHref: string;
};

/** Guest book message editor, used for create and edit flows */
export default function GuestBookMessageEdit({
    message,
    submitLabel,
    onCreate,
    onEdit,
    cancelHref,
}: GuestBookMessageEditProps) {
    // Using useMemo to randomly select a name once
    // Otherwise, a new name would be randomly selected every render!
    const placeholderName = useMemo<string>(
        () => PLACEHOLDER_NAMES[Math.floor(Math.random() * PLACEHOLDER_NAMES.length)],
        []
    );

    const initializeValues = (): InitialValuesType => {
        if (isUndefined(message)) {
            return getInitialMessage();
        }
        return message!;
    };

    const handleSubmit = (
        message: InitialValuesType,
        formikHelpers: FormikHelpers<InitialValuesType>
    ) => {
        const { setSubmitting } = formikHelpers;
        try {
            if (onEdit && 'messageId' in message) {
                onEdit(message as IGuestBookMessage);
            } else if (onCreate) {
                onCreate(message as NewGuestBookMessage);
            }
        } catch (error) {
            console.log('Failed to create message', error);
        } finally {
            setSubmitting(false);
        }
    };

    const formik = useFormik<InitialValuesType>({
        initialValues: initializeValues(),
        validationSchema: VALIDATION_SCHEMA,
        onSubmit: handleSubmit,
    });

    return (
        <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="EditMessage.Author">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    name="author"
                    type="text"
                    placeholder={placeholderName}
                    value={formik.values.author}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                />
            </Form.Group>
            {formik.touched.author && formik.errors.author && (
                <p className="text-danger">{formik.errors.author}</p>
            )}

            <Form.Group className="mb-3" controlId="EditMessage.Message">
                <Form.Label>Message</Form.Label>
                <Form.Control
                    name="message"
                    rows={3}
                    as="textarea"
                    value={formik.values.message}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                />
            </Form.Group>
            {formik.touched.message && formik.errors.message && (
                <p className="text-danger">{formik.errors.message}</p>
            )}

            <Stack direction="horizontal" gap={3} className="justify-content-end">
                <div className="my-auto"></div>
                <ButtonLink variant="secondary" href={cancelHref}>
                    Cancel
                </ButtonLink>
                <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? <Spinner animation="border" size="sm" /> : submitLabel}
                </Button>
            </Stack>
        </Form>
    );
}

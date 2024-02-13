import { IReport } from '@/models';
import { Spinner, Stack, Button, Form, ButtonGroup } from 'react-bootstrap';
import ButtonLink from '../ButtonLink';
import { ReportCategories } from '@/models';
import { useFormik, FormikHelpers } from 'formik';
import { isUndefined, VALIDATION_SCHEMA } from '@/utils';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import styles from '../../styles/Report.module.css';
import LocationPicker, { submitLocation } from './LocationPicker';
import { CoordinatesType } from './LocationPicker';
import { useLocationPicker } from '@/hooks';
import { useRef, useState } from 'react';
import ConfirmationModal, { ModalHandle } from './ConfirmationModal';

//Initial values for report form
type NewReport = Omit<IReport, 'reportId'>;
type InitialValuesType = NewReport | IReport;

const getInitialReport = (): NewReport => ({
    name: '',
    emailAddress: '',
    phoneNumber: '',
    reportCategory: '',
    otherCategory: '',
    address: '',
    gpsCoordinates: '',
    issueDescription: '',
    attachments: '',
    email: false,
    sms: false,
    statusOfReport: '',
    dateTimeOfSubmission: '',
    dateTimeLastEdited: '',
});

export type ReportEditProps = {
    report: IReport | undefined;
    submitLabel: string;
    onCreate?: (report: NewReport) => void;
    onEdit?: (report: IReport) => void;
    cancelHref: string;
};

/** Report editor, used for create and edit flows */
export default function ReportCardEdit({
    report,
    submitLabel,
    onCreate,
    onEdit,
    cancelHref,
}: ReportEditProps) {
    // Ref to open modal alert
    const modalRef = useRef<ModalHandle | null>(null);

    // Fetch location of existing report to display marker on edit page only
    const fetchReportCoordinates = (): CoordinatesType | undefined => {
        if (isUndefined(report)) return undefined;

        const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
        if (!regex.test(report!.gpsCoordinates)) return undefined;

        const [longitude, latitude] = report!.gpsCoordinates.split(',').map(Number);
        return { longitude, latitude };
    };
    const existingCoordsOrNull = fetchReportCoordinates();

    //Check if the existing report was submitted with a map or not
    const submittedFormWithMap = existingCoordsOrNull ? true : false;

    // Track current coordinate of report
    const { reportCoords, updateReportCoords } = useLocationPicker(existingCoordsOrNull);

    // Check if the user chooses to use map for location picker
    const [useMap, setUseMap] = useState<boolean>(submittedFormWithMap);

    const openMap = () => {
        setUseMap(true);
        fillOutAddress('');
    };

    const closeMap = () => {
        setUseMap(false);
        fillOutAddress('');
        if (!isUndefined(reportCoords)) {
            updateReportCoords(undefined);
        }
    };

    const fillOutAddress = (address: string) => {
        formik.setFieldValue('address', address);
    };
    // Used to check if the location is submitted/filled
    const isLocationFilled = () => {
        return formik.values.address !== '';
    };

    const initializeValues = (): InitialValuesType => {
        if (isUndefined(report)) {
            return getInitialReport();
        }
        return report!;
    };

    const handleSubmit = async (
        report: InitialValuesType,
        formikHelpers: FormikHelpers<InitialValuesType>
    ) => {
        const { setSubmitting } = formikHelpers;
        setSubmitting(true);

        const fullReport: InitialValuesType = !isUndefined(reportCoords)
            ? {
                  ...report,
                  gpsCoordinates: `${reportCoords?.longitude},${reportCoords?.latitude}`,
              }
            : report;

        try {
            if (onEdit && 'reportId' in report) {
                await onEdit(fullReport as IReport);
            } else if (onCreate) {
                await onCreate(fullReport as NewReport);
            }
        } catch (error) {
            console.log('Failed to Create Report', error);
        } finally {
            submitLocation(reportCoords);
            setSubmitting(false);
        }
    };

    const formik = useFormik<InitialValuesType>({
        initialValues: initializeValues(),
        validationSchema: VALIDATION_SCHEMA,
        onSubmit: handleSubmit,
    });

    return (
        <Form className={styles['report-form']} onSubmit={formik.handleSubmit}>
            <ButtonGroup
                role="group"
                aria-label="Enter address mannually or Use map for location picker"
            >
                <Button
                    variant={!useMap ? 'primary' : 'secondary'}
                    onClick={() => {
                        if (!formik.values.address) {
                            closeMap();
                            return;
                        }
                        modalRef.current?.openModal();
                    }}
                >
                    I want to enter the address mannually
                </Button>
                <Button
                    variant={useMap ? 'primary' : 'secondary'}
                    onClick={() => {
                        if (!formik.values.address) {
                            openMap();
                            return;
                        }
                        modalRef.current?.openModal();
                    }}
                >
                    I want to use the map to mark the location
                </Button>
            </ButtonGroup>
            <ConfirmationModal
                ref={modalRef}
                header="Alert!"
                description="Do you switch the location input mode? This will reset the current address."
                denyMessage="No, I do not want to switch"
                confirmMessage={`Yes, I want to switch to ${useMap ? 'manual input' : 'map'} mode`}
                onConfirm={() => {
                    if (useMap) {
                        closeMap();
                    } else {
                        openMap();
                    }
                }}
            />
            {useMap && (
                <div className={styles['map-row']}>
                    <LocationPicker
                        reportCoords={reportCoords}
                        updateReportCoords={updateReportCoords}
                        fillOutAddress={fillOutAddress}
                        initialMarkerState={!isLocationFilled()}
                        locationSubmitted={isLocationFilled()}
                    />
                </div>
            )}
            <div className={styles['details-row']}>
                <div className={styles['form-column']}>
                    <Form.Label className={styles['section-label']}>Contact Information</Form.Label>

                    <Form.Group className={styles['form-group']} controlId="EditReport.Name">
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
                        className={styles['form-group']}
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
                    <Form.Group className={styles['form-group']} controlId="EditReport.PhoneNumber">
                        <Form.Label className={styles['label']}>Phone Number</Form.Label>
                        <Form.Control
                            name="phoneNumber"
                            type="tel"
                            placeholder="Please enter your phone number"
                            value={formik.values.phoneNumber}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            className={styles['input']}
                            isInvalid={!!(formik.touched.phoneNumber && formik.errors.phoneNumber)}
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
                <Form.Label className={styles['section-label']}>Report Category</Form.Label>
                <Form.Group className={styles['form-group']} controlId="EditReport.ReportCategory">
                    {[
                        ReportCategories.Illegal_Dumping,
                        ReportCategories.Clogged_Storm_Drain,
                        ReportCategories.Potholes,
                        ReportCategories.Graffiti,
                        ReportCategories.Street_Light_Outage,
                        ReportCategories.Sidewalk_Damage,
                        ReportCategories.Traffic_Signal_Malfunction,
                        ReportCategories.Abandoned_Vehicles,
                        ReportCategories.Noise_Complaint,
                        ReportCategories.Other,
                    ].map((category) => (
                        <div key={category}>
                            <Form.Check
                                name="reportCategory"
                                type="radio"
                                label={category}
                                value={category}
                                checked={formik.values.reportCategory === category}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                className={styles['check-control']}
                            />
                            {/* Show the additional input field only when 'Other' is selected */}
                            {category === ReportCategories.Other &&
                                formik.values.reportCategory === category && (
                                    <div>
                                        <Form.Label>Other Category:</Form.Label>
                                        <Form.Control
                                            name="otherCategory"
                                            value={formik.values.otherCategory}
                                            type="text"
                                            placeholder="Please enter your other category"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                )}
                        </div>
                    ))}
                    {formik.touched.reportCategory && formik.errors.reportCategory ? (
                        <div className="text-danger">
                            <ErrorOutlineIcon /> {formik.errors.reportCategory}
                        </div>
                    ) : formik.touched.reportCategory && !formik.errors.reportCategory ? (
                        <div style={{ color: 'blue' }}>
                            <CheckCircleOutlineIcon />
                        </div>
                    ) : null}
                    {formik.touched.otherCategory && formik.errors.otherCategory && (
                        <p className="text-danger">{formik.errors.otherCategory}</p>
                    )}
                </Form.Group>
            </div>
                <div className={styles['form-column']}>
                    <Form.Label className={styles['section-label']}>Issue</Form.Label>
                    <Form.Group className={styles['form-group']} controlId="EditReport.Address">
                        <Form.Label className={styles['label']}>Address</Form.Label>
                        <Form.Control
                            name="address"
                            type="text"
                            placeholder="Please enter your issue location"
                            value={formik.values.address}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            className={styles['input']}
                            isInvalid={formik.touched.address && !!formik.errors.address}
                            readOnly={useMap}
                        />
                        {formik.touched.address && formik.errors.address ? (
                            <div className="text-danger">
                                <ErrorOutlineIcon /> {formik.errors.address}
                            </div>
                        ) : formik.touched.address && !formik.errors.address ? (
                            <div style={{ color: 'blue' }}>
                                <CheckCircleOutlineIcon />
                            </div>
                        ) : null}
                    </Form.Group>

                    <Form.Group
                        className={styles['form-group']}
                        controlId="EditReport.IssueDescription"
                    >
                        <Form.Label className={styles['label']}>Description</Form.Label>
                        <Form.Control
                            name="issueDescription"
                            as="textarea"
                            rows={4}
                            placeholder="Please enter your issue description"
                            value={formik.values.issueDescription}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            className={styles['input']}
                            isInvalid={
                                formik.touched.issueDescription && !!formik.errors.issueDescription
                            }
                        />
                        {formik.touched.issueDescription && formik.errors.issueDescription ? (
                            <div className="text-danger">
                                <ErrorOutlineIcon /> {formik.errors.issueDescription}
                            </div>
                        ) : formik.touched.issueDescription && !formik.errors.issueDescription ? (
                            <div style={{ color: 'blue' }}>
                                <CheckCircleOutlineIcon />
                            </div>
                        ) : null}
                    </Form.Group>

                    <Form.Group className={styles['form-group']} controlId="EditReport.Attachments">
                        <Form.Label className={styles['label']}>Attachments</Form.Label>
                        <Form.Control
                            name="attachments"
                            type="text"
                            placeholder="Please enter your attachments"
                            value={formik.values.attachments}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            className={styles['input']}
                        />
                    </Form.Group>

                    <Form.Label className={styles['section-label']}>Status Updates</Form.Label>
                    <Form.Group className={styles['form-group']} controlId="EditReport.Email">
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

                    <Form.Group className={styles['form-group']} controlId="EditReport.Sms">
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

                    <Stack direction="horizontal" gap={3} className={styles['button-container']}>
                        <div className="my-auto"></div>
                        <ButtonLink
                            className={styles['btn-cancel']}
                            variant="secondary"
                            href={cancelHref}
                        >
                            Cancel
                        </ButtonLink>
                        <Button
                            className={styles['btn-create']}
                            variant="primary"
                            type="submit"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                submitLabel
                            )}
                        </Button>
                    </Stack>
                </div>
            </div>
        </Form>
    );
}

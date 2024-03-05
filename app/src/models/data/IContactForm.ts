/** Contactform (application model) */
export interface IContactForm {
    /** Unique contact ID */
    contactFormId: string;
    name: string;
    emailAddress: string;
    phoneNumber: string;
    email: boolean;
    sms: boolean;
    message: string;
    statusOfContactForm: string;
    dateTimeOfSubmission: string;
    dateTimeLastEdited: string;
}

/** Contactform (DynamoDB model) */
export interface IDBContactForm {
    /** Unique contact ID */
    ContactFormID: { S: string };
    Name: { S: string };
    EmailAddress: { S: string };
    PhoneNumber: { S: string };
    Email: { BOOL: boolean };
    Sms: { BOOL: boolean };
    Message: { S: string };
    StatusOfContactForm: { S: string };
    DateTimeOfSubmission: { S: string };
    DateTimeLastEdited: { S: string };
}

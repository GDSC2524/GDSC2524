/** Contact (application model) */
export interface IContactForm {
    /** Unique contact ID */
    contactId: string;
    name: string;
    emailAddress: string;
    phoneNumber: string;
    email: boolean;
    sms: boolean;
    statusOfContact: string;
    dateTimeOfSubmission: string;
    dateTimeLastEdited: string;
}

/** Contact (DynamoDB model) */
export interface IDBContactForm {
    /** Unique contact ID */
    ContactID: { S: string };
    Name: { S: string };
    EmailAddress: { S: string };
    PhoneNumber: { S: string };
    Email: { BOOL: boolean };
    Sms: { BOOL: boolean };
    StatusOfContact: { S: string };
    DateTimeOfSubmission: { S: string };
    DateTimeLastEdited: { S: string };
}

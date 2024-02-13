/** Report (application model) */
export interface IReport {
    /** Unique report ID */
    reportId: string;
    name: string;
    emailAddress: string;
    phoneNumber: string;
    reportCategory: string;
    otherCategory: string;
    address: string;
    gpsCoordinates: string;
    issueDescription: string;
    attachments: string;
    email: boolean;
    sms: boolean;
    statusOfReport: string;
    dateTimeOfSubmission: string;
    dateTimeLastEdited: string;
}

/** Report (DynamoDB model) */
export interface IDBReport {
    /** Unique report ID */
    ReportID: { S: string };
    Name: { S: string };
    EmailAddress: { S: string };
    PhoneNumber: { S: string };
    ReportCategory: { S: string };
    OtherCategory: { S: string };
    Address: { S: string };
    GpsCoordinates: { S: string };
    IssueDescription: { S: string };
    Attachments: { S: string };
    Email: { BOOL: boolean };
    Sms: { BOOL: boolean };
    StatusOfReport: { S: string };
    DateTimeOfSubmission: { S: string };
    DateTimeLastEdited: { S: string };
}

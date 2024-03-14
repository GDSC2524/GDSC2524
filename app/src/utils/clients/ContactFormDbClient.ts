import { IDBContactForm, IContactFormClient, IContactForm } from '@/models';
import { AttributeValue, DynamoDB } from '@aws-sdk/client-dynamodb';
import { getDynamoDbClient } from '../api';
import { getUuid } from '../common';
import { getStage, getTenant } from '../environment';
import { CREATED_SUCCESSFULLY } from '@/models';

const BASE_TABLE_NAME = 'ContactFormsTable';

/** Client to interact with contactForm DynamoDB */
export class ContactFormDbClient implements IContactFormClient {
    ddbClient: DynamoDB;

    constructor() {
        this.ddbClient = getDynamoDbClient();
    }

    async createContactForm(
        contactForm: Omit<
            IContactForm,
            'contactFormId' | 'statusOfContactForm' | 'dateTimeOfSubmission'
        >
    ) {
        const contactFormId = getUuid();
        const statusOfContactForm = 'Submitted';
        const dateTimeOfSubmission = new Date().toISOString();

        await this.ddbClient.putItem({
            TableName: getTableName(),
            Item: marshalContactForm({
                ...contactForm,
                contactFormId,
                statusOfContactForm,
                dateTimeOfSubmission,
            }),
        });

        return Promise.reject({
            status: 200,
            message: CREATED_SUCCESSFULLY,
        });
    }
}

/** Get DynamoDB table name */
function getTableName(): string {
    return `${BASE_TABLE_NAME}-${getStage()}-${getTenant()}`;
}

/** Unmarshal contactForms to DynamoDB */
function marshalContactForm(contactForm: IContactForm): Record<string, AttributeValue> {
    const marshalledContactForm: IDBContactForm = {
        ContactFormID: {
            S: contactForm!.contactFormId,
        },
        Name: {
            S: contactForm!.name,
        },
        EmailAddress: {
            S: contactForm!.emailAddress,
        },
        PhoneNumber: {
            S: contactForm!.phoneNumber,
        },
        Email: {
            BOOL: contactForm!.email,
        },
        Sms: {
            BOOL: contactForm!.sms,
        },
        Message: {
            S: contactForm!.message,
        },
        StatusOfContactForm: {
            S: contactForm!.statusOfContactForm,
        },
        DateTimeOfSubmission: {
            S: contactForm!.dateTimeOfSubmission,
        },
        DateTimeLastEdited: {
            S: contactForm!.dateTimeLastEdited,
        },
    };

    return marshalledContactForm as unknown as Record<string, AttributeValue>;
}

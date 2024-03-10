import { IDBContactForm, IContactFormClient, IContactForm } from '@/models';
import { AttributeValue, DynamoDB } from '@aws-sdk/client-dynamodb';
import { getDynamoDbClient } from '../api';
import { getUuid, isUndefined } from '../common';
import { getStage, getTenant } from '../environment';
import { NOT_FOUND } from '@/models';

const BASE_TABLE_NAME = 'ContactFormsTable';
const CATEGORY_INDEX_NAME = 'ContactFormCategoryIndex';
const STATUS_INDEX_NAME = 'ContactFormStatusIndex';

/** Client to interact with contactForm DynamoDB */
export class ContactFormDbClient implements IContactFormClient {
    ddbClient: DynamoDB;

    constructor() {
        this.ddbClient = getDynamoDbClient();
    }

    async createContactForm(contactForm: Omit<IContactForm, 'contactFormId'>): Promise<IContactForm | undefined> {
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

        return this.getContactForm(contactFormId);
    }

    async getContactForm(contactFormId: string): Promise<IContactForm | undefined> {
        const key: Pick<IDBContactForm, 'ContactFormID'> = {
            ContactFormID: {
                S: contactFormId,
            },
        };

        try {
            const getData = await this.ddbClient.getItem({
                TableName: getTableName(),
                Key: key,
            });

            return unmarshalContactForm(getData.Item as unknown as IDBContactForm);
        } catch (error) {
            return Promise.reject({
                status: 404,
                message: NOT_FOUND,
            });
        }
    }

    async listContactForms(paginationToken?: string | undefined): Promise<{ contactForms: IContactForm[]; paginationToken: string | undefined; }> {
        const scanData = await this.ddbClient.scan({
            TableName: getTableName(),
        });

        return {
            contactForms: unmarshalContactForms(scanData.Items as unknown as IDBContactForm[]),
            paginationToken: undefined,
        };
    }

    async listContactFormsByStatus(status: string, ascending?: boolean | undefined, paginationToken?: string | undefined): Promise<{ contactForms: IContactForm[]; paginationToken: string | undefined; }> {
        const queryData = await this.ddbClient.query({
            TableName: getTableName(),
            IndexName: STATUS_INDEX_NAME,
            KeyConditionExpression: '#status = :status',
            ExpressionAttributeNames: {
                '#status': 'StatusOfContactForm',
            },
            ExpressionAttributeValues: {
                ':status': {
                    S: status,
                },
            },
            ScanIndexForward: ascending ?? false,
        });

        return {
            contactForms: unmarshalContactForms(queryData.Items as unknown as IDBContactForm[]),
            paginationToken: undefined,
        };
    }


    async putContactForm(contactForm: IContactForm) {
        const dateTimeLastEdited = new Date().toISOString();

        await this.ddbClient.putItem({
            TableName: getTableName(),
            Item: marshalContactForm({ ...contactForm, dateTimeLastEdited }),
        });

        return this.getContactForm(contactForm.contactFormId);
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

/** Unmarshal ContactForms from DynamoDB */
function unmarshalContactForms(contactForms?: IDBContactForm[]): IContactForm[] {
    return contactForms?.map((contactForm) => unmarshalContactForm(contactForm)!) || [];
}

/** Unmarshal portfolio from DynamoDB */
function unmarshalContactForm(contactForm?: IDBContactForm): IContactForm | undefined {
    if (isUndefined(contactForm)) {
        return;
    }

    return {
        contactFormId: contactForm?.ContactFormID?.S!,
        name: contactForm?.Name?.S!,
        emailAddress: contactForm?.EmailAddress?.S!,
        phoneNumber: contactForm?.PhoneNumber?.S!,
        email: contactForm?.Email?.BOOL!,
        sms: contactForm?.Sms?.BOOL!,
        message: contactForm?.Message?.S!,
        statusOfContactForm: contactForm?.StatusOfContactForm?.S!,
        dateTimeOfSubmission: contactForm?.DateTimeOfSubmission?.S!,
        dateTimeLastEdited: contactForm?.DateTimeLastEdited?.S!,
    };
}

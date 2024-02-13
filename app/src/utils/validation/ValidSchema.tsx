import * as Yup from 'yup';
import { ReportCategories } from '@/models';

// Validate names, emails, phone numbers, and addresses
// Name regex - allows unicode characters, spaces, and must not be empty
const nameRegExp = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi;

// Email regex - allows most valid email formats including TLDs
const emailRegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Phone regex - allows optional country code, area code, spaces/dashes
const phoneRegExp = /^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d$/;

// Address regex - allows letters, numbers, commas, dashes, apostrophes, min length 3
const addressRegExp = /^[a-zA-Z0-9\s,'-]{3,}$/;

// Validate that either email address or phone number is provided
const validateEmailOrPhone = function (this: Yup.TestContext) {
    const { emailAddress, phoneNumber } = this.parent;
    if (!emailAddress && !phoneNumber) {
        return false;
    }
    return true;
};

// Form validation schema
export const VALIDATION_SCHEMA = Yup.object({
    name: Yup.string()
        .matches(nameRegExp, 'Name Can Only Contain Latin Letters!')
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Name is Required!'),
    emailAddress: Yup.string()
        .test(
            'eitherEmailOrPhone',
            'Either Email Address or Phone Number is Required!',
            validateEmailOrPhone
        )
        .when('email', {
            is: true,
            then: () =>
                Yup.string()
                    .required('Email Address is Required!')
                    .matches(emailRegExp, 'Invalid Email Address!'),
        }),
    phoneNumber: Yup.string()
        .test(
            'eitherEmailOrPhone',
            'Either Email Address or Phone Number is Required!',
            validateEmailOrPhone
        )
        .when('sms', {
            is: true,
            then: () =>
                Yup.string()
                    .required('Phone Number is Required!')
                    .matches(phoneRegExp, 'Invalid Phone Number!'),
        }),
    reportCategory: Yup.mixed().required('Category is Required!'),
    otherCategory: Yup.string().when('reportCategory', {
        is: ReportCategories.Other,
        then: () => Yup.string().required('Other Category is Required!'),
    }),
    address: Yup.string()
        .matches(addressRegExp, 'Invalid Address!')
        .required('Address is Required!'),
    issueDescription: Yup.string().max(1000, 'Too Long!').optional(),
    email: Yup.boolean(),
    sms: Yup.boolean(),
});

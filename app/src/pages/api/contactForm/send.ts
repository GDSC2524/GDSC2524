import {
    SENDER_EMAIL,
    HOST_SENDING,
    ERROR_PARAMETTER,
    PORT,
    MESSAGE_SENT,
    Email_data,
} from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as nodemailer from 'nodemailer';
import { IContactForm } from '@/models';
import { env } from 'process';

export interface ISendEmailResponse {
    contactForm: IContactForm;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const transporter = nodemailer.createTransport({
        host: HOST_SENDING,
        port: PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: SENDER_EMAIL,
            pass: process.env.SMTP_PASS,
        },
    });
    const name = req.body.contactForm.name;
    const email = req.body.contactForm.emailAddress;

    //console.log(req.body.contactForm.name);
    if (!email || !name) {
        return res.status(400).json({ message: ERROR_PARAMETTER });
    }

    // https://nodemailer.com/message/#common-fields
    const mailData = {
        from: SENDER_EMAIL,
        to: email,
        subject: Email_data.subject,
        text: Email_data.text,
        html: Email_data.html,
    };

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailData, (err: Error | null, info) => {
            if (err) {
                reject(err);
                return res.status(500).json({ error: err.message || 'Something went wrong' });
            } else {
                resolve(info.accepted);
                res.status(200).json({ message: MESSAGE_SENT });
            }
        });
    });
}

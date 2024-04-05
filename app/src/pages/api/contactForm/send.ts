import type { NextApiRequest, NextApiResponse } from 'next';
import * as nodemailer from 'nodemailer';
import { IContactForm } from '@/models';

export interface ISendEmailResponse {
    contactForm: IContactForm;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'toantoan123toantoan@gmail.com',
            pass: 'yTI9rVHXp8F7GbPR',
        },
    });

    //const { name, email, message } = req.body;
    const name = req.body.contactForm.name;
    const email = req.body.contactForm.emailAddress;

    //console.log(req.body.contactForm.name);
    if (!email || !name) {
        return res.status(400).json({ message: 'Please fill out the necessary fields' });
    }

    // https://nodemailer.com/message/#common-fields
    const mailData = {
        from: 'toantoan123toantoan@gmail.com',
        to: email,
        subject: `Message from ${name}`,
        text: `Hi, My name is Toan`,
        html: `<div>This is an email </div><p>Sent from: ${email}</p>`,
    };

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailData, (err: Error | null, info) => {
            if (err) {
                reject(err);
                return res.status(500).json({ error: err.message || 'Something went wrong' });
            } else {
                resolve(info.accepted);
                res.status(200).json({ message: 'Message sent!' });
            }
        });
    });
}

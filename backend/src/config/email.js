import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER;

const transporter = hasSmtpConfig
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })
    : null;

export const sendEmail = async ({ to, subject, text, html }) => {
    const from =
        process.env.EMAIL_FROM ||
        process.env.SMTP_FROM ||
        'FormationsGes <no-reply@formationsges.com>';

    if (resendClient) {
        const toArray = Array.isArray(to) ? to : [to];

        const { error } = await resendClient.emails.send({
            from,
            to: toArray,
            subject,
            text,
            html: html || (text ? `<pre>${text}</pre>` : undefined)
        });

        if (error) {
            throw error;
        }

        return;
    }

    if (transporter) {
        return transporter.sendMail({
            from,
            to,
            subject,
            text,
            html
        });
    }

    console.warn('Aucun fournisseur email configuré. Email non envoyé mais flux continué.');
    return;
};

export default sendEmail;

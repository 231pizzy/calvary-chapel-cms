
import { createTransport } from 'nodemailer'

export default function sendEmail({ toEmail, fromEmail, fromHeading, replyTo, password, subject, text, html, }) {
    const payload = {
        from: fromHeading,
        to: toEmail,
        subject: subject,
        replyTo,
        text: text,
        html: html
    };

    console.log('payload', payload);

    const setting = {
        // service: 'gmail',
        host: 'smtp.dreamhost.com',
        port: 465,
        secure: true,
        name: 'smtp.dreamhost.com',
        debug: true,
        auth: {
            user: fromEmail || process.env.EMAIL,
            pass: password || process.env.EMAIL_PASSWORD
        }
    };


    let transporter = createTransport(setting);

    return new Promise((resolve, reject) => {
        console.log('sending...');

        transporter.sendMail(payload, (err, result) => {
            if (err) {
                console.log('mailing err', err);
                resolve(false)
            }
            else {
                resolve(result)
            }
        })
    })
}
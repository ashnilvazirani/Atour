const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
// var sgTransport = require('nodemailer-sendgrid-transport');


module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstname = user.name.split(' ')[0];
        this.url = url;
        this.from = `Ashnil Vazirani <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        // if (process.env.NODE_ENV == 'production') {
        //     return nodemailer.createTransport({
        //         service: 'SendGrid',
        //         auth: {
        //             user: process.env.SENDGRID_USERNAME,
        //             password: process.env.SENDGRID_PASSWORD,
        //         }
        //     })
        // }

        return nodemailer.createTransport(({
            service: 'SendGrid',
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            }
        }));
        // return nodemailer.createTransport({
        //     host: "smtp.mailtrap.io",
        //     port: 2525,
        //     auth: {
        //         user: "c7c911a43ff0b2",
        //         pass: "cf8340db9a57bb"
        //     }
        // });
    }

    async send(template, subject) {
        //send a actual email
        // 1)Render the pug template
        const htmlContent = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstname,
            url: this.url,
            subject
        });
        // 2)define the mailing options

        const mailOption = {
            from: this.from,
            to: this.to,
            subject,
            html: htmlContent,
            text: htmlToText.fromString(htmlContent),
            //text can also have HTML data
        }

        // 3)create a transporter
        this.newTransport().sendMail(mailOption, function (error, info) {
            if (error) {
                console.log(error)
            }
            if (info) {
                console.log('email sent')
                console.log(info.response);
            }
        });
    }

    async sendWelcome() {
        await this.send('welcome', 'Hey, there! welcome to ATOURS😍')
    }
    async sendPasswordReset() {
        await this.send('resetPassword', 'Hey, Dw, even if you forgot your password 😁')
    }
}
// exports.sendEmail = async options => {
//CREATE A TRANSPORTER
// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD
//     },
// })
//     var transporter = nodemailer.createTransport({
//         host: "smtp.mailtrap.io",
//         port: 2525,
//         auth: {
//             user: "c7c911a43ff0b2",
//             pass: "cf8340db9a57bb"
//         }
//     });
//     //DEFINE THE OPTIONS
//     const mailOption = {
//         from: 'Ashnil Vazirani <service@atours.io>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         //text can also have HTML data
//     }
//     //ACTUALLY SEND THE EMAIL

// }
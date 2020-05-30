const nodemailer = require('nodemailer');

exports.sendEmail = async options => {
    //CREATE A TRANSPORTER
    // const transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     auth: {
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD
    //     },
    // })
    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "c7c911a43ff0b2",
            pass: "cf8340db9a57bb"
        }
    });
    //DEFINE THE OPTIONS
    const mailOption = {
        from: 'Ashnil Vazirani <service@atours.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        //text can also have HTML data
    }
    //ACTUALLY SEND THE EMAIL
    await transporter.sendMail(mailOption)
}
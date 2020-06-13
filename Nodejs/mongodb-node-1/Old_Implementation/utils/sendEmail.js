const nodemailer = require('nodemailer')

const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })


    const mailOptions = {
        from: 'The Code Company',
        to: options.email,
        subject: options.subject,
        text: options.message,
    }


    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
import nodemailer from "nodemailer";
import logger from './../config/logger.js';


const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ramtharu191@gmail.com",
        pass: "djyqneepraocauba"
    }
})

const getEmailTemplate = (subject, content, userInfo) => {
    return `
        <html>
            <body>
                <img src="${process.env.COMPANY_LOGO} alt="${process.env.COMPANY_NAME} Logo" style="width:200px">
                <h1>${process.env.COMPANY_NAME}</h1>
                <h2>${subject}</h2>
                <p>${content}</p>
                <p>User Info: </p>
                <ul>
                    ${Object.entries(userInfo).map(([key, value]) => `<li>${key}: ${value}</li>`).join("")}

                </ul>
                <p>Thank you, <br> ${process.env.COMPANY_NAME} Team</p>
            </body>
        </html>
    `
}


const sendEmail = async (subject, content, userInfo, to) => {
    const html = getEmailTemplate(subject, content, userInfo)

    try {
        await transport.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: `${process.env.COMPANY_NAME} - ${subject}`,
            html
        })

        logger.info("Email sent", { to, subject })
    } catch (err) {
        logger.error("Email send failed")
        throw err
    }
}

const sendOTP = async (to, otp, userInfo) => {
    const content = `Your OTP is <strong>${otp}</strong>. It expires in 5min`

    await sendEmail(to, 'OTP verification', content, userInfo)
}

const sendWelcomeEmail = async (to, userInfo) => {
    const content = `Welcome to ${process.env.COMPANY_NAME}! Your is set up.`

    await sendEmail(to, 'Welcome', content, userInfo)
}


export { sendEmail, sendOTP, sendWelcomeEmail };


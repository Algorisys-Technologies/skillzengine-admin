const config = require("../Config/configuration");
const nodemailer = require('nodemailer');

let transporter = null;

const sendEmail = async (mailOptions) => {
    try {

        if (transporter === null) {
            transporter = nodemailer.createTransport({
                host: config.host,
                port: config.port,
                secure: config.secure, // use SSL
                auth: config.auth
            });
        }
        let response = await transporter.sendMail(mailOptions);

        return response;
    }
    catch (e) {
        res.json('Error occured while sending email ');
    }
}

module.exports = {
    sendEmail
}
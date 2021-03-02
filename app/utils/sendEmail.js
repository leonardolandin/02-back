const Mailer = require('nodemailer');
require('dotenv/config');

const sendEmail = async (sendObj) => {

    try {
        let sender  = Mailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        })
    
        sendObj.from = process.env.EMAIL;
    
        return sender.sendMail(sendObj).then(response => {
            return new Promise((resolve, reject) => {
                resolve(response)
            })
        }).catch(err => {
            return new Promise((resolve, reject) => {
                resolve(err)
            })
        })
    } catch (e) {
        return new Promise((resolve, reject) => {
            resolve(e)
        })
    }

}

module.exports = sendEmail;
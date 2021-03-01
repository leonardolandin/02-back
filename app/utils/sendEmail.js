const Mailer = require('nodemailer');

const sendEmail = (sendObj) => {
    let sender  = Mailer.createTransport({
        host: '',
        service: '',
        port: 587,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    })

    sendObj.from = process.env.EMAIL;

    sender.sendMail(sendObj).then(response => {
        console.log(response)
    }).catch(err => {
        console.log(err)
    })
}

module.exports = sendEmail;
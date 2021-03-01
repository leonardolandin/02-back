const UserValidator = require('../../utils/user');
const Sender = require('../../utils/sendEmail');
const UserDAO = require('../../dao/UserDAO');
const Crypt = require('../../utils/crypt');
const moment = require('moment-timezone');

module.exports = (req, res) => {
    const ValidationException = (response, message, status) => {
        let sendObject = {
            message: message
        }
        response.status(status);
        response.send(sendObject);
    }

    const ValidationEmail = (email) => {
        let track = UserValidator.validateRememberEmail(email);

        if(track.message) {
            return ValidationException(res, track.message, track.status);
        } else {
            return true;
        }
    }

    let email = req.body.email;

    if(ValidationEmail(email)) {
        UserDAO.getUserByEmail(email).then(data => {
            if(data != null) {
                let token = Crypt.createRandomBytes(16, 'hex');

                let date = new Date();
                date.setMinutes(date.getMinutes() + 20);
                date = moment(date).tz("America/Sao_Paulo").format('YYYY-MM-DDTHH:mm:ss');

                let rememberObj = {
                    token: token,
                    user: data._id,
                    expire: date,
                    active: true
                }

                console.log(typeof date)

                UserDAO.createNewTransaction(rememberObj).then(dataTransaction => {
                    //rememberObj.message = `A redefinição de senha foi enviada para o e-mail: ${data.email}`;

                    let emailSender = {
                        to: data.email,
                        subject: "Recuperação de senha - 02",
                        text: `Acesse para recuperar a sua senha: /n ${req.headers.referer}/${rememberObj.token}` 
                    }

                    Sender(emailSender);

                }).catch(error => {

                })
            }
        }).catch(error => {
            console.log(error);
        })
    }
}
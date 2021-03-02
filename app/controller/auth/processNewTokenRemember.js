const UserValidator = require('../../utils/user');
const Sender = require('../../utils/sendEmail');
const UserDAO = require('../../dao/UserDAO');
const Crypt = require('../../utils/crypt');
const moment = require('moment-timezone');
const Constants = require('../../utils/constants');

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

                UserDAO.createNewTransaction(rememberObj).then(dataTransaction => {
                    let emailSender = {
                        to: data.email,
                        subject: "Recuperação de senha - 02",
                        text: `Acesse para recuperar a sua senha: ${req.headers.referer}/${rememberObj.token}` 
                    }

                    Sender(emailSender).then(email => {
                        if(email.response.includes('250') || email.response.includes('OK')) {
                            responseObj = {
                                remember: rememberObj,
                                message: `A redefinição de senha foi enviada para o e-mail:`,
                                email: data.email
                            }

                            res.status(Constants.STATUS.OK);
                            res.send(responseObj);
                        }
                    }).catch(erro => {
                        ValidationException(res, "Ocorreu um erro ao enviar o e-mail", Constants.STATUS.INTERNAL_ERROR);
                    })

                }).catch(error => {
                    ValidationException(res, "Ocorreu um erro inesperado", Constants.STATUS.INTERNAL_ERROR);
                })
            } else {
                ValidationException(res, "Não existe nenhum cadastro com esse e-mail", Constants.STATUS.FORBIDDEN);
            }
        }).catch(error => {
            ValidationException(res, "Ocorreu um erro inesperado", Constants.STATUS.FORBIDDEN);
        })
    }
}
const UserDAO = require('../../dao/UserDAO');
const https = require('https');
const jwt = require('jsonwebtoken');
const Crypt = require('../../utils/crypt');
const Constants = require('../../utils/constants');
require('dotenv/config');


module.exports = (req, res) => {
    const ValidateCredentials = (objUser) => {
        if(objUser && objUser.email && objUser.email.length > 254) {
            return ValidationException('O e-mail não pode conter mais de 254 caracteres', res)
        }
        if(objUser && objUser.email && !objUser.email.includes('@')) {
            return ValidationException('O e-mail inserido não contém um formato de e-mail válido (@)', res)
        }
        if(objUser && objUser.name && objUser.name.length > 120) {
            return ValidationException('O nome não pode conter mais de 120 caracteres', res)
        }
        if(objUser && objUser.password && objUser.password.length > 128) {
            return ValidationException('A senha não pode conter mais de 128 caracteres', res)
        }
        if(objUser && objUser.password && objUser.passwordConfirmed) {
            if(objUser.password !== objUser.passwordConfirmed) {
                return ValidationException('As senhas não conferem', res)
            }
        }
        if(objUser && objUser.password && objUser.password.length <= 6 && objUser.passwordConfirmed && objUser.passwordConfirmed.length <= 6) {
            return ValidationException('A senha precisa conter mais de 6 caracteres', res)
        }

        return true;
    }

    const ValidationException = (message, response) => {
        let sendObject = {
            message: message
        }
        response.status(Constants.STATUS.UNAUTHORIZED)
        response.send(sendObject)
    }

    let dataUser = req.body;

    if(dataUser && ValidateCredentials(dataUser)) {
        UserDAO.getUserByEmail(dataUser.email).then((data) => {
            let userExist = data;

            if(userExist === null) {
                const secretRecaptcha = process.env.RECAPTCHA_KEY;
                const recaptchaVerification = `https://www.google.com/recaptcha/api/siteverify?secret=${secretRecaptcha}&response=${dataUser.recaptcha}&remoteip=${req.connection.remoteAddress}`;

                https.get(recaptchaVerification, (response) => {
                    let dataRaw = '';
                    response.on('data', (dataRawTO) => { dataRaw += dataRawTO })
                    response.on('end', () => {
                        try {
                            let userToken = jwt.sign(dataUser, process.env.JWT, {expiresIn: "12h"});
                            let parsedResponse = JSON.parse(dataRaw);

                            if(userToken !== null && parsedResponse !== null && parsedResponse.success) {
                                let dateNow = new Date();
                                dateNow.setSeconds(0, 0);
                                dataUser.password = Crypt.encryptPassword(dataUser.password);
                                dataUser.passwordConfirmed = data.password;

                                dataUser.token = userToken;
                                dataUser.active = true;
                                dataUser.completeRegister = true;
                                dataUser.created = dateNow;
                                dataUser.modificated = null;

                                UserDAO.createNewUser(dataUser).then((result) => {
                                    let responseData = {
                                        user: dataUser
                                    }

                                    res.status(Constants.STATUS.CREATED)
                                    res.send(responseData);
                                })
                            }
                        } catch (e) {
                            return ValidationException('Ocorreu um erro inesperado', res)
                        }
                    })
                })
            } else {
                return ValidationException('O e-mail já está cadastrado no site', res)
            }
        })
    }
}
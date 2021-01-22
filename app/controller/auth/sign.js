const UserDAO = require('../../dao/UserDAO');
const jwt = require('jsonwebtoken');
const Crypt = require('../../utils/crypt');
const Constants = require('../../utils/constants');
const UserUtils = require('../../utils/user');
const http = require('../../config/axios');
require('dotenv/config');


module.exports = (req, res) => {
    const ValidateCredentials = (objUser) => {
        let track = UserUtils.validateSign(objUser);

        if(track.message) {
            return ValidationException(res, track.message, track.status);
        } else {
            return true;
        }
    }

    const ValidationException = (response, message, codeError) => {
        let sendObject = {
            message: message,
            error: codeError
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

                http.get(recaptchaVerification).then(response => {
                    try {
                        let userToken = jwt.sign(dataUser, process.env.JWT, {expiresIn: "12h"});
                        let parsedResponse = response.data;

                        if(userToken !== null && parsedResponse !== null && parsedResponse.success) {
                            let dateNow = new Date();
                            dateNow.setSeconds(0, 0);
                            dataUser.password = Crypt.encryptPassword(dataUser.password);

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
                        return ValidationException(res ,'Ocorreu um erro inesperado', e)
                    }
                })
            } else {
                return ValidationException(res ,'O e-mail já está cadastrado no site')
            }
        })
    }
}
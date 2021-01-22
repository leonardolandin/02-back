const UserDAO = require('../../dao/UserDAO');
const jwt = require('jsonwebtoken');
const http = require('../../config/axios');
const Constants = require('../../utils/constants');
const Crypt = require('../../utils/crypt');
const UserUtils = require('../../utils/user');

require('dotenv/config');

module.exports = (req, res) => {
    const ValidationException = (response, message, status) => {
        let sendObject = {
            message: message
        }
        response.status(status)
        response.send(sendObject)
    }

    const ValidationUser = (user) => {
        let track = UserUtils.validateLogin(user);

        if(track.message) {
            return ValidationException(res, track.message, track.status);
        } else {
            return true;
        }
    }

    let dataUser = req.body;

    if(ValidationUser(dataUser)) { 
        UserDAO.getUserByEmail(dataUser.email).then((data) => {
            let dataDAO = data;
            if(dataDAO === null) {
               return ValidationException(res, 'Não existe um usuário com esse e-mail', Constants.STATUS.FORBIDDEN) 
            }

            dataDAO.password = Crypt.decryptPassword(dataDAO.password);

            if(dataUser.email == dataDAO.email && dataUser.password == dataDAO.password) {
                const secretKey = process.env.RECAPTCHA_KEY;
                const recaptchaVerification = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${dataUser.recaptcha}&remoteip=${req.connection.remoteAddress}`;
                let userID = dataDAO.id;

                http.get(recaptchaVerification).then(response => {
                        try {
                            let responseData = response.data;
                            let userToken = jwt.sign(dataUser, process.env.JWT, {expiresIn: "12h"});

                            if(responseData.success) {
                                if(userToken !== null) {
                                    UserDAO.setNewToken(userID, userToken).then((resp) => {
                                        if(responseData != null) {
                                            let sendData = {
                                                user: {
                                                    name: dataDAO.name,
                                                    email: dataDAO.email,
                                                    token: userToken,
                                                    created: dataDAO.created,
                                                    password: dataDAO.password
                                                },
                                                recaptcha: responseData
                                            }
                                            res.status(Constants.STATUS.OK)
                                            res.send(sendData)
                                        }  
                                    })
                                }
                            }
                        } catch (e) {
                            return ValidationException(res, e, Constants.STATUS.FORBIDDEN)
                        }
                })
            } else {
                return ValidationException(res, 'Usuário com essas credenciais não existe', Constants.STATUS.FORBIDDEN)
            }
        })

    }
}
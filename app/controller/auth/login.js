const UserDAO = require('../../dao/UserDAO');
const Crypt = require('../../utils/crypt');
const jwt = require('jsonwebtoken');
const Constants = require('../../utils/constants');
const http = require('../../config/axios');

require('dotenv/config');

module.exports = (req, res) => {
    const ValidationException = (message, response) => {
        let sendObject = {
            message: message
        }
        response.status(Constants.STATUS.UNAUTHORIZED)
        response.send(sendObject)
    }

    const ValidationUser = (user) => {
        if(user.email && user.password) {
            if(user.email.length > 254) {
                return ValidationException('O e-mail não pode conter mais de 254 caracteres', res)
            }
            if(!user.email.includes('@')) {
                return ValidationException('O e-mail inserido não contém um formato de e-mail válido (@)', res)
            }
            if(user.password.length > 128) {
                return ValidationException('A senha não pode conter mais de 128 caracteres', res)
            }
        } else {
            return ValidationException('Nenhum campo preenchido', res)
        }

        return true
    }

    let dataUser = req.body;

    if(ValidationUser(dataUser)) { 
        UserDAO.getUserByEmail(dataUser.email).then((data) => {
            let dataDAO = data;
            if(dataDAO === null) {
               return ValidationException('Não existe um usuário com esse e-mail', res) 
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
                            res.status(Constants.STATUS.UNAUTHORIZED)
                            res.send(e)
                        }
                })
            } else {
                return ValidationException('Usuário com essas credenciais não existe', res)
            }
        })

    }
}
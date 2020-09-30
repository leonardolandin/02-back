const UserDAO = require('../../dao/UserDAO');
const Crypt = require('../../utils/crypt')
const https = require('https');
const jwt = require('jsonwebtoken');
const Constants = require('../../utils/constants')

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

            if(dataUser.email == dataDAO.email && dataUser.password == dataDAO.password && dataUser.recaptcha.length) {
                const secretKey = process.env.RECAPTCHA_KEY;
                const recaptchaVerification = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${dataUser.recaptcha}&remoteip=${req.connection.remoteAddress}`;
                let userID = dataDAO.id;

                https.get(recaptchaVerification, (response) => {
                    let dataRaw = '';
                    response.on('data', (dataRawTO) => { dataRaw += dataRawTO })
                    response.on('end', () => {
                        try {
                            let userToken = jwt.sign(dataUser, process.env.JWT, {expiresIn: "12h"});
                            let parsedResponse = JSON.parse(dataRaw);

                            if(userToken !== null) {
                                UserDAO.setNewToken(userID, userToken).then((resp) => {
                                    if(parsedResponse != null) {
                                        let responseData = {
                                            user: dataDAO,
                                            recaptcha: parsedResponse
                                        }
                                        res.status(Constants.STATUS.OK)
                                        res.send(responseData)
                                    }  
                                })
                            }
                        } catch (e) {
                            res.status(Constants.STATUS.UNAUTHORIZED)
                            res.send(e)
                        }
                    })
                })
            } else {
                return ValidationException('Usuário com essas credenciais não existem', res)
            }
        })

    }
}
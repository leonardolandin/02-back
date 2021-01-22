const Constants = require('./constants');

let userUtils = {
    validateLogin: function(dataUser) {
        if(dataUser.email && dataUser.password) {
            if(dataUser.email.length > 254) {
                return {
                    message: 'O e-mail não pode conter mais de 254 caracteres',
                    status: Constants.STATUS.FORBIDDEN
                }
            }
            if(!dataUser.email.includes('@')) {
                return {
                    message: 'O e-mail inserido não contém um formato de e-mail válido (@)',
                    status: Constants.STATUS.FORBIDDEN
                }
            }
            if(dataUser.password.length > 128) {
                return {
                    message: 'A senha não pode conter mais de 128 caracteres',
                    status: Constants.STATUS.FORBIDDEN
                }
            }

            return true
        } else if(!dataUser.email) {
            return {
                message: 'Campo e-mail não preenchido',
                status: Constants.STATUS.FORBIDDEN
            }
        } else if(!dataUser.password) {
            return {
                message: 'Campo senha não preenchido',
                status: Constants.STATUS.FORBIDDEN
            }
        } else {
            return {
                message: 'Nenhum campo preenchido',
                status: Constants.STATUS.FORBIDDEN
            }
        }
    },
    validateSign: function() {
        if(objUser && objUser.email && objUser.email.length > 254) {
            return {
                message: 'O e-mail não pode conter mais de 254 caracteres',
                status: Constants.STATUS.FORBIDDEN 
            }
        }
        if(objUser && objUser.email && !objUser.email.includes('@')) {
            return {
                message: 'O e-mail inserido não contém um formato de e-mail válido (@)',
                status: Constants.STATUS.FORBIDDEN 
            }
        }
        if(objUser && objUser.name && objUser.name.length > 120) {
            return {
                message: 'O nome não pode conter mais de 120 caracteres',
                status: Constants.STATUS.FORBIDDEN 
            }
        }
        if(objUser && objUser.password && objUser.password.length > 128) {
            return {
                message: 'A senha não pode conter mais de 128 caracteres',
                status: Constants.STATUS.FORBIDDEN 
            }
        }
        if(objUser && objUser.password) {
            if(objUser.password !== objUser.passwordConfirmed) {
                return {
                    message: 'As senhas não conferem',
                    status: Constants.STATUS.FORBIDDEN 
                }
            }
        }
        if(objUser && objUser.password && objUser.password.length <= 6 && objUser.passwordConfirmed && objUser.passwordConfirmed.length <= 6) {
            return {
                message: 'A senha precisa conter mais de 6 caracteres',
                status: Constants.STATUS.FORBIDDEN 
            }
        }

        return true;
    }
}


module.exports = userUtils
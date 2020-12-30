const User = require('../model/UserModel')
const MongoDB = require('../database')
const UserDAO = {}

UserDAO.getUserByEmail = async function(objCredentials) {
    if(MongoDB.connect()) {
        return User.findOne({'email': objCredentials, 'active': true}, (err, result) => {
            return new Promise((resolve, reject) => {
                resolve(result)
                MongoDB.close();
            })
        })
    }
}

UserDAO.setNewToken = async function(userId, newToken) {
    if(MongoDB.connect()) {
        return User.updateOne({_id: userId}, { token: newToken } ,(err, result) => {
            return new Promise((resolve, reject) => {
                resolve(result)
            })
        })
    }
}

UserDAO.getUserById = async function(idUser) {
    if(MongoDB.connect()) {
        return User.findOne({'_id': idUser}, (err, result) => {
            return new Promise((resolve, reject) => {
                resolve(result)
                MongoDB.close();
            })
        })
    }
}

UserDAO.createNewUser = async function(newUserCredentials) {
    if(MongoDB.connect()) {
        return User.insertMany(newUserCredentials, (err, result) => {
            return new Promise((resolve, reject) => {
                resolve(result)
            })
        })
    }
}

module.exports = UserDAO;
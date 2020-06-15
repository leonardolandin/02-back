const mongoDB = require('../database');
const User = require('../model/UserModel')
const UserDAO = {}

UserDAO.getUserByEmail = async function(objCredentials) {
    return User.findOne({'email': objCredentials}, (err, result) => {
        return new Promise((resolve, reject) => {
            resolve(result)
        })
    })
}

UserDAO.setNewToken = async function(userId, newToken) {
    return User.updateOne({_id: userId}, {
        token: newToken
    } ,(err, result) => {
        return new Promise((resolve, reject) => {
            resolve(result)
        })
    })
}

UserDAO.getUserById = async function(idUser) {
    return User.findOne({'_id': idUser}, (err, result) => {
        return new Promise((resolve, reject) => {
            resolve(result)
        })
    })
}

module.exports = UserDAO;
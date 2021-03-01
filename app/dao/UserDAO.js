const User = require('../model/UserModel');
const TransactionsRemember = require('../model/TransactionsRemember');

const UserDAO = {}

UserDAO.getUserByEmail = async function(email) {
    return User.findOne({'email': email, 'active': true}, (err, result) => {
        return new Promise((resolve, reject) => {
            resolve(result)
        })
    })
}

UserDAO.setNewToken = async function(userId, newToken) {
    return User.updateOne({_id: userId}, { token: newToken } ,(err, result) => {
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

UserDAO.createNewUser = async function(newUserCredentials) {
    return User.insertMany(newUserCredentials, (err, result) => {
        return new Promise((resolve, reject) => {
            resolve(result)
        })
    })
}

UserDAO.createNewTransaction = async function(transaction) {
    return TransactionsRemember.insertMany(transaction, (err, result) => {
        return new Promise((resolve, reject) => {
            resolve(result);
        })
    })
}

module.exports = UserDAO;
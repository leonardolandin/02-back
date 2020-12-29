const mongoDB = require('../database');

const dataSchema = new mongoDB.MongoDB.Schema({
    email: String,
    password: String,
    name: String,
    active: Boolean,
    completeRegister: Boolean,
    token: String,
    created: Date,
    modificated: Date || null
})
const User = mongoDB.MongoDB.model('user', dataSchema, 'users')

module.exports = User
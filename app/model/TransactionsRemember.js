const mongoDB = require('../database');

const dataSchema = new mongoDB.MongoDB.Schema({
    token: String,
    user: String,
    expire: Date,
    active: Boolean
})
const TransactionRemember = mongoDB.MongoDB.model('transactionRemember', dataSchema, 'transactionsRemember')

module.exports = TransactionRemember
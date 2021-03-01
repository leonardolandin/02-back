const mongoDB = require('../../database');

const dataSchema = new mongoDB.MongoDB.Schema({
    like: Boolean,
    favorite: Boolean,
    assignment: String,
    user: String
})
const ActionsAssignment = mongoDB.MongoDB.model('actionAssignment', dataSchema, 'actionsAssignment')


module.exports = ActionsAssignment 
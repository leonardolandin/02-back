const mongoDB = require('../database');

const dataSchema = new mongoDB.MongoDB.Schema({
    nameAssignment: String,
    descriptionAssignment: String,
    typeAssignment: {
        type: String,
        enum : ['INFANT','FUNDAMENTAL', 'MEDIUM', 'UPPER'],
        default: 'FUNDAMENTAL'
    },
    isAutor: Boolean,
    imageUpload: Object,
    created: String,
    modificated: String || null,
    userUploaded: String,
    active: Boolean
})
const Assignment = mongoDB.MongoDB.model('assignment', dataSchema, 'assignments')


module.exports = Assignment 
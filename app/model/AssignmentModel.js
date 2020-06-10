const mongoDB = require('../database');

const dataSchema = new mongoDB.Schema({
    nameAssignment: String,
    descriptionAssignment: String,
    typeAssignment: {
        type: String,
        enum : ['INFANT','FUNDAMENTAL', 'MEDIUM', 'UPPER'],
        default: 'FUNDAMENTAL'
    },
    isAutor: Boolean,
    imageUpload: Object,
    created: Date,
    modificated: Date || null,
    userUploaded: String
})
const Assignment = mongoDB.model('assignment', dataSchema, 'assignments')


module.exports = Assignment 
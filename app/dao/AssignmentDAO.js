const Assignment = require('../model/AssignmentModel')
const AssignmentDAO = {}

AssignmentDAO.createNewAssignment = async function(assignmentInfos) {
    return Assignment.insertMany(assignmentInfos, (err, result) => {
        return new Promise((resolve, reject) => {
            resolve(result)
        })
    })
}

AssignmentDAO.getAssignments = async function() {
    return Assignment.find({}, {_id: 1, imageUpload: 1, nameAssignment: 1} ,(err, result) => {
        return new Promise((resolve, reject) => {
            resolve(result)
        })
    })
}

AssignmentDAO.getAssignmentById = async function(idAssigment) {
    return Assignment.findOne({'_id':idAssigment}, (err, result) => {
        return new Promise((resolve, reject) => {
            resolve(result)
        })
    })
}

module.exports = AssignmentDAO;














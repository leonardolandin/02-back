const mongoDB = require('../database');
const Assignment = require('../model/AssignmentModel')
const AssignmentDAO = {}

AssignmentDAO.createNewAssignment = async function(assignmentInfos) {
    return Assignment.insertMany(assignmentInfos, (err, result) => {
        return new Promise((resolve, reject) => {
            resolve(result)
        })
    })
}

module.exports = AssignmentDAO;














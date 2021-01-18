const Assignment = require('../model/AssignmentModel')
const MongoDB = require('../database')
const AssignmentDAO = {}

AssignmentDAO.createNewAssignment = async function(assignmentInfos) {
    if(MongoDB.connect()) {
        return Assignment.insertMany(assignmentInfos, (err, result) => {
            return new Promise((resolve, reject) => {
                resolve(result)
                MongoDB.disconnect();
            })
        })
    }
}

AssignmentDAO.getAssignments = async function() {
    if(MongoDB.connect()) {
        return Assignment.find({}, {_id: 1, imageUpload: 1, nameAssignment: 1} ,(err, result) => {
            return new Promise((resolve, reject) => {
                resolve(result)
                MongoDB.disconnect();
            })
        })
    }
}

AssignmentDAO.getAssignmentById = async function(idAssigment) {
    if(MongoDB.connect()) {
        return Assignment.findOne({'_id':idAssigment}, (err, result) => {
            return new Promise((resolve, reject) => {
                resolve(result)
                MongoDB.disconnect();
            })
        })
    }
}

module.exports = AssignmentDAO;














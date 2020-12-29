const Assignment = require('../model/AssignmentModel')
const MongoDB = require('../database')
const AssignmentDAO = {}

AssignmentDAO.createNewAssignment = async function(assignmentInfos) {
    if(MongoDB.connect()) {
        return Assignment.insertMany(assignmentInfos, (err, result) => {
            return new Promise((resolve, reject) => {
                resolve(result)
                MongoDB.close();
            })
        })
    }
}

AssignmentDAO.getAssignments = async function() {
    if(MongoDB.connect())
    return Assignment.find({}, (err, result) => {
        return new Promise((resolve, reject) => {
            resolve(result)
            MongoDB.close();
        })
    })
}

AssignmentDAO.getAssignmentById = async function(idAssigment) {
    if(MongoDB.connect()) {
        return Assignment.findOne({'_id':idAssigment}, (err, result) => {
            return new Promise((resolve, reject) => {
                resolve(result)
                MongoDB.close();
            })
        })
    }
}

module.exports = AssignmentDAO;














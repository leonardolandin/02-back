const AssignmentDAO = require('../../dao/AssignmentDAO');
const { response } = require('express');

module.exports = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    let dataAssignment = req.params

    if(dataAssignment && dataAssignment.idAssignment) {
        if(dataAssignment.idAssignment.length) {
            let idAssignment = dataAssignment.idAssignment;

            AssignmentDAO.getAssignmentById(idAssignment).then((responseData) => {
                if(responseData) {
                    res.send(responseData)
                }
            })
        }
    }

}
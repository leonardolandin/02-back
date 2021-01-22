const AssignmentDAO = require('../../dao/AssignmentDAO');

module.exports = (req, res) => {
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
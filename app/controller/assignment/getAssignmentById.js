const AssignmentDAO = require('../../dao/AssignmentDAO');
const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
    let dataAssignment = req.params;
    let token = req.headers.authorization;

    try {
        if(dataAssignment && dataAssignment.idAssignment) {
            if(dataAssignment.idAssignment.length) {
                let idAssignment = dataAssignment.idAssignment;

                let userJWT = jwt.verify(token, process.env.JWT);

                if(userJWT.email !== undefined) {
                    
                }
    
                AssignmentDAO.getAssignmentById(idAssignment).then((responseData) => {
                    if(responseData) {
                        AssignmentDAO.verifyAction();
                        res.send(responseData)
                    }
                })
            }
        }
    } catch(e) {

    }
}
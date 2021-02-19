const AssignmentDAO = require('../../dao/AssignmentDAO');
const UserDAO = require('../../dao/UserDAO');
const Constants = require('../../utils/constants');
const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
    let dataAssignment = req.params;
    let token = req.headers.authorization;

    if (dataAssignment && dataAssignment.idAssignment) {
        if (dataAssignment.idAssignment.length) {
            let idAssignment = dataAssignment.idAssignment;
            let userJWT;

            try {
                userJWT = jwt.verify(token, process.env.JWT);
            } catch (e) {
                userJWT = {};
            }

            try {
                AssignmentDAO.getAssignmentById(idAssignment).then((responseData) => {
                    if (responseData) {
                        if (userJWT.email !== undefined) {
                            UserDAO.getUserByEmail(userJWT.email).then(data => {
                                if (data != null) {
                                    let actionParams = {
                                        user: data._id,
                                        assignment: idAssignment
                                    }

                                    AssignmentDAO.verifyAction(actionParams).then(response => {
                                        if (response) {
                                            let dataAssignment = {
                                                assignment: responseData,
                                                actions: response
                                            }

                                            res.status(Constants.STATUS.OK);
                                            res.send(dataAssignment);
                                        } else {
                                            res.status(Constants.STATUS.OK);
                                            res.send(responseData);
                                        }
                                    })

                                }
                            })
                        } else {
                            res.status(Constants.STATUS.OK);
                            res.send(responseData);
                        }
                    }
                })
            } catch (e) {

            }
        }
    }
}
const AssignmentDAO = require('../../dao/AssignmentDAO');
const UserDAO = require('../../dao/UserDAO');
const jwt = require('jsonwebtoken');
const Constants = require('../../utils/constants');
const AssignmentUtils = require('../../utils/assignment');
const { mongo } = require('mongoose');

module.exports = (req, res) => {
    let token = req.headers.authorization;
    let dataUpload = req.body;

    const validateException = (response, message, status, error) => {
        let objReject = {
            message: message,
            error: error
        }

        response.status(status)
        response.send(objReject)
    }

    const trackValidate = (assignment) => {
        let track = AssignmentUtils.validateAssignment(assignment);

        if(track.message) {
            return validateException(res, track.message, track.status);
        } else {
            return true;
        }
    }

    try {
        let userJWT = jwt.verify(token, process.env.JWT)

        if(userJWT.email !== undefined) {
            UserDAO.getUserByEmail(userJWT.email).then(data => {
                dataUpload.user = data;

                try {
                    if(dataUpload && trackValidate(dataUpload)) {
                        if(dataUpload.user._id) {
                            let enumType = AssignmentUtils.getTypeEnum(dataUpload.typeAssignment);
                            let autorBool = dataUpload.isAutor;
                            let dateNow = new Date();
                            let data2 = new Date(dateNow.valueOf() - dateNow.getTimezoneOffset() * 60000);
                            let dataBase = data2.toISOString().replace(/\.\d{3}Z$/, '');
                
                            let assignmentMongo = {
                                nameAssignment: dataUpload.nameAssignment,
                                descriptionAssignment: dataUpload.descriptionAssignment,
                                typeAssignment: enumType,
                                isAutor: autorBool,
                                imageUpload: dataUpload.imageUpload,
                                created: dataBase,
                                modificated: null,
                                userUploaded: dataUpload.user._id
                            }
                            res.status(403)
                            res.send(assignmentMongo)
        
                            return

                            AssignmentDAO.createNewAssignment(assignmentMongo).then((data) => {
                                let sendObj = {
                                    message: 'Atividade criada com sucesso'
                                }
                                res.status(Constants.STATUS.CREATED);
                                res.send(sendObj);
                            })
                        }
                    }
                } catch(e) {
                    validateException(res, "Ocorreu um erro ao enviar a atividade", Constants.STATUS.FORBIDDEN, e);
                }
            })
        } else {
            validateException(res, "Ocorreu um erro ao enviar a atividade", Constants.STATUS.UNAUTHORIZED, e);
        }

    } catch(e) {
        validateException(res, "Ocorreu um erro ao enviar a atividade", Constants.STATUS.UNAUTHORIZED, e);
    }
}

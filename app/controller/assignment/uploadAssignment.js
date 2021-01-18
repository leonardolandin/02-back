const AssignmentDAO = require('../../dao/AssignmentDAO');
const UserDAO = require('../../dao/UserDAO');
const jwt = require('jsonwebtoken');
const Constants = require('../../utils/constants');
const AssignmentUtils = require('../../utils/assignment');
const http = require('../../config/axios');

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
                            let dateNow = new Date();
                            let data2 = new Date(dateNow.valueOf() - dateNow.getTimezoneOffset() * 60000);
                            let dataBase = data2.toISOString().replace(/\.\d{3}Z$/, '');

                            let imageImgur = {
                                image: AssignmentUtils.replaceBase64(dataUpload.imageUpload.path),
                                name: dataUpload.imageUpload.name,
                                title: dataUpload.nameAssignment,
                                description: dataUpload.descriptionAssignment,
                                type: AssignmentUtils.getMiMeTypeBase64(dataUpload.imageUpload.path)
                            }
        
                            http.post(Constants.IMGUR.UPLOAD_IMAGE, imageImgur, { headers: { 'Authorization': `Client-ID ${process.env.IMGUR_CLIENT}` } }).then(response => {
                                if(response.data.success) {
                                    let imgurResponse = response.data.data;

                                    if(imgurResponse.link && imgurResponse.link.length) {
                                        dataUpload.imageUpload.path = imgurResponse.link;
                                        
                                        let assignmentMongo = {
                                            nameAssignment: dataUpload.nameAssignment,
                                            descriptionAssignment: dataUpload.descriptionAssignment,
                                            typeAssignment: enumType,
                                            isAutor: dataUpload.isAutor,
                                            imageUpload: dataUpload.imageUpload,
                                            created: dataBase,
                                            modificated: null,
                                            userUploaded: dataUpload.user._id,
                                            active: true
                                        }

                                        AssignmentDAO.createNewAssignment(assignmentMongo).then((data) => {
                                            let sendObj = {
                                                message: 'Atividade criada com sucesso'
                                            }
                                            res.status(Constants.STATUS.CREATED);
                                            res.send(sendObj);
                                        }).catch(error => {
                                            validateException(res, "Ocorreu um erro ao enviar a atividade", Constants.STATUS.FORBIDDEN, error);
                                        })
                                    }
                                }
                            }).catch(error => {
                                validateException(res, "Ocorreu um erro ao enviar a atividade", Constants.STATUS.FORBIDDEN, error.data.data.error);
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

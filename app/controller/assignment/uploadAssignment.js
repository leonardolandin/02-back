const AssignmentDAO = require('../../dao/AssignmentDAO');
const UserDAO = require('../../dao/UserDAO');

module.exports = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    let dataUpload = req.body;

    const validateException = (response, message) => {
        let objReject = {
            messageError: message
        }

        response.status(403)
        response.send(objReject)
    }

    const validateAssignment = (dataAssignment) => {     
        if(dataAssignment.nameAssignment && dataAssignment.nameAssignment.length > 128) {
            return validateException(res, "A nome da atividade não pode ultrapassar 128 caracteres")
        }
        if(dataAssignment.descriptionAssignment && dataAssignment.descriptionAssignment.length > 252) {
            return validateException(res, "A descrição da atividade não pode ultrapassar 252 caracteres")
        }
        if(dataAssignment.typeAssignment && parseInt(dataAssignment.typeAssignment) === 0) {
            return validateException(res, "É necessário escolher uma escolaridade")
        }
        if(dataAssignment.imageUpload && dataAssignment.imageUpload.stringBase64 && !dataAssignment.imageUpload.stringBase64.length) {
            return validateException(res, "Nenhuma imagem foi selecionada")
        }
        if(dataAssignment.imageUpload && dataAssignment.imageUpload.name && !dataAssignment.imageUpload.name.length) {
            return validateException(res, "A imagem selecionada não possui nome")
        }

        return true
    }

    const getTypeEnum = (type) => {
        if(parseFloat(type) == 1) {
            return 'INFANT'
        }
        if(parseFloat(type) == 2) {
            return 'FUNDAMENTAL'
        }
        if(parseFloat(type) == 3) {
            return 'MEDIUM'
        }
        if(parseFloat(type) == 4) {
            return 'UPPER'
        }   
    }

    const isBoolean = (string) => {
        if(string === 'true') {
            return true
        }
        if(string === 'false') {
            return false
        }
    }

    if(dataUpload && validateAssignment(dataUpload)) {
        if(dataUpload.user.id && dataUpload.user.id.length) {

            UserDAO.getUserById(dataUpload.user.id).then((data) => {
                if(data && dataUpload.user.email === data.email) {
                    let enumType = getTypeEnum(dataUpload.typeAssignment);
                    let autorBool = isBoolean(dataUpload.isAutor);
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
                        userUploaded: dataUpload.user.id
                    }

                    AssignmentDAO.createNewAssignment(assignmentMongo).then((data) => {
                        let sendObj = {
                            msg: 'Atividade criada com sucesso'
                        }
                        res.status(201)
                        res.send(sendObj)
                    })
                }
            })
        }
    }
}

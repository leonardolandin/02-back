const AssignmentDAO = require('../../dao/AssignmentDAO');
const Assignment = require('../../model/AssignmentModel');

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
            validateException(res, "A nome da atividade não pode ultrapassar 128 caracteres")
        }
        if(dataAssignment.descriptionAssignment && dataAssignment.descriptionAssignment.length > 252) {
            validateException(res, "A descrição da atividade não pode ultrapassar 252 caracteres")
        }
        if(dataAssignment.typeAssignment && parseInt(dataAssignment.typeAssignment) === 0) {
            validateException(res, "É necessário escolher uma escolaridade")
        }
        if(dataAssignment.imageUpload && dataAssignment.imageUpload.stringBase64 && !dataAssignment.imageUpload.stringBase64.length) {
            validateException(res, "Nenhuma imagem foi selecionada")
        }
        if(dataAssignment.imageUpload && dataAssignment.imageUpload.name && !dataAssignment.imageUpload.name.length) {
            validateException(res, "A imagem selecionada não possui nome")
        }
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
        console.log('entrou')
        if(dataUpload.user.id && dataUpload.user.id.length) {
            console.log('entrou 2')
            let enumType = getTypeEnum(dataUpload.typeAssignment)
            let autorBool = isBoolean(dataUpload.isAutor)

            let assignmentMongo = {
                nameAssignment: dataUpload.name,
                descriptionAssignment: dataUpload.descriptionAssignment,
                typeAssignment: enumType,
                isAutor: autorBool
            }

            res.send('viva')
        }
    }
}

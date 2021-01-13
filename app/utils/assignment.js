let assignmentUtils = {
    getTypeEnum: (type) => {
        switch (parseInt(type)) {
            case 1:
                return 'INFANT'
            case 2:
                return 'FUNDAMENTAL'
            case 3:
                return 'MEDIUM'
            case 4:
                return 'UPPER'
        }
    },
    validateAssignment: (dataAssignment) => {
        if(dataAssignment.nameAssignment && dataAssignment.nameAssignment.length > 128) {
            return {
                message: 'O nome da atividade não pode ultrapassar 128 caracteres',
                status: Constants.STATUS.FORBIDDEN
            }
        }
        if(dataAssignment.descriptionAssignment && dataAssignment.descriptionAssignment.length > 252) {
            return {
                message: 'A descrição da atividade não pode ultrapassar 252 caracteres',
                status: Constants.STATUS.FORBIDDEN
            }
        }
        if(dataAssignment.typeAssignment && parseInt(dataAssignment.typeAssignment) === 0) {
            return {
                message: 'É necessário escolher uma escolaridade',
                status: Constants.STATUS.FORBIDDEN
            }
        }
        if(dataAssignment.imageUpload && dataAssignment.imageUpload.stringBase64 && !dataAssignment.imageUpload.stringBase64.length) {
            return {
                message: 'Nenhuma imagem foi selecionada',
                status: Constants.STATUS.FORBIDDEN
            }
        }
        if(dataAssignment.imageUpload && dataAssignment.imageUpload.name && !dataAssignment.imageUpload.name.length) {
            return {
                message: 'A imagem selecionada não possui nome',
                status: Constants.STATUS.FORBIDDEN
            }
        }

        return true
    },
    replaceBase64: function(stringBase64) {
        return stringBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    },
    getMiMeTypeBase64: function(base64) {
        return base64.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
    }
}

module.exports = assignmentUtils;
const Constants = require('../../utils/constants');
const AssignmentDAO = require('../../dao/AssignmentDAO');

module.exports = (req, res) => {
    const validateException = (response, message, status, error) => {
        let objReject = {
            message: message,
            error: error
        }

        response.status(status)
        response.send(objReject)
    }

    let likeAction = req.body;
    
    if(likeAction) {
        try {
            AssignmentDAO.verifyAction(likeAction).then(response => {
                if(response == null) {
                    likeAction.favorite = false;
                    AssignmentDAO.createAction(likeAction).then(data => {
                        res.status(Constants.STATUS.OK)
                        res.send(likeAction)
                    })
                } else {
                    let likeCreated = {
                        like: likeAction.like
                    }
                    AssignmentDAO.updateAction(likeAction, likeCreated).then(data => {
                        console.log(data)
                    })
                }
            })
        } catch(e) {
            validateException(res, 'Ocorreu um erro ao gostar da atividade', Constants.STATUS.BAD_REQUEST);
        }
    } else {
        validateException(res, 'Ocorreu um erro ao gostar da atividade', Constants.STATUS.BAD_REQUEST);
    }
}
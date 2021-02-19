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

    let favoriteAction = req.body;
    
    if(favoriteAction) {
        try {
            AssignmentDAO.verifyAction(favoriteAction).then(response => {
                if(response == null) {
                    favoriteAction.like = false;
                    AssignmentDAO.createAction(favoriteAction).then(data => {
                        res.status(Constants.STATUS.CREATED)
                        res.send(favoriteAction)
                    })
                } else {
                    let favoriteCreated = {
                        favorite: favoriteAction.favorite
                    }
                    AssignmentDAO.updateAction(favoriteAction, favoriteCreated).then(data => {
                        res.status(Constants.STATUS.OK);
                        res.send(favoriteCreated);
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
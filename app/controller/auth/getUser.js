const jwt = require('jsonwebtoken');
const UserAPI = require('../../dao/UserDAO');
const Constants = require('../../utils/constants');

module.exports = (req, res) => {
    let userToken = req.body.token;

    if(userToken !== null) {
        try {
            let validationToken = jwt.verify(userToken, process.env.JWT);   
            if(validationToken.email !== undefined) {
                UserAPI.getUserByEmail(validationToken.email).then((data) => {
                    res.status(Constants.STATUS.OK)
                    res.send(data)
                })
            }
        } catch(error) {
            res.status(Constants.STATUS.UNAUTHORIZED)
            res.send(error)
        }
    } else {
        res.status(Constants.STATUS.UNAUTHORIZED)
        res.send()
    }
}
const jwt = require('jsonwebtoken');
const UserAPI = require('../../dao/UserDAO');

module.exports = (req, res) => {
    let userToken = req.body.token;

    if(userToken !== null) {
        try {
            let validationToken = jwt.verify(userToken, process.env.JWT);   
            if(validationToken.email !== undefined) {
                UserAPI.getUserByEmail(validationToken.email).then((data) => {
                    res.status(200)
                    res.send(data)
                })
            }
        } catch(error) {
            res.status(401)
            res.send(error)
        }
    } else {
        res.status(401)
        res.send()
    }
}
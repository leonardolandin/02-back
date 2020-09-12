const jwt = require('jsonwebtoken');
const UserAPI = require('../../dao/UserDAO');

module.exports = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    let userToken = req.params.userToken;

    if(userToken === "null") {
        userToken = null
    }

    if(userToken !== null) {
        try {
            let validationToken = jwt.verify(userToken, process.env.JWT);     
            if(validationToken.user !== undefined) {
                UserAPI.getUserByEmail(validationToken.user).then((data) => {
                    res.status(200)
                    res.send(data)
                })
            }
        } catch(error) {
            console.log(error)
            res.status(401)
            res.send()
        }
    } else {
        res.status(401)
        res.send()
    }
}
const AssignmentDAO = require('../../dao/AssignmentDAO');


module.exports = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    AssignmentDAO.getAssignments().then((list) => {
        res.status(200);
        res.send(list);
    })
}

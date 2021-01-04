const AssignmentDAO = require('../../dao/AssignmentDAO');
const Constants = require('../../utils/constants');

module.exports = (req, res) => {
    AssignmentDAO.getAssignments().then((list) => {
        res.status(Constants.STATUS.OK);
        res.send(list);
    })
}

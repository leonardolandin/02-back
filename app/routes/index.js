const routes = require('express').Router();
const home = require('../controller/assignment/getAssignment');
const uploadAssignments = require('../controller/assignment/uploadAssignment'); 

routes.get('/', home); 
routes.post('/uploadAssignments', uploadAssignments)


module.exports = routes;

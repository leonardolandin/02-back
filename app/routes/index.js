const routes = require('express').Router();
const home = require('../controller/assignment/getAssignments');
const uploadAssignments = require('../controller/assignment/uploadAssignment'); 
const getAssignment = require('../controller/assignment/getAssignmentById');

routes.get('/', home); 
routes.get('/getAssignment/:idAssignment', getAssignment);
routes.post('/uploadAssignments', uploadAssignments);


module.exports = routes;

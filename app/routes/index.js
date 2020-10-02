const routes = require('express').Router();
const home = require('../controller/assignment/getAssignments');
const uploadAssignments = require('../controller/assignment/uploadAssignment'); 
const getAssignment = require('../controller/assignment/getAssignmentById');
const getUser = require('../controller/auth/getUser');
const login = require('../controller/auth/login');


//Assignment's
routes.get('/', home); 
routes.get('/getAssignment/:idAssignment', getAssignment);
routes.post('/uploadAssignments', uploadAssignments);


//Auth
routes.post('/userLogged', getUser);
routes.post('/login', login);

module.exports = routes;

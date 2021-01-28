const routes = require('express').Router();
const home = require('../controller/assignment/getAssignments');
const uploadAssignments = require('../controller/assignment/uploadAssignment'); 
const getAssignment = require('../controller/assignment/getAssignmentById');
const getUser = require('../controller/auth/getUser');
const login = require('../controller/auth/login');
const register = require('../controller/auth/sign');
const likeAssignment = require('../controller/assignment/likeAssignment');
const favoriteAssignment = require('../controller/assignment/favoriteAssignment');


//Assignment's
routes.get('/', home); 
routes.get('/getAssignment/:idAssignment', getAssignment);
routes.post('/uploadAssignments', uploadAssignments);
routes.post('/likeAssignment', likeAssignment);
routes.post('/favoriteAssignment', favoriteAssignment);


//Auth
routes.post('/userLogged', getUser);
routes.post('/login', login);
routes.post('/register', register);

module.exports = routes;

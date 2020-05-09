const routes = require('express').Router();
const home = require('../controller/assignment/getAssignment');

routes.get('/', home); 

module.exports = routes;

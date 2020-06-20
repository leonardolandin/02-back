const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('../routes');

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
}));

app.use(bodyParser.json({
    limit: '50mb', 
    extended: true
}));


app.use(express.json());
app.use('/', routes);
app.use('/uploadAssignments/', routes);
app.use('/getAssignment/:idAssignment', routes);

module.exports = app;
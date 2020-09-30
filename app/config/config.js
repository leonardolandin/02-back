const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('../routes');
const cors = require('cors');

app.use(bodyParser.json({
    limit: '50mb', 
    extended: true
}));

app.use(cors({
    origin: 'http://localhost:8080'
}));


app.use(express.json());

//Assignment's

app.use('/', routes);
app.use('/uploadAssignments/', routes);
app.use('/getAssignment/:idAssignment', routes);

//Auth
app.use('/userLogged/:userToken', routes);
app.use('/login', routes);

module.exports = app;
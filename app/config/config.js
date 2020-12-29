const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('../routes');
const cors = require('cors');

app.use(bodyParser.json({
    limit: '50mb', 
    extended: true
}));

let whiteList = JSON.parse(process.env.CORS_ORIGINS);

let corsOptions = {
    origin: function(origin, callback) {
        if(whiteList.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            return callback(null, false);
        }
    },
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
}

app.use(cors(corsOptions));
app.use(express.json());

//Assignment's

app.use('/', routes);
app.use('/uploadAssignments/', routes);
app.use('/getAssignment/:idAssignment', routes);

//Auth
app.use('/userLogged', routes);
app.use('/login', routes);
app.use('/register', routes);

module.exports = app;
const app = require('./app/config/config');
const MongoDB = require('./app/database');
require('dotenv/config');
const port = process.env.PORT;

app.listen(port, function() {
    MongoDB.connect().then(db => {
        if(db) {
            process.on('SIGINT', function() {
                MongoDB.disconnect();
                process.exit(0);
            });
        }
    })
})
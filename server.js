const app = require('./app/config/config');
const MongoDB = require('./app/database');
require('dotenv/config');
const port = process.env.PORT;

MongoDB.connect().then(db => {
    if(db) {
        app.listen(port, function() {
            process.on('SIGINT', function() {
                MongoDB.disconnect();
                process.exit(0);
            });
        })
    }
})


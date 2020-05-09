const app = require('./app/config/config');
require('dotenv/config');
const port = process.env.PORT;

app.listen(port, function() { 
})
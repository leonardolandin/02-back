const MongoDB = require("mongoose");
require('dotenv/config');

const uri = process.env.MONGO_DB;
MongoDB.connect(uri, {
    useNewUrlParser: true,
});
const database = MongoDB.connection;
database.on("error", () => {
    console.log("> Erro ao conectar no MongoDB");
});
database.once("open", () => {
    console.log("> Conexão com MongoDB realizada");
});
module.exports = MongoDB;
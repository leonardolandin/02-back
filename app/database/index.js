const MongoDB = require("mongoose");
require('dotenv/config');

const mongoDB = {
    connect: async function() {
        MongoDB.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferMaxEntries: 0
        });

        const database = MongoDB.connection;
        database.on("error", () => {
            console.log("> Erro ao conectar no MongoDB");
            return new Promise((resolve, reject) => {
                resolve(false)
            })
        });

        database.once("open", () => {
            console.log("> Conexão com MongoDB realizada");
            return new Promise((resolve, reject) => {
                resolve(true)
            })
        });
    },
    close: function() {
        MongoDB.connection.close();
        console.log("> Conexão com MongDB Fechada");
    },
    MongoDB: MongoDB
}

module.exports = mongoDB;
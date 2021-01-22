const MongoDB = require("mongoose");
require('dotenv/config');

const mongoDB = {
    connect: async function() {
        return MongoDB.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferMaxEntries: 0
        } , (err, db) => {
            if (err) {
              console.log(`> Erro ao conectar no MongoDB`);
            } else {
                console.log(`> Conexão com MongoDB realizada`);
            }

            return new Promise((resolve, reject) => {
                resolve(db)
            })
        });
    },
    disconnect: function() {
        if(MongoDB.connection.readyState == 1) {
            MongoDB.disconnect().then((r, error) => {
                console.log("> Conexão com MongDB Fechada");
            })
        }
    },
    MongoDB: MongoDB
}

module.exports = mongoDB;
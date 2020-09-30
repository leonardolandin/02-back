const crypto = require('crypto');
require('dotenv/config');

let crypt = {
    decryptPassword: (password) => {
        const decipher = crypto.createDecipher(process.env.ENCRYPT_ALGORITHM, process.env.ENCRYPT_KEY);
        decipher.update(password, process.env.ENCRYPT_TYPE);
        return decipher.final();
    }
}

module.exports = crypt;
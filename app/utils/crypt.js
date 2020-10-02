const crypto = require('crypto');
require('dotenv/config');

let crypt = {
    decryptPassword: (password) => {
        const decipher = crypto.createDecipher(process.env.ENCRYPT_ALGORITHM, process.env.ENCRYPT_KEY);
        decipher.update(password, process.env.ENCRYPT_TYPE);
        return decipher.final();
    },
    encryptPassword: (password) => {
        const cipher = crypto.createCipher(process.env.ENCRYPT_ALGORITHM, process.env.ENCRYPT_KEY);
        cipher.update(password);
        return cipher.final(process.env.ENCRYPT_TYPE);
    }
}

module.exports = crypt;
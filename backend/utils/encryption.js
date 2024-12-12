const CryptoJS = require('crypto-js');

const SECRET_KEY = 'AESEncryptionKey@2024!SecurePassword';

const encryptData = (data) => {
    try {
        const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(data),
            SECRET_KEY
        ).toString();
        return encryptedData;
    } catch (error) {
        console.error('Encryption error:', error);
        throw error;
    }
};

module.exports = { encryptData, SECRET_KEY };


/**
 * @summary This module exports a function for encrypting data using AES-256.
 * The encryption key is a secret key which is used to encrypt the data.
 * The function takes the data as a parameter and returns the encrypted string.
 * The encryption is done using the crypto-js library.
 * @workflow
 * 1. The encryptData function takes the data as a parameter.
 * 2. The data is converted to a JSON string.
 * 3. The JSON string is encrypted using AES-256.
 * 4. The encrypted string is returned.
 * @returns {string} - The encrypted string.
 * @throws {Error} - Throws an error if encryption fails.
 */

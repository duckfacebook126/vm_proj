const CryptoJS = require('crypto-js');

const SECRET_KEY = 'AESEncryptionKey@2024!SecurePassword';

const decryptData = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Decryption error:', error);
        throw error;
    }
};

module.exports = { decryptData, SECRET_KEY };

/**
 * @file decryption.js
 * @summary This file contains the decryption functions using AES to decrypt the data.
 * @workflow
 * 1. The decryption function takes the encrypted data as an argument.
 * 2. The function uses the Crypto JS library to create a AES decryptor with the secret key.
 * 3. The function decrypts the data using the AES decryptor.
 * 4. The function returns the decrypted data as a JSON object.
 * 5. The function throws an error if decryption fails.
 * @function decryptData
 * @param {string} encryptedData - The encrypted data to be decrypted.
 * @returns {object} - The decrypted data as a JSON object.
 * @throws {Error} - Throws an error if decryption fails.
 */

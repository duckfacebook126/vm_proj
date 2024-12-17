const CryptoJS = require('crypto-js');

const SECRET_KEY = 'AESEncryptionKey@2024!SecurePass'; 
const FIXED_IV = 'FixedIVKey123456';

const decryptData = (encryptedData) => {
  try {
    const iv = CryptoJS.enc.Utf8.parse(FIXED_IV);
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(SECRET_KEY), { iv: iv });
    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8); 

    // Parse the decrypted string as JSON
    try {
      return JSON.parse(decryptedString); 
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error('Invalid JSON data'); 
    }

  } catch (error) {
    console.error('Decryption error:', error);
    throw error; 
  }
};

module.exports = { decryptData, SECRET_KEY };

















// const CryptoJS = require('crypto-js');

// const SECRET_KEY = 'AESEncryptionKey@2024!SecurePass';
// const FIXED_IV = 'FixedIVKey123456'
// const decryptData = (encryptedData) => { try { // Convert fixed IV to a WordArray
//      const iv = CryptoJS.enc.Utf8.parse(FIXED_IV); // Decrypt the data with the fixed IV
//       const decryptedData = CryptoJS.AES.decrypt( encryptedData, CryptoJS.enc.Utf8.parse(SECRET_KEY), { iv: iv } );
//        return JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8)); }
//         catch (error) { console.error('Decryption error:', error); throw error; } };

// module.exports = { decryptData, SECRET_KEY };

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

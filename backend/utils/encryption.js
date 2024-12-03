
const CryptoJS = require('crypto-js');
const SECRET_KEY ='AESEncryptionKey@2024!SecurePassword'
const decryptData = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Decryption error:', error);
        throw error;
    }
};

module.exports = { decryptData };
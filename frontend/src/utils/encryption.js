import CryptoJS from 'crypto-js';

const SECRET_KEY ='AESEncryptionKey@2024!SecurePassword'

export const  encryptData = (data) => {
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

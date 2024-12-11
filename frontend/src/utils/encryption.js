// Import the CryptoJS library for encryption
import CryptoJS from 'crypto-js';

// Define a secret key for AES encryption
const SECRET_KEY = 'AESEncryptionKey@2024!SecurePassword';

/**
 * Encrypts the given data using AES encryption.
 *
 * @param {any} data - The data to be encrypted.
 * @returns {string} - The encrypted data as a string.
 * @throws {Error} - Throws an error if encryption fails.
 */
export const encryptData = (data) => {
    try {
        // Convert the data to a JSON string
        const dataString = JSON.stringify(data);

        // Encrypt the data string using AES encryption with the secret key
        const encryptedData = CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();

        // Return the encrypted data as a string
        return encryptedData;
    } catch (error) {
        // Log the encryption error to the console
        console.error('Encryption error:', error);

        // Re-throw the error to be handled by the caller
        throw error;
    }
};

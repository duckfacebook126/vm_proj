// Import the CryptoJS library for decryption
import CryptoJS from 'crypto-js';

// Define a secret key for AES decryption
const SECRET_KEY = 'AESEncryptionKey@2024!SecurePassword';

/**
 * Decrypts the given encrypted data using AES decryption.
 *
 * @param {string} encryptedData - The encrypted data to be decrypted.
 * @returns {any} - The decrypted data.
 * @throws {Error} - Throws an error if decryption fails.
 */
export const decryptData = (encryptedData) => {
    try {
        // Decrypt the encrypted data using AES decryption with the secret key
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);

        // Convert the decrypted bytes to a UTF-8 string
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

        // Parse the JSON string to get the original data
        return JSON.parse(decryptedString);
    } catch (error) {
        // Log the decryption error to the console
        console.error('Decryption error:', error);

        // Re-throw the error to be handled by the caller
        throw error;
    }
};


/**
 * @file decryption.js
 * @summary This module provides a function to decrypt encrypted data using AES.
 * @description
 * This module provides a function to decrypt encrypted data using AES. The
 * function takes an encrypted string as input and decrypts it using a secret
 * key. The decrypted data is then parsed as JSON and returned. If the
 * decryption fails, an error is thrown.
 *
 * @workflow
 * 1. The function takes an encrypted string as input.
 * 2. The string is decrypted using AES decryption with the secret key.
 * 3. The decrypted bytes are converted to a UTF-8 string.
 * 4. The string is then parsed as JSON and returned.
 * 5. If an error occurs during decryption, an error is thrown.
 *
 * @function decryptData
 * @param {string} encryptedData - The encrypted data to be decrypted.
 * @returns {any} - The decrypted data.
 * @throws {Error} - Throws an error if decryption fails.
 */

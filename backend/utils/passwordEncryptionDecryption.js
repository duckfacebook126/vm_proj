//kinitaized keys

const crypto=require('crypto');
const secretKey = 'aelwfhlaef';
const secretIV = 'aifjaoeifjo';
const encMethod = 'aes-256-cbc';

///,computed keys

const key = crypto.createHash('sha512').update(secretKey).digest('hex').substring(0,32)
const encIv = crypto.createHash('sha512').update(secretIV).digest('hex').substring(0,16)


///


//encryption funtion that will encrypt password

function encryptPassword (data) {
    const cipher = crypto.createCipheriv(encMethod, key, encIv)
    const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    return Buffer.from(encrypted).toString('base64')
}

function decryptPassword(encryptedData) {
    const buff = Buffer.from(encryptedData, 'base64')
    encryptedData = buff.toString('utf-8')
    const decipher = crypto.createDecipheriv(encMethod, key, encIv)
    return decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8')
}



module.exports = { encryptPassword, decryptPassword };


//decryption for password



/**
 * @summary
 * This file contains functions for encrypting and decrypting passwords.
 * 
 * @description
 * The functions in this file are used to encrypt and decrypt passwords.
 * The encryption and decryption is done using the AES-256-CBC algorithm.
 * 
 * @function encryptPassword
 * This function takes a password as a string and encrypts it using the AES-256-CBC algorithm.
 * The encrypted password is then returned as a string.
 * 
 * @function decryptPassword
 * This function takes an encrypted password as a string and decrypts it using the AES-256-CBC algorithm.
 * The decrypted password is then returned as a string.
 * 
 * @workflow
 * 1. The password is converted to a buffer.
 * 2. The buffer is encrypted using the AES-256-CBC algorithm.
 * 3. The encrypted buffer is converted to a string.
 * 4. The string is returned as the encrypted password.
 * 
 * @workflow
 * 1. The encrypted password is converted to a buffer.
 * 2. The buffer is decrypted using the AES-256-CBC algorithm.
 * 3. The decrypted buffer is converted to a string.
 * 4. The string is returned as the decrypted password.
 */

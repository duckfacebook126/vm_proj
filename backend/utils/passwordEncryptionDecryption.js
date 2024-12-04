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
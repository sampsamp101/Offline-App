
const crypto = require("crypto");

function sign(email, code, exp) {
    const secret = process.env.CODE_SECRET;
    if (!secret) {
        throw new Error("CODE_SECRET is not configured");
    }
    return crypto
    //Hmac class is a utility for creating cryptographic HMAC digests
        .createHmac("sha256", secret)
     //reupdate exports.sign
        .update(`${email}:${code}:${exp}`)
        .digest("hex");
}

module.exports = { sign };

// The node:crypto module provides cryptographic functionality that includes a set of wrappers for OpenSSL's hash, message authentication code (MAC), cipher, decipher, sign, verify, and key encapsulation mechanism (KEM) functions.

// const { createHmac } = require('node:crypto');

// const secret = 'abcdefg';
// const hash = createHmac('sha256', secret)
//                .update('I love cupcakes')
//                .digest('hex');
// console.log(hash);

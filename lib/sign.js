
const crypto = require("crypto");

function sign(email, code, exp) {
    const secret = process.env.CODE_SECRET;
    if (!secret) {
        throw new Error("CODE_SECRET is not configured");
    }
    return crypto
        .createHmac("sha256", secret)
        .update(`${email}:${code}:${exp}`)
        .digest("hex");
}

module.exports = { sign };


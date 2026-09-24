const crypto = require("crypto");
const { sign } = require("../lib/sign");

module.exports = function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, code, token } = req.body || {};
    if ([email, code, token].some((v) => typeof v !== "string")) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const [exp, sig] = token.split(".");
    if (!exp || !sig || Date.now() > Number(exp)) {
        return res.status(400).json({ error: "Code expired. Request a new one." });
    }

    const expected = Buffer.from(sign(email, code, exp));
    const given = Buffer.from(sig);
    const ok = expected.length === given.length && crypto.timingSafeEqual(expected, given);

    if (!ok) return res.status(400).json({ error: "Incorrect code" });
    return res.status(200).json({ verified: true });
};
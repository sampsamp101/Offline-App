import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = "221366141263-bss7som7liqfcgksfe3fq1grl6v1rufn.apps.googleusercontent.com";
const client = new OAuth2Client();

export default async function handler(req, res){
    if (req.method !== "POST"){
        return res.status(405).json({error: "Method not allowed"});
    }
    const {credentials} = req.body || {};
    if (!credentials){
        return res.status(400).json({error: "Missing credentials!"});
    }
    try{
        const ticket = await client.verifyIdToken({
            idToken: credentials,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const{sub: googleId, email, name, email_verified} = payload;
        if (!email_verified){
            return res.status(400).json({error: "email is not verified!"});
        }
        const username = name || email.split("@")[0];

        return res.status(200).json({username, email});
    }
    catch(error){
        console.error("Google token authentication failed!");
        return res.status(401).json({error: "Invalid Google Token!"});
    }
}


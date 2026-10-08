import { Resend } from "resend";
import crypto from "crypto";
import {sign} from "../lib/sign.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

export default async function handler(req, res){

    if (req.method !== "POST"){
        return res.status(405).json({error: "Method not allowed"});
    }
    const { email } = req.body || {};
    if (typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email)) {
        return res.status(400).json({ error: "A valid email is required" });
    }
    const code = String(crypto.randomInt(100000, 1000000)); 
    const exp = Date.now() + (60 * 10 * 1000); 
    try{
        const resend = new Resend(process.env.RESEND_API_KEY);
        const {error} = await resend.emails.send({
            from: "Offline App <onboarding@resend.dev>",
            to: [email],
            subject: "Your Offline App verification code",
            html: `<p>Your verification code is:</p><h1>${code}</h1><p>It expires in 10 minutes.</p>`,
        });
        if (error){
            return res.status(500).json({error: "something went wrong"});
        }
        return res.status(200).json({token: `${exp}.${sign(email,code,exp)}`});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error: "something went wrong"});
    }
};

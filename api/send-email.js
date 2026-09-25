const {Resend} = require("resend");


module.exports = async function handler(req, res){
    if (req.method !== "POST"){
        return res.status(405).json({
            error: "Method not allowed"
        });
    }
    try {
        const {email} = req.body || {};
        if (!email || typeof email !== "string"){
            return res.status(400).json({
                error: "Email is requried"
            });
        }
        const resend = new Resend(
           process.env.RESEND_API_KEY
        );
        const {data, error} = await resend.emails.send({
            from: "Offline App <onboarding@resend.dev>",
            to: [email],

            subject: "Welcome to Offline App!",

            html: `<h1>Wlecome to Offline App!<h1/>
            <p>Thank you for creating an account</p>
            <p> We are exited to have you here! </p>`,
        });
        if (error){
            console.error("Resend error", error);

            return res.status(502).json({
                message: "Unable to send email"
            });
        }
        return res.status(200).json({
            message: "Email sent succesfuly!",
            id: data.id
        });
    } catch (error){
        console.error("Email function error:", error);
        return res.status (500).json({
            error: "Something went wrong"
        })
    }
    
};



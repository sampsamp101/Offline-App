const {Resend} = require("resend");


module.exports = async function handler(req, res){

     
    // ONLY FOR POST REQUESTS
    if (req.method !== "POST"){
        return res.status(405).json({
            error: "Method not allowed"
        });
    }
    try {
        // Try to get email from the frontend
        const {email} = req.body || {};
        // Check that an email was provided
        if (!email || typeof email !== "string"){
            return res.status(400).json({
                error: "Email is requried"
            });
        }
        // Get the API key from Vercel
        const resend = new Resend(
           process.env.RESEND_API_KEY
        );
        // Send the email
        const {data, error} = await resend.emails.send({
            from: "Offline App <onboarding@resend.dev>",
            to: [email],

            subject: "Welcome to Offline App!",

            html: `
            
            <h1>Wlecome to Oflline App!<h1/>
            <p>Thank you for creating an account</p>
            <p> We are exited to have you here! </p>
            `
        });

        // Handle Resend errors
        
        if (error){
            console.error("Resend error", error);

            return res.status(502).json({
                message: "Unable to send email"
            });
        }

        //Successful response
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


// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   try { // Added try...catch for better error handling
//     const { data, error } = await resend.emails.send({
//       from: 'Your Name <you@yourverifieddomain.com>',
//       to: ['delivered@resend.dev'],
//       subject: 'Hello world',
//       react: EmailTemplate({ firstName: 'John' }),
//     });
//
//     if (error) {
//       return res.status(400).json(error);
//     }
//
//     res.status(200).json(data);
//   } catch (e) {
//      res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

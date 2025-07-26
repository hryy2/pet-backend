const nodemailer = require("nodemailer")
const asyncHandler=require("express-async-handler")

const sendEmail =asyncHandler(async(data,req,res)=>{

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD
  },
});
   
async function main() {
  const info = await transporter.sendMail({
    from: '"Lovepet" <abc@gmail.com>', 
    to: data.to, // list of receivers
    subject: data.subject, 
    text: data.text, 
    html:  data.htm, 
  });

  console.log("Message sent: %s", info.messageId);
  
}

main().catch(console.error);

})

module.exports=sendEmail;
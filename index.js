import { json, request, response } from "express"
import express from 'express'
const app = express()
import cors from 'cors'
import fetch  from "node-fetch"


// Setting up email stuff
import nodemailer from "nodemailer"
const transportar = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user:"a.m2001nov@gmail.com",
        pass:"gamgzrftbkzvrdry"
    }
});


const sendMail =  (req,res) => {
    const {email,subject,body,filename} = req.body
   
    const mailOptions = {
        from:"a.m2001nov@gmail.com",
        to:email,
        subject: subject,
        text: `
        Greeting from CodeBuddy, 
        Please find attachment to access the code that has been shared with you.

        Regards,
        CodeBuddy
        Writing happiness using Keyboard
        `,
        attachments: [  {   // utf-8 string as an attachment
            filename: filename==="script.js" ? "script.txt": filename,
            content: body
        },]
    }
    transportar.sendMail(mailOptions, (err,info) => {
        
        if(err)
        {

          return res.json({success: false,message:"Error occured, Please try again."})
        }
        else {
        
            return   res.json({success:true,message: "Email sent successfully"})
            
        }
    })
}

const port =9000
app.use(json())
app.use(cors())

app.post("/mail",sendMail)




app.post("/api/compile-code", (req,res) => {

    const {code,language,filename} = req.body

    const data = JSON.stringify({
        "files": [{"name":filename,"content":code}]
    })


    fetch(`https://glot.io/api/run/${language}/latest`,{
        method: "POST",
        headers: {
            'Authorization': 'Token cb144e03-a2cd-4672-86bf-e8296393109c',
            'Content-Type': 'application/json'
        },
        body: data
    })
    .then(  response =>  
        response.json()
        .then( data => res.json(data))
        .catch(err => res.json({success: false, message: "Please Try Again !"}) ))
    .catch(err => res.json({success: false, message: "Please Try Again !"}))
})

app.get("/",(req,res) => res.send("i"))

app.listen(port,() => {
    console.log("Hello")
})
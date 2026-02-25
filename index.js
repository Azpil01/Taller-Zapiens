import express from "express";
import ms from "ms";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import  'dotenv/config';



const userGmail= process.env.userGmail;
const appPasword = process.env.appPasword;



const port = 3000;
const app = new express();

const version = Date.now();

app.locals.version = version;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static("public", {
    maxAge: ms("1d"),
    etag: true
}));







app.get("/", (req, res) => {
    res.render("index.ejs");
    
})

app.post("/sendMessage", (req, res) => {
    
    const nombre = req.body.nombre;
    const subject = req.body.mensaje;
    const correo = req.body.correo;

    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: userGmail,
        pass: appPasword,
    } 
});

const mailOptions = {
    from: correo,
    to: userGmail,
    subject: `Mail from ${nombre}`,
    text: subject
}

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    })

    res.redirect("/");
})





app.listen(port, () => {
    console.log(`All good from port ${port}, Azpil ` );
}) 
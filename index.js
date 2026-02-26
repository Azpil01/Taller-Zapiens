import express from "express";
import ms from "ms";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import  'dotenv/config';



const userGmail = process.env.USER_GMAIL;
const appPassword = process.env.APP_PASSWORD;





const port = 3000;
const app = express();

const version = Date.now();

app.locals.version = version;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");



// app.use(express.static("public", {
//     maxAge: ms("1d"),
//     etag: true
// }));


const path = require("path");

app.use(express.static(path.join(__dirname, "public"), {
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
        pass: appPassword,
    } 
});

const mailOptions = {
    from: correo,
    to: userGmail,
    subject: `Mail from ${nombre}. ${correo}`,
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
    console.log(mailOptions);
})





app.listen(port, () => {
    console.log(`All good from port ${port}, Azpil ` );
}) 
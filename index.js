import express from "express";
import ms from "ms";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();


const userGmail = process.env.USER_GMAIL || "VARIABLE_NO_CONFIGURADA";
const appPasword = process.env.APP_PASWORD || "SIN_CONTRASEÑA";

if (!userGmail || !appPasword) {
    throw new Error("CRÍTICO: Las variables de entorno no están llegando al código. Revisa el hPanel.");
}

const port = 3000;
const app = new express();

const version = Date.now();

app.locals.version = version;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");



app.use(express.static("public", {
    maxAge: ms("1d"),
    etag: true
}));







app.get("/", (req, res) => {
    res.render("index.ejs");
    
})

app.post("/sendMessage", (req, res) => {
    
    console.log("He recibido una petición POST");

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
    subject: `Mail from ${nombre}. ${correo}`,
    text: subject
}

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
           return res.status(500).send("Error de Nodemailer: " + error.message);
        } else {
            console.log("Email sent: " + info.response);
            res.redirect("/");
        }
    })
})





app.listen(port, () => {
    console.log(`All good from port ${port}, Azpil ` );
}) 
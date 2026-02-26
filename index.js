import express from "express";
import ms from "ms";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import "dotenv/config";

const port = 3000;
const app = express();

console.error('ENV check', {
 hasUser: Boolean(process.env.USER_GMAIL),
 hasPass: Boolean(process.env.APP_PASSWORD),
});

const version = Date.now();

app.locals.version = version;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  express.static("public", {
    maxAge: ms("1d"),
    etag: true,
  }),
);

app.get("/", (req, res) => {
  res.render("index.ejs", { alerta: null });
});

app.post("/sendMessage", async (req, res) => {
 const { nombre, mensaje, correo } = req.body;

 try {
 if (!process.env.USER_GMAIL || !process.env.APP_PASSWORD) {
 throw new Error("Missing USER_GMAIL/APP_PASSWORD");
 }

 await sendEmailModule(nombre, mensaje, correo);
 return res.render("index.ejs", { alerta: "success", usuario: nombre });
 } catch (error) {
 console.error("sendMessage error:", error?.message, error);
 return res.status(500).render("index.ejs", { alerta: "error" });
 }
});

app.get("/prueba", (req, res) => {
  res.render("test.ejs", { enviado: true });
  console.log("Se cargó la vista de prueba");
});

app.listen(port, () => {
  console.log(`All good from port ${port}, Azpil `);
});

function sendEmailModule(nombre, mensaje, correo) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_GMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: correo,
    to: process.env.USER_GMAIL,
    subject: `Mail from ${nombre}. ${correo}`,
    text: mensaje,
  };

  return transporter.sendMail(mailOptions);
}

import express from "express";
import ms from "ms";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import "dotenv/config";

const port = 3000;
const app = express();

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
  //   const nombre = req.body.nombre;
  //   const subject = req.body.mensaje;
  //   const correo = req.body.correo;

  //!Destructuración.

  const { nombre, mensaje, correo } = req.body;

  try {
    if (!process.env.USER_GMAIL || !process.env.APP_PASSWORD) {
      throw new Error("Missing USER_GMAIL/APP_PASSWORD");
    }
    await sendEmailModule(nombre, mensaje, correo);
    res.render("index.ejs", { alerta: "success", usuario: nombre });
  } catch (error) {
    if (!process.env.USER_GMAIL || !process.env.APP_PASSWORD)
      throw new Error("Missing USER_GMAIL/APP_PASSWORD");
    console.error("Error al enviar email");
    console.error("sendMessage error:", error?.message);
    console.error("stack:", error?.stack);
    console.error("raw:", error);
    res
      .status(500)
      .json({ ok: false, error: error?.message || "sendMessage failed" });
    res.render("index.ejs", { alerta: "error" });
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

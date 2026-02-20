import express from "express";
import ejs from "ejs";
import ms from "ms";


const port = 3000;
const app = new express();

const version = Date.now();

app.locals.version = version;

app.use(express.static("public", {
    maxAge: ms("1d"),
    etag: true
}));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/us", (req, res) => {
    console.log("It is the us sections");
})

app.get("/contact", (req, res) => {
    console.log("The contact info")
})

app.listen(port, () => {
    console.log(`All good from port ${port}, Azpil ` );
})
import express from "express";
import ejs from "ejs";

const port = 3000;
const app = new express();

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/us", (req, res) => {
    console.log("It is the us sections");
})

app.listen(port, () => {
    console.log(`All good from port ${port} ` );
})
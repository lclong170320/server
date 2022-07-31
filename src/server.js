import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRouters from "./router/web";
import conNectDB from "./config/connectDB";
require('dotenv').config();

let app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

viewEngine(app);
initWebRouters(app);

conNectDB();

let port = process.env.PORT;

app.listen(port, () => {
    console.log("backend note js cổng :" + port);
    console.log("khoi tao thanh cong web : http://localhost:3000/");
})

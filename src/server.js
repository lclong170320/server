import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRouters from "./router/web";
import conNectDB from "./config/connectDB";

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

viewEngine(app);
initWebRouters(app);

conNectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  res.status(404).send("Page No Found");
});

let port = process.env.PORT;

app.listen(port, () => {
  console.log("backend note js cổng :" + port);
  console.log("khoi tao thanh cong web : http://localhost:3000/");
});

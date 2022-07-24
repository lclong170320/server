import express from "express";

let router = express.Router();

let initWebRouters = (app) => {
    router.get('/', (req , res) => {
        return res.send("hello day la bai dau tien cua toi!!!");
    })
    return app.use("/", router)

}

module.exports = initWebRouters;
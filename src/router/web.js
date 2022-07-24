import express from "express";
import homtroller from "../controllers/homeController"

let router = express.Router();

let initWebRouters = (app) => {
    router.get('/', homtroller.getHomePage)

    router.get('/test', (req , res) => {
        return res.send("hello day la bai dau tien cua toi!!!");
    })


    


    return app.use("/", router)

}

module.exports = initWebRouters;
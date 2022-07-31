import express from "express";
import homController from "../controllers/homeController"

let router = express.Router();

let initWebRouters = (app) => {
    router.get('/', homController.getHomePage)

    router.get('/test', (req, res) => {
        return res.send("hello day la bai dau tien cua toi!!!");
    })

    router.get('/crud', homController.getCrud)





    return app.use("/", router)

}

module.exports = initWebRouters;
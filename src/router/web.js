import express from "express";
import homController from "../controllers/homeController"

let router = express.Router();

let initWebRouters = (app) => {
    router.get('/', homController.getHomePage);

    router.get('/test', (req, res) => {
        return res.s; end("hello day la bai dau tien cua toi!!!");
    });

    router.get('/crud', homController.getCrud);
    router.post('/post-crud', homController.postCrud);
    router.get('/get-category', homController.getCategory);







    return app.use("/", router)

}

module.exports = initWebRouters;

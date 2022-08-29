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
    router.get('/category-sua', homController.suaCategory);
    router.post('/put-crud', homController.putCrud);
    router.get('/category-xoa', homController.xoaCategory);









    return app.use("/", router)

}

module.exports = initWebRouters;

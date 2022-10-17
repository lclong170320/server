const express = require("express");
const router = express.Router();
const Joi = require("joi");
const fs = require("fs");

import validateRequest from "../middleware/validate-request.js";

import orderService from "../services/order.service.js";

// routes

router.get("/", getAll);
router.post("/", createSchema, create);
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
  const queries = {
    customer_id: req.query.customer_id,
    staff_id: req.query.staff_id,
    limit: req.query.limit,
    start: req.query.start,
  };
  orderService
    .getAll(queries)
    .then((order) => res.json(order))
    .catch(next);
}

function create(req, res, next) {
  const params = req.body;
  orderService
    .create(params)
    .then(() => res.json({ message: "Order created successfully" }))
    .catch(next);
}

function update(req, res, next) {
  const file = req.file;
  if (file) {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      const params = req.body;
      params.category_img = file.path;
      categoryService
        .update(req.params.id, params)
        .then(() => res.json({ message: "Category updated successfully" }))
        .catch(next);
    } else {
      fs.unlink(file.path, (err) => {
        res
          .status(403)
          .contentType("text/plain")
          .end("Không phải là ảnh vui lòng chọn lại");
      });
    }
  } else {
    const params = req.body;
    categoryService
      .update(req.params.id, params)
      .then(() => res.json({ message: "Category updated successfully" }))
      .catch(next);
  }
}

function _delete(req, res, next) {
  categoryService
    .delete(req.params.id)
    .then(() => res.json({ message: "Category deleted successfully" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    customer_id: Joi.number().required(),
    staff_id: Joi.number().empty(""),
    address: Joi.string().required(),
    order_total: Joi.number().required(),
    order_payment: Joi.string().required(),
    order_detail: Joi.array().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    category_name: Joi.string().empty(""),
    category_img: Joi.any(),
  });
  validateRequest(req, next, schema);
}

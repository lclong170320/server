const express = require("express");
const router = express.Router();
const Joi = require("joi");
const fs = require("fs");

import validateRequest from "../middleware/validate-request.js";

import orderService from "../services/order.service.js";

// routes

router.get("/", getAll);
router.get("/statistical", getAllStatistical);
router.post("/", createSchema, create);
router.put("/:id", updateSchema, update);
router.put("/status/:id", updateStatusOrderSchema, updateStatusOrder);
router.delete("/:id", _delete);
router.post("/create_payment_url", createPayment);

module.exports = router;

// route functions

function getAll(req, res, next) {
  const queries = {
    customer_id: req.query.customer_id,
    staff_id: req.query.staff_id,
    order_id: req.query.order_id,
    order_status: req.query.order_status,
    order_total: req.query.order_total,
    soft_Delete: req.query.soft_Delete,
    order_payment: req.query.order_payment,
    created_at: req.query.created_at,
    limit: req.query.limit,
    start: req.query.start,
  };
  orderService
    .getAll(queries)
    .then((order) => res.json(order))
    .catch(next);
}

function getAllStatistical(req, res, next) {
  const queries = {
    year: req.query.year,
  };
  orderService
    .getAllStatistical(queries)
    .then((order) => res.json(order))
    .catch(next);
}

async function create(req, res, next) {
  const params = req.body;
  await orderService
    .create(params, req)
    .then(() => res.json({ message: "Order created successfully" }))
    .catch(next);
}

function createPayment(req, res, next) {
  orderService
    .createPayment(req, res, next)
    .then((url) => res.json({ url }))
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

function updateStatusOrder(req, res, next) {
  const params = req.body;
  orderService
    .updateStatusOrder(req.params.id, params)
    .then(() => res.json({ message: "Order status updated successfully" }))
    .catch(next);
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
    customer_id: Joi.number().empty(""),
    staff_id: Joi.number().empty(""),
    address: Joi.string().required(),
    order_total: Joi.number().required(),
    order_note: Joi.string().empty(""),
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

function updateStatusOrderSchema(req, res, next) {
  const schema = Joi.object({
    status: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

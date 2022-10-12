const express = require("express");
const router = express.Router();
const Joi = require("joi");
import validateRequest from "../middleware/validate-request.js";

import discountService from "../services/discount.service.js";

// routes
router.get("/", getAll);
router.post("/", createSchema, create);
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);

module.exports = router;

// route functions
function getAll(req, res, next) {
  const queries = {
    discount_id: req.query.discount_id,
    product_id: req.query.product_id,
    limit: req.query.limit,
    start: req.query.start,
  };
  discountService
    .getAll(queries)
    .then((discount) => res.json(discount))
    .catch(next);
}



function create(req, res, next) {
  discountService
    .create(req.body)
    .then(() => res.json({ message: "Discount created" }))
    .catch(next);
}

function update(req, res, next) {
  discountService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "User updated" }))
    .catch(next);
}

function _delete(req, res, next) {
  discountService
    .delete(req.params.id)
    .then(() => res.json({ message: "Discount deleted" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    product_id: Joi.number().required(),
    discount_name:  Joi.string().required(),
    discount_percent:  Joi.number().required(),
    discount_start: Joi.date().required(),
    discount_end:  Joi.date().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    discount_id: Joi.string().empty(""),
    discount_name: Joi.string().empty(""),
    discount_percent: Joi.number().empty(""),
    discount_start: Joi.date().empty(""),
    discount_end: Joi.date().empty(""),

  }).with("password", "confirmPassword");
  validateRequest(req, next, schema);
}

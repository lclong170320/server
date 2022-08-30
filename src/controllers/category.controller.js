const express = require("express");
const router = express.Router();
const Joi = require("joi");
import validateRequest from "../middleware/validate-request.js";

import categoryService from "../services/category.service.js";

// routes

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createSchema, create);
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
  categoryService
    .getAll()
    .then((category) => res.json(category))
    .catch(next);
}

function getById(req, res, next) {
  categoryService
    .getById(res, req.params.id)
    .then((category) => res.json(category))
    .catch(next);
}

function create(req, res, next) {
  categoryService
    .create(req.body)
    .then(() => res.json({ message: "Category created" }))
    .catch(next);
}

function update(req, res, next) {
  categoryService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "User updated" }))
    .catch(next);
}

function _delete(req, res, next) {
  categoryService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    category_name: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    category_name: Joi.string().required().empty(""),
  });
  validateRequest(req, next, schema);
}

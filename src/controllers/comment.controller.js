const express = require("express");
const router = express.Router();
const Joi = require("joi");

import validateRequest from "../middleware/validate-request.js";

import commentService from "../services/comment.service";

// routes
router.get("/", getAll);
router.post("/", createSchema, create);
router.delete("/:id", _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
  const queries = {
    customer_id: req.query.customer_id,
    product_id: req.query.product_id,
    limit: req.query.limit,
    start: req.query.start,
  };
  commentService
    .getAll(queries)
    .then((comment) => res.json(comment))
    .catch(next);
}

function create(req, res, next) {
  commentService
    .create(req.body)
    .then(() => res.json({ message: "Comment created successfully" }))
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
    product_id: Joi.number().required(),
    customer_id: Joi.number().required(),
    comment_content: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

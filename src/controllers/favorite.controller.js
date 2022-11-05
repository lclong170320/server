const express = require("express");
const router = express.Router();
const Joi = require("joi");

import validateRequest from "../middleware/validate-request.js";

import favoriteService from "../services/favorite.service.js";

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
  favoriteService
    .getAll(queries)
    .then((favorite) => res.json(favorite))
    .catch(next);
}

function create(req, res, next) {
  favoriteService
    .create(req.body)
    .then(() => res.json({ message: "Favorite created successfully" }))
    .catch(next);
}

function _delete(req, res, next) {
  favoriteService
    .delete(req.params.id)
    .then(() => res.json({ message: "Favorite deleted successfully" }))
    .catch(next);
}

// schema functions
function createSchema(req, res, next) {
  const schema = Joi.object({
    product_id: Joi.number().required(),
    customer_id: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

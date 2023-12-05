const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");

import validateRequest from "../middleware/validate-request.js";

import productService from "../services/product.service.js";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

// routes

router.get("/", getAll);
router.post("/", upload.array("product_img"), createSchema, create);
router.put("/:id", upload.array("product_img"), updateSchema, update);
router.delete("/:id", _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
  const queries = {
    product_id: req.query.product_id,
    product_name: req.query.product_name,
    category_id: req.query.category_id,
    limit: req.query.limit,
    start: req.query.start,
    orderCheck: req.query.orderCheck,
  };
  productService
    .getAll(queries)
    .then((product) => res.json(product))
    .catch(next);
}

function create(req, res, next) {
  const manyFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    manyFiles.push(req.files[i].path);
  }
  if (
    req.files[0].mimetype == "image/jpeg" ||
    req.files[0].mimetype == "image/png"
  ) {
    const params = req.body;
    productService
      .create(params, manyFiles)
      .then(() => res.json({ message: "Product created successfully" }))
      .catch(next);
  } else {
    for (let i = 0; i < req.files.length; i++) {
      fs.unlink(req.files[i].path, (err) => {});
    }
  }
}

function update(req, res, next) {
  const manyFiles = [];
  if (req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      manyFiles.push(req.files[i].path);
    }
    if (
      req.files[0].mimetype == "image/jpeg" ||
      req.files[0].mimetype == "image/png"
    ) {
      const params = req.body;
      productService
        .update(req.params.id, params, manyFiles)
        .then(() => res.json({ message: "Product updated successfully" }))
        .catch(next);
    } else {
      for (let i = 0; i < req.files.length; i++) {
        fs.unlink(req.files[i].path, (err) => {});
      }
    }
  } else {
    const params = req.body;
    productService
      .update(req.params.id, params, manyFiles)
      .then(() => res.json({ message: "Category updated successfully" }))
      .catch(next);
  }
}

function _delete(req, res, next) {
  productService
    .delete(req.params.id)
    .then(() => res.json({ message: "Product deleted successfully" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    product_name: Joi.string().required(),
    category_id: Joi.string().required(),
    product_describe: Joi.string().required(),
    product_price: Joi.number().required(),
    provider: Joi.string().required(),
    product_quantity: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    product_name: Joi.string().empty(""),
    category_id: Joi.string().empty(""),
    product_describe: Joi.string().empty(""),
    product_price: Joi.number().empty(""),
    provider: Joi.string().empty(""),
    product_quantity: Joi.number().empty(""),
  });
  validateRequest(req, next, schema);
}

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
router.post("/", upload.single("product_img"), createSchema, create);
router.put("/:id", upload.single("product_img"), updateSchema, update);
router.delete("/:id", _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
  const queries = {
    product_id: req.query.product_id,
    product_name: req.query.product_name,
    limit: req.query.limit,
    start: req.query.start,
  };
  productService
    .getAll(queries)
    .then((product) => res.json(product))
    .catch(next);
}

function create(req, res, next) {
  const file = req.file;
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png')
  {
    const params = req.body;
    params.product_img = file.path;
    productService
      .create(params)
      .then(() => res.json({ message: "Product created successfully" }))
      .catch(next);
  } else {
  fs.unlink(file.path, err => {
    res
      .status(403)
      .contentType("text/plain")
      .end("Không phải là ảnh vui lòng chọn lại");
  });
}
}


function update(req, res, next) {
  const file = req.file;
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png')
  {
    const params = req.body;
    params.product_img = file.path;
    productService
    .update(req.params.id, params)
    .then(() => res.json({ message: "Product updated successfully" }))
    .catch(next);
  } else {
  fs.unlink(file.path, err => {
    res
      .status(403)
      .contentType("text/plain")
      .end("Không phải là ảnh vui lòng chọn lại");
  });
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
    product_img: Joi.any(),
    product_describe: Joi.string().required(),
    product_salePrice: Joi.number().required(),
    product_price: Joi.number().required(),
    provider: Joi.string().required(),
    quantity: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    product_name: Joi.string().required().empty(""),
    product_img: Joi.any(),
    product_describe: Joi.string().required().empty(""),
    product_salePrice: Joi.number().required().empty(""),
    product_price: Joi.number().required().empty(""),
    provider: Joi.string().required().empty(""),
  });
  validateRequest(req, next, schema);
}

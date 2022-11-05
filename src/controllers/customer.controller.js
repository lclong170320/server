const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");

import validateRequest from "../middleware/validate-request.js";
import customerService from "../services/customer.service";

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
router.post("/address", createAddress, createAddressSchema);
router.post("/", create, createSchema);
router.put("/:id", upload.single("customer_avatar"), updateSchema, update);
router.put("/account/:id", updateAccountSchema, updateAccount);
router.delete("/:id", _delete);
router.delete("/address/:id", deleteAddress);
module.exports = router;

// route functions

function getAll(req, res, next) {
  const queries = {
    customer_id: req.query.customer_id,
    customer_name: req.query.customer_name,
    account_id: req.query.account_id,
    limit: req.query.limit,
    start: req.query.start,
  };
  customerService
    .getAll(queries)
    .then((customer) => res.json(customer))
    .catch(next);
}

function create(req, res, next) {
  customerService
    .create(req.body)
    .then((customer_id) => res.json(customer_id))
    .catch(next);
}

function createAddress(req, res, next) {
  const params = req.body;
  customerService
    .createAddress(params)
    .then(() => res.json({ message: "Update address" }))
    .catch(next);
}

function update(req, res, next) {
  const file = req.file;
  if (file) {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      const params = req.body;
      params.customer_avatar = file.path;
      customerService
        .update(req.params.id, params)
        .then(() => res.json({ message: "Customer updated successfully" }))
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
    customerService
      .update(req.params.id, params)
      .then(() => res.json({ message: "Customer updated successfully" }))
      .catch(next);
  }
}

function updateAccount(req, res, next) {
  const params = req.body;
  customerService
    .updateAccount(req.params.id, params)
    .then(() => res.json({ message: "Customer updated successfully" }))
    .catch(next);
}

function _delete(req, res, next) {
  customerService
    .delete(req.params.id)
    .then(() => res.json({ message: "Category deleted successfully" }))
    .catch(next);
}

function deleteAddress(req, res, next) {
  console.log(req.params.id);
  customerService
    .deleteAddress(req.params.id)
    .then(() => res.json({ message: "Address deleted successfully" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required().unique(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function createAddressSchema(req, res, next) {
  const schema = Joi.object({
    customer_id: Joi.string().required(),
    address: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    customer_name: Joi.string().required(),
    customer_gmail: Joi.string().required(),
    customer_dob: Joi.date().required(),
    customer_phone: Joi.string().required(),
    customer_avatar: Joi.any(),
  });
  validateRequest(req, next, schema);
}

function updateAccountSchema(req, res, next) {
  const schema = Joi.object({
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

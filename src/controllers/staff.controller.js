const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");

import validateRequest from "../middleware/validate-request.js";
import staffService from "../services/staff.service";

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
router.post("/", upload.single("staff_avatar"), create, createSchema);
router.put("/:id", upload.single("staff_avatar"), updateSchema, update);
router.put("/changePassword/:id", updateAccountSchema, updatePasswordAdmin);
router.delete("/:id", _delete);
module.exports = router;

// route functions

function getAll(req, res, next) {
  const queries = {
    limit: req.query.limit,
    start: req.query.start,
    staff_name: req.query.staff_name,
  };
  staffService
    .getAll(queries)
    .then((staff) => res.json(staff))
    .catch(next);
}

function create(req, res, next) {
  const file = req.file;
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    const params = req.body;
    params.staff_avatar = file.path;
    staffService
      .create(params)
      .then((staff) => res.json(staff))
      .catch(next);
  } else {
    fs.unlink(file.path, (err) => {
      res
        .status(403)
        .contentType("text/plain")
        .end("Không phải là ảnh vui lòng chọn lại");
    });
  }
}

function update(req, res, next) {
  const file = req.file;
  if (file) {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      const params = req.body;
      params.staff_avatar = file.path;
      staffService
        .update(req.params.id, params)
        .then(() => res.json({ message: "Staff updated successfully" }))
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
    staffService
      .update(req.params.id, params)
      .then(() => res.json({ message: "Staff updated successfully" }))
      .catch(next);
  }
}

function updatePasswordAdmin(req, res, next) {
  staffService
    .updatePasswordAdmin(req.params.id)
    .then(() => res.json({ message: "Customer updated successfully" }))
    .catch(next);
}

// function updateAccount(req, res, next) {
//   const params = req.body;
//   customerService
//     .updateAccount(req.params.id, params)
//     .then(() => res.json({ message: "Customer updated successfully" }))
//     .catch(next);
// }

function _delete(req, res, next) {
  staffService
    .delete(req.params.id)
    .then(() => res.json({ message: "Staff deleted successfully" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required().unique(),
    password: Joi.string().required(),
    staff_name: Joi.string().required(),
    staff_phone: Joi.number().required(),
    staff_gmail: Joi.string().required(),
    staff_dob: Joi.string().required(),
    staff_type: Joi.string().required(),
    staff_address: Joi.string().required(),
    staff_avatar: Joi.any(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    staff_name: Joi.string().required(),
    staff_phone: Joi.number().required(),
    staff_gmail: Joi.string().required(),
    staff_dob: Joi.string().required(),
    staff_type: Joi.string().required(),
    staff_address: Joi.string().required(),
    staff_avatar: Joi.any(),
  });
  validateRequest(req, next, schema);
}

function updateAccountSchema(req, res, next) {
  const schema = Joi.object({
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

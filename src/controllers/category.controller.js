const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");

import validateRequest from "../middleware/validate-request.js";

import categoryService from "../services/category.service.js";

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
router.post("/", upload.single("category_img"), createSchema, create);
router.put("/:id", upload.single("category_img"), updateSchema, update);
router.delete("/:id", _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
  const queries = {
    category_id: req.query.category_id,
    category_name: req.query.category_name,
    limit: req.query.limit,
    start: req.query.start,
  };
  categoryService
    .getAll(queries)
    .then((category) => res.json(category))
    .catch(next);
}

function create(req, res, next) {
  const file = req.file;
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png')
  {
    const params = req.body;
    params.category_img = file.path;
    categoryService
      .create(params)
      .then(() => res.json({ message: "Category created successfully" }))
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
  if(file){
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png')
    {
      const params = req.body;
      params.category_img = file.path;
      categoryService
      .update(req.params.id, params)
      .then(() => res.json({ message: "Category updated successfully" }))
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
  else {
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
    category_name: Joi.string().required(),
    category_img: Joi.any(),
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

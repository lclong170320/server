import { Op } from "sequelize";
import db from "../models/index";

const fs = require("fs");

async function getAll(queries) {
  const start = queries.start ? parseInt(queries.start) : 1;
  const limit = queries.limit ? parseInt(queries.limit) : 10;
  const offset = start - 1;
  const check = {
    limit: limit,
    offset: offset,
    favoriteWhereCond: favoriteQuery(queries),
  };
  const { count, rows } = await db.favorite.findAndCountAll({
    where: {
      [Op.and]: check.favoriteWhereCond,
    },
    include: [
      {
        model: db.product,
        as: "product",
        attributes: ["product_id", "product_name", "provider"],
        include: [
          {
            model: db.image,
            attributes: ["image_id", "image_name"],
          },
        ],
      },
    ],
    offset: check.offset,
    limit: check.limit,
  });

  return {
    start: start,
    limit: limit,
    rows_count: count,
    favorites: rows,
  };
}

function favoriteQuery(queries) {
  const checkOptions = [];
  if (queries.product_id) {
    checkOptions.push({
      product_id: parseInt(queries.product_id),
    });
  }
  if (queries.customer_id) {
    checkOptions.push({
      customer_id: parseInt(queries.customer_id),
    });
  }
  return checkOptions;
}

async function create(params) {
  if (
    (await db.favorite.findOne({
      where: { customer_id: params.customer_id },
    })) &&
    (await db.favorite.findOne({
      where: { product_id: params.product_id },
    }))
  ) {
    throw "Customer is Exist";
  }
  await db.favorite.create({
    product_id: params.product_id,
    customer_id: params.customer_id,
  });
}

async function _delete(id) {
  const product = await getProduct(id);
  const storage = await db.storage.findOne({
    where: { product_id: product.product_id },
  });
  const image = await db.image.findAll({
    where: { product_id: product.product_id },
  });
  for (let i = 0; i < image.length; i++) {
    fs.unlink(image[i].image_name, (err) => {
      console.log("Xoá file 1 thành công");
    });
    await image[i].destroy();
  }
  await storage.destroy();
  await product.destroy();
}

// helper functions

async function getProduct(id) {
  const product = await db.product.findByPk(id);
  if (!product) throw "Product not found";
  return product;
}

module.exports = {
  getAll,
  create,
  delete: _delete,
};

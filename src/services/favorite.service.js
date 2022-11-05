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
  const check = await getCheck(params.customer_id, params.product_id);

  await db.favorite.create({
    product_id: params.product_id,
    customer_id: params.customer_id,
  });
}

async function _delete(id) {
  const favorite = await getFavorite(id);
  await favorite.destroy();
}

// helper functions

async function getFavorite(id) {
  const favorite = await db.favorite.findByPk(id);
  if (!favorite) throw "Favorite not found";
  return favorite;
}

async function getCheck(customer_id, product_id) {
  const check = await db.favorite.findOne({
    where: { customer_id: customer_id, product_id: product_id },
  });
  if (check) throw "Customer and product found";
  return check;
}

module.exports = {
  getAll,
  create,
  delete: _delete,
};

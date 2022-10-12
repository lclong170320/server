import { Op } from "sequelize";
import db from "../models/index";

async function getAll(queries) {
  const start = queries.start ? parseInt(queries.start) : 1;
  const limit = queries.limit ? parseInt(queries.limit) : 10;
  const offset = start - 1;

  const check = {
    limit: limit,
    offset: offset,
    discountWhereCond: discountQuery(queries),
  };
  const { count, rows } = await db.discount.findAndCountAll({
    where: {
      [Op.and]: check.discountWhereCond,
    },
    order: [["discount_id", "DESC"]],
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: db.product,
        as: "product",
        attributes: {
          exclude: [
            "provider",
            "product_id",
            "product_describe",
            "category_id",
            "createdAt",
            "updatedAt",
          ],
        },
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
    discounts: rows,
  };
}

function discountQuery(queries) {
  const checkOptions = [];
  if (queries.discount_id) {
    checkOptions.push({
      discount_id: {
        [Op.eq]: parseInt(queries.discount_id),
      },
    });
  }

  if (queries.product_id) {
    checkOptions.push({
      product_id: {
        [Op.eq]: parseInt(queries.product_id),
      },
    });
  }
  return checkOptions;
}

async function create(params) {
  // validate;
  db.discount.create({
    product_id: params.product_id,
    discount_name: params.discount_name,
    discount_percent: params.discount_percent,
    discount_start: params.discount_start,
    discount_end: params.discount_end,
  });
}

async function update(id, params) {
  const checkDiscount = await getDiscount(id);
  await db.discount.update(
    {
      discount_name: params.discount_name,
      discount_percent: params.discount_percent,
      discount_start: params.discount_start,
      discount_end: params.discount_end,
    },
    {
      where: {
        discount_id: checkDiscount.discount_id,
      },
    }
  );
}

async function _delete(id) {
  const discount = await getDiscount(id);
  await discount.destroy();
}

// helper functions

async function getDiscount(id) {
  const discount = await db.discount.findByPk(id);
  if (!discount) throw "Discount not found";
  return discount;
}

module.exports = {
  getAll,
  create,
  update,
  delete: _delete,
};

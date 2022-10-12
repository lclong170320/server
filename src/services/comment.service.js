import { Op } from "sequelize";
import db from "../models/index";

async function getAll(queries) {
  const start = queries.start ? parseInt(queries.start) : 1;
  const limit = queries.limit ? parseInt(queries.limit) : 10;
  const offset = start - 1;

  const check = {
    limit: limit,
    offset: offset,
    commentWhereCond: commentQuery(queries),
  };
  const { count, rows } = await db.comment.findAndCountAll({
    where: {
      [Op.and]: check.commentWhereCond,
    },
    order: [["comment_id", "DESC"]],
    include: [
      {
        model: db.customer,
        as: "customer",
        attributes: {
          exclude: [
            "customer_id",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    ],
    offset: check.offset,
    limit: check.limit,
  });
  return {
    start: start,
    limit: limit,
    rows_count: count,
    comments: rows,
  };
}

function commentQuery(queries) {
  const checkOptions = [];
  if (queries.customer_id) {
    checkOptions.push({
      customer_id: {
        [Op.eq]: parseInt(queries.customer_id),
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
  db.comment.create({
    product_id: params.product_id,
    customer_id: params.customer_id,
    comment_content: params.comment_content,
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

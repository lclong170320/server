import { Op } from "sequelize";
import db from "../models/index";

async function getAll(queries) {
  const start = queries.start ? parseInt(queries.start) : 1;
  const limit = queries.limit ? parseInt(queries.limit) : 10;
  const offset = start - 1;

  let checkCustomer = {};
  if (queries.customer_name) {
    checkCustomer = { customer_name: `${queries.customer_name}` };
  }

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
          exclude: ["customer_id", "createdAt", "updatedAt"],
        },
        where: checkCustomer,
      },
    ],
    distinct: true,
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

  if (queries.comment_content) {
    checkOptions.push({
      comment_content: {
        [Op.substring]: queries.comment_content,
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
    comment_star: params.comment_star,
  });
}

async function _delete(id) {
  const comment = await getComment(id);
  await comment.destroy();
}

// helper functions

async function getComment(id) {
  const comment = await db.comment.findByPk(id);
  if (!comment) throw "comment not found";
  return comment;
}

module.exports = {
  getAll,
  create,
  delete: _delete,
};

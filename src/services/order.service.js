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
    orderWhereCond: orderQuery(queries),
  };
  const { count, rows } = await db.order.findAndCountAll({
    where: {
      [Op.and]: check.orderWhereCond,
    },
    include: [
      {
        model: db.order_detail,
        attributes: ["detail_quantity", "detail_price"],
      },
      {
        model: db.order_status,
        attributes: ["status"],
      },
    ],
    offset: check.offset,
    limit: check.limit,
  });
  return {
    start: start,
    limit: limit,
    rows_count: count,
    orders: rows,
  };
}

function orderQuery(queries) {
  const checkOptions = [];
  if (queries.order_id) {
    checkOptions.push({
      order_id: {
        [Op.eq]: parseInt(queries.order_id),
      },
    });
  }

  // if (queries.category_name) {
  //   checkOptions.push({
  //     category_name: {
  //       [Op.substring]: queries.category_name,
  //     },
  //   });
  // }
  return checkOptions;
}

async function create(params) {
  try {
    await this.sequelize.transaction(async (t) => {
      const transaction = { transaction: t };
      
      const order = await db.order.create({
        customer_id: params.customer_id,
        staff_id: params.staff_id,
        order_total: params.order_total,
        order_payment: params.order_payment,
      });
      await db.order_detail.create({
        order_id: order.order_id,
        product_id: params.product_id,
        detail_quantity: params.detail_quantity,
        detail_price: params.detail_price,
      });
    
      await db.order_status.create({
        status: "Chưa xác nhận",
        order_id: order.order_id,
      });
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function update(id, params) {
  const category = await getCategory(id);
  if (
    await db.category.findOne({
      where: { category_name: params.category_name, category_id: !id },
    })
  ) {
    fs.unlink(params.category_img, (err) => {
      console.log("Xoá file thành công");
    });
    throw 'Category name "' + params.category_name + '" is Exist';
  }

  if (
    (params.category_img === undefined && category) ||
    (params.category_img === "" && category)
  ) {
    return await db.category.update(
      { category_name: params.category_name },
      {
        where: {
          category_id: id,
        },
      }
    );
  }
  if (category && params.category_img !== undefined) {
    fs.unlink(category.category_img, (err) => {
      console.log("Xoá file 1 thành công");
    });
    return await db.category.update(
      {
        category_name: params.category_name,
        category_img: params.category_img,
      },
      {
        where: {
          category_id: id,
        },
      }
    );
  }
}

async function _delete(id) {
  const category = await getCategory(id);
  fs.unlink(category.category_img, (err) => {
    console.log("Xoá file thành công");
  });
  await category.destroy();
}

// helper functions

async function getCategory(id) {
  const category = await db.category.findByPk(id);
  if (!category) throw "Category not found";
  return category;
}

module.exports = {
  getAll,
  create,
  update,
  delete: _delete,
};

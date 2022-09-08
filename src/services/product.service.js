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
    productWhereCond: productQuery(queries),
  };
  const { count, rows } = await db.product.findAndCountAll({
    where: {
      [Op.and]: check.productWhereCond,
    },
    offset: check.offset,
    limit: check.limit,
  });
  return {
    start: start,
    limit: limit,
    rows_count: count,
    products: rows,
  };
}

function productQuery(queries) {
  const checkOptions = [];
  if (queries.product_id) {
    checkOptions.push({
      product_id: {
        [Op.eq]: parseInt(queries.product_id),
      },
    });
  }

  if (queries.product_name) {
    checkOptions.push({
      product_name: {
        [Op.substring]: queries.product_name,
      },
    });
  }
  return checkOptions;
}


async function create(params) {
  // validate;
  if (
    await db.product.findOne({
      where: { product_name: params.product_name },
    })
  ) {
    throw 'Product name "' + params.product_name + '" is Exist';
  }
  const product = await db.product.create({ 
    product_name: params.product_name,
    category_id: params.category_id,
    product_img: params.product_img,
    product_describe: params.product_describe,
    product_salePrice: params.product_salePrice,
    product_price: params.product_price,
    provider: params.provider
     });

    await db.depot.create({
      product_id: product.product_id,
      quantity: params.quantity,
      sold: 0,
    })
    
}

async function update(id, params) {
  const product = await getProduct(id);
  if(params.product_img != ''){
    fs.unlink(product.product_img, err => {
      console.log('Xoá file thành công');
    })
  }
  if (product) {
    await db.product.update(
      { product_name: params.product_name,
         product_img: params.product_img
      },
      {
        where: {
          product_id: id,
        },
      }
    );
  }
}

async function _delete(id) {
  const product = await getProduct(id);
  fs.unlink(product.product_img, err => {
    console.log('Xoá file thành công');
  })
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
  update,
  delete: _delete,
};

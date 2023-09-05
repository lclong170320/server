import { Op } from "sequelize";
import db from "../models/index";

const fs = require("fs");

async function getAll(queries) {
  const start = queries.start ? parseInt(queries.start) : 1;
  const limit = queries.limit ? parseInt(queries.limit) : 10;
  const orderCheck = queries.orderCheck ? queries.orderCheck : "ASC";
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
    include: [
      {
        model: db.category,
        as: "category",
        attributes: {
          exclude: ["category_img", "createdAt", "updatedAt"],
        },
      },
      {
        model: db.storage,
        as: "storage",
        attributes: {
          exclude: ["storage_id", "createdAt", "updatedAt"],
        },
      },
      {
        model: db.image,
        as: "images",
        attributes: {
          exclude: ["image_id", , "product_id", "createdAt", "updatedAt"],
        },
      },
      {
        model: db.discount,
        as: "discount",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
    order: [["product_id", orderCheck]],
    attributes: {
      exclude: ["category_id"],
    },
    distinct: true,
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
  if (queries.category_id) {
    checkOptions.push({
      category_id: queries.category_id,
    });
  }

  return checkOptions;
}

async function create(params, manyFiles) {
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
    product_describe: params.product_describe,
    product_price: params.product_price,
    provider: params.provider,
  });

  await db.storage.create({
    product_id: product.product_id,
    product_quantity: params.product_quantity,
    product_sold: 0,
  });

  for (let i = 0; i < manyFiles.length; i++) {
    await db.image.create({
      product_id: product.product_id,
      image_name: manyFiles[i],
    });
  }
}

async function update(id, params, manyFiles) {
  const product = await getProduct(id);
  const storage = await db.storage.findOne({
    where: { product_id: product.product_id },
  });
  const image = await db.image.findAll({
    where: { product_id: product.product_id },
  });
  const check = await db.product.findOne({
    where: { product_name: params.product_name, product_id: !id },
  });
  if (check) {
    fs.unlink(params.product_img, (err) => {
      console.log("Xoá file thành công");
    });
    throw 'Product name "' + params.product_name + '" is Exist';
  }

  if (manyFiles.length > 0) {
    console.log(manyFiles.length);
    for (let i = 0; i < image.length; i++) {
      fs.unlink(image[i].image_name, (err) => {
        console.log("Xoá file 1 thành công");
      });
      await image[i].destroy();
    }
    const uploadProduct = await db.product.update(
      {
        product_name: params.product_name,
        category_id: params.category_id,
        product_describe: params.product_describe,
        product_price: params.product_price,
        provider: params.provider,
      },
      {
        where: {
          product_id: id,
        },
      }
    );
    if (uploadProduct) {
      await db.storage.update(
        {
          product_quantity: params.product_quantity,
          product_sold: storage.product_sold,
        },
        {
          where: {
            product_id: id,
          },
        }
      );
      for (let i = 0; i < manyFiles.length; i++) {
        await db.image.create({
          product_id: product.product_id,
          image_name: manyFiles[i],
        });
      }
      return true;
    }
  }

  if (manyFiles.length == 0) {
    const uploadProduct = await db.product.update(
      {
        product_name: params.product_name,
        category_id: params.category_id,
        product_describe: params.product_describe,
        product_price: params.product_price,
        provider: params.provider,
      },
      {
        where: {
          product_id: id,
        },
      }
    );
    if (uploadProduct) {
      return await db.storage.update(
        {
          product_quantity: params.product_quantity,
          product_sold: storage.product_sold,
        },
        {
          where: {
            product_id: id,
          },
        }
      );
    }
  }
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
  update,
  delete: _delete,
};

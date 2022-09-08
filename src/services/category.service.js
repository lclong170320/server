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
    categoryWhereCond: categoryQuery(queries),
  };
  const { count, rows } = await db.category.findAndCountAll({
    where: {
      [Op.and]: check.categoryWhereCond,
    },
    offset: check.offset,
    limit: check.limit,
  });
  return {
    start: start,
    limit: limit,
    rows_count: count,
    categories: rows,
  };
}

function categoryQuery(queries) {
  const checkOptions = [];
  if (queries.category_id) {
    checkOptions.push({
      category_id: {
        [Op.eq]: parseInt(queries.category_id),
      },
    });
  }

  if (queries.category_name) {
    checkOptions.push({
      category_name: {
        [Op.substring]: queries.category_name,
      },
    });
  }
  return checkOptions;
}


async function create(params) {
  // validate;
  if (
    await db.category.findOne({
      where: { category_name: params.category_name },
    })
  ) {
    throw 'Category name "' + params.category_name + '" is Exist';
  }

  db.category.create({ category_name: params.category_name, category_img: params.category_img });
}

async function update(id, params) {
  const category = await getCategory(id);
  if(params.category_img != ''){
    fs.unlink(category.category_img, err => {
      console.log('Xoá file thành công');
    })
  }
  if (category) {
    await db.category.update(
      { category_name: params.category_name,
         category_img: params.category_img
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
  fs.unlink(category.category_img, err => {
    console.log('Xoá file thành công');
  })
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

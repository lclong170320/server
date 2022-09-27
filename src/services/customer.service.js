import { Op } from "sequelize";
import db from "../models/index";

const fs = require("fs");
const bcrypt = require('bcrypt');

async function getAll(queries) {
  const start = queries.start ? parseInt(queries.start) : 1;
  const limit = queries.limit ? parseInt(queries.limit) : 10;
  const offset = start - 1;

  const check = {
    limit: limit,
    offset: offset,
    customerWhereCond: customerQuery(queries),
  };
  const { count, rows } = await db.customer.findAndCountAll({
    where: {
      [Op.and]: check.customerWhereCond,
    },
    include: [ 
      { 
        model: db.account,
        attributes: [
            'username',
            'password'
            ]
    }
  ],
    offset: check.offset,
    limit: check.limit,
  });
  return {
    start: start,
    limit: limit,
    rows_count: count,
    customers: rows,
  };
}

function customerQuery(queries) {
  const checkOptions = [];
  if (queries.customer_id) {
    checkOptions.push({
        customer_name: {
        [Op.eq]: parseInt(queries.customer_id),
      },
    });
  }

  if (queries.customer_name) {
    checkOptions.push({
        customer_name: {
        [Op.substring]: queries.customer_name,
      },
    });
  }
  return checkOptions;
}


async function create(params) {
  // validate;
  const hasPassword = await bcrypt.hash(params.password, 10);
  const createAccount = await db.account.create({
    username: params.username,
    password: hasPassword,
  })
  console.log(createAccount.account_id);

  await db.customer.create({ 
    account_id: createAccount.account_id,
    });
}

async function update(id, params) {
  const customer = await getCustomer(id);
  console.log(params.category_img);
  if(params.category_img != ''){
    fs.unlink(category.category_img, err => {
      console.log('Xoá file thành công');
    })
  }
  if (customer) {
    await db.customer.update(
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
  const customer = await getCustomer(id);
  fs.unlink(category.category_img, err => {
    console.log('Xoá file thành công');
  })
  await customer.destroy();
}

// helper functions

async function getCustomer(id) {
  const customer = await db.customer.findByPk(id);
  if (!customer) throw "Category not found";
  return customer;
}

module.exports = {
  getAll,
  create,
  update,
  delete: _delete,
};

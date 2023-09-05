import { Op } from "sequelize";
import db from "../models/index";

const fs = require("fs");
const bcrypt = require("bcryptjs");

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
        attributes: ["account_id", "username", "password"],
      },
      {
        model: db.address,
        attributes: ["address_id", "address", "createdAt", "updatedAt"],
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
    customers: rows,
  };
}

function customerQuery(queries) {
  const checkOptions = [];
  if (queries.customer_id) {
    checkOptions.push({
      customer_id: {
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
  if (queries.account_id) {
    checkOptions.push({
      account_id: {
        [Op.eq]: queries.account_id,
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
  });

  if (params.customer_avatar) {
    await db.customer.create({
      account_id: createAccount.account_id,
      customer_name: params.customer_name,
      type: params.type,
      customer_avatar: params.customer_avatar,
    });
  }

  await db.customer.create({
    account_id: createAccount.account_id,
    type: params.type,
  });

  const customer_id = await getCustomerId(createAccount.account_id);
  return customer_id;
}

async function createAddress(params) {
  // validate;
  const customer = await getCustomer(params.customer_id);

  await db.address.create({
    customer_id: customer.customer_id,
    address: params.address,
  });
}

async function update(id, params) {
  const customer = await getCustomer(id);
  if (
    (params.customer_avatar === undefined && customer) ||
    (params.customer_avatar === "" && customer)
  ) {
    return await db.customer.update(
      {
        customer_name: params.customer_name,
        customer_gmail: params.customer_gmail,
        customer_dob: params.customer_dob,
        customer_phone: params.customer_phone,
      },
      {
        where: {
          customer_id: id,
        },
      }
    );
  }
  if (customer && params.customer_avatar !== undefined) {
    if (customer.category_img) {
      fs.unlink(customer.category_img, (err) => {
        console.log("Xoá file 1 thành công");
      });
    }
    return await db.customer.update(
      {
        customer_name: params.customer_name,
        customer_gmail: params.customer_gmail,
        customer_dob: params.customer_dob,
        customer_phone: params.customer_phone,
        customer_avatar: params.customer_avatar,
      },
      {
        where: {
          customer_id: id,
        },
      }
    );
  }
}

async function updateAccount(id, params) {
  const customer = await getCustomer(id);
  if (customer) {
    const hasPassword = await bcrypt.hash(params.password, 10);
    await db.account.update(
      {
        password: hasPassword,
      },
      {
        where: {
          account_id: customer.account_id,
        },
      }
    );
  }
}

async function _delete(id) {
  const customer = await getCustomer(id);
  await customer.destroy();
}

async function deleteAddress(id) {
  const address = await getAddress(id);
  await address.destroy();
}

// helper functions

async function getCustomer(id) {
  const customer = await db.customer.findByPk(id);
  if (!customer) throw "Customer not found";
  return customer;
}
async function getAddress(id) {
  const address = await db.address.findByPk(id);
  if (!address) throw "Address not found";
  return address;
}
async function getCustomerId(id) {
  const customer = await db.customer.findOne({ where: { account_id: id } });
  if (!customer) throw "customer not found";
  return customer.customer_id;
}

module.exports = {
  getAll,
  create,
  createAddress,
  update,
  delete: _delete,
  deleteAddress,
  updateAccount,
};

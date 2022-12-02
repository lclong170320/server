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
    staffWhereCond: staffQuery(queries),
  };
  const { count, rows } = await db.staff.findAndCountAll({
    where: {
      [Op.and]: check.staffWhereCond,
    },
    include: [
      {
        model: db.account,
        attributes: ["account_id", "username", "password"],
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
    staffs: rows,
  };
}

function staffQuery(queries) {
  const checkOptions = [];
  if (queries.staff_id) {
    checkOptions.push({
      staff_id: {
        [Op.eq]: parseInt(queries.staff_id),
      },
    });
  }

  if (queries.staff_name) {
    checkOptions.push({
      staff_name: {
        [Op.substring]: queries.staff_name,
      },
    });
  }
  // if (queries.account_id) {
  //   checkOptions.push({
  //     account_id: {
  //       [Op.eq]: queries.account_id,
  //     },
  //   });
  // }

  return checkOptions;
}

async function create(params) {
  // validate;
  const hasPassword = await bcrypt.hash(params.password, 10);
  const createAccount = await db.account.create({
    username: params.username,
    password: hasPassword,
  });

  const customer = await db.staff.create({
    account_id: createAccount.account_id,
    staff_name: params.staff_name,
    staff_phone: params.staff_phone,
    staff_gmail: params.staff_gmail,
    staff_dob: params.staff_dob,
    staff_type: params.staff_type,
    staff_address: params.staff_address,
    staff_avatar: params.staff_avatar,
  });

  return customer;
}

async function updatePasswordAdmin(staff_id, body) {
  // validate;
  const staff = await getStaff(staff_id);

  const hasPassword = await bcrypt.hash(body.password, 10);
  const updatePassWord = await db.account.update(
    {
      password: hasPassword,
    },
    {
      where: {
        account_id: staff.account_id,
      },
    }
  );
  return updatePassWord;
}

async function update(id, params) {
  const staff = await getStaff(id);
  if (params.username) {
    const account = await db.account.findOne({
      where: { username: params.username },
    });
    if (account) {
      throw "Username is Exist";
    }
  }
  if (!staff) {
    fs.unlink(params.staff_avatar, (err) => {
      console.log("Xoá file thành công");
    });
    throw "Staff is Exist";
  }
  if (
    (params.staff_avatar === undefined && staff) ||
    (params.staff_avatar === "" && staff)
  ) {
    await db.account.update(
      {
        username: params.username,
      },
      {
        where: {
          account_id: staff.account_id,
        },
      }
    );

    return await db.staff.update(
      {
        staff_name: params.staff_name,
        staff_phone: params.staff_phone,
        staff_gmail: params.staff_gmail,
        staff_dob: params.staff_dob,
        staff_type: params.staff_type,
        staff_address: params.staff_address,
      },
      {
        where: {
          staff_id: id,
        },
      }
    );
  }
  if (staff && params.staff_avatar !== undefined) {
    fs.unlink(staff.staff_avatar, (err) => {
      console.log("Xoá file 1 thành công");
    });
    await db.account.update(
      {
        username: params.username,
      },
      {
        where: {
          account_id: staff.account_id,
        },
      }
    );

    return await db.staff.update(
      {
        staff_name: params.staff_name,
        staff_phone: params.staff_phone,
        staff_gmail: params.staff_gmail,
        staff_dob: params.staff_dob,
        staff_type: params.staff_type,
        staff_address: params.staff_address,
        staff_avatar: params.staff_avatar,
      },
      {
        where: {
          staff_id: id,
        },
      }
    );
  }
}

async function _delete(id) {
  const staff = await getStaff(id);
  fs.unlink(staff.staff_avatar, (err) => {
    console.log("Xoá file thành công");
  });
  await staff.destroy();
}

// helper functions

async function getStaff(id) {
  const staff = await db.staff.findByPk(id);
  if (!staff) throw "Staff not found";
  return staff;
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
  update,
  updatePasswordAdmin,
  delete: _delete,
};

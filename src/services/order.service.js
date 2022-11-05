import { Op } from "sequelize";
import db from "../models/index";
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");

const fs = require("fs");

async function getAll(queries) {
  const start = queries.start ? parseInt(queries.start) : 1;
  const limit = queries.limit ? parseInt(queries.limit) : 10;
  const offset = start - 1;
  let checkStatus = {};
  if (queries.order_status) {
    checkStatus = { status: `${queries.order_status}` };
  }

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
        attributes: ["product_id", "detail_quantity", "detail_price"],
        include: [
          {
            model: db.product,
            attributes: ["product_name"],
            include: [
              {
                model: db.image,
                as: "images",
                attributes: ["image_name"],
              },
            ],
          },
        ],
      },
      {
        model: db.order_status,
        attributes: ["status", "createdAt", "updatedAt"],
        where: checkStatus,
      },
    ],
    distinct: true,
    order: [["order_id", "DESC"]],
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
  if (queries.customer_id) {
    checkOptions.push({
      customer_id: {
        [Op.eq]: parseInt(queries.customer_id),
      },
    });
  }
  if (queries.staff_id) {
    checkOptions.push({
      staff_id: {
        [Op.eq]: parseInt(queries.staff_id),
      },
    });
  }

  if (queries.order_id) {
    checkOptions.push({
      order_id: {
        [Op.eq]: parseInt(queries.order_id),
      },
    });
  }

  if (queries.soft_Delete) {
    checkOptions.push({
      soft_Delete: {
        [Op.eq]: queries.soft_Delete,
      },
    });
  }

  if (queries.order_total) {
    let check = [];
    if (queries.order_total === "1") {
      check = [0, 100000];
    }
    if (queries.order_total === "2") {
      check = [100000, 500000];
    }
    if (queries.order_total === "3") {
      check = [500000, 1000000];
    }
    if (queries.order_total === "4") {
      check = [1000000, 999999999];
    }
    checkOptions.push({
      order_total: {
        [Op.between]: check,
      },
    });
  }
  return checkOptions;
}

async function create(params, req) {
  const t = await db.sequelize.transaction();
  let total = 0;
  const length = params.order_detail.length;
  for (let i = 0; i < length; i++) {
    total +=
      params.order_detail[i].detail_quantity *
      params.order_detail[i].detail_price;
  }
  try {
    const transaction = { transaction: t };
    const order = await db.order.create(
      {
        customer_id: params.customer_id,
        staff_id: params.staff_id,
        address: params.address,
        order_total: params.order_total,
        order_note: params.order_note,
        order_payment: params.order_payment,
      },
      transaction
    );

    const newDetail = params.order_detail.map((obj) => {
      return { ...obj, order_id: order.order_id };
    });
    await db.order_detail.bulkCreate(newDetail, transaction);

    await db.order_status.create(
      {
        status: "Chưa xác nhận",
        order_id: order.order_id,
      },
      transaction
    );
    if (req.query.isAdmin === "false") {
      await sendMail(
        {
          order_id: order.order_id,
          ...params,
        },
        total
      );
    }
    await t.commit();
    return true;
  } catch (error) {
    console.log(error);
    await t.rollback();
    throw "Create order failed";
  }
}

async function sendMail(orderSend, total) {
  const customer = await getCustomer(orderSend.customer_id);
  const gmail = customer.customer_gmail;
  console.log(gmail)
  const infoCus = {
    id: orderSend.order_id,
    add: orderSend.address,
    phone: customer.customer_phone,
    payment: orderSend.order_payment,
    note: orderSend.order_note,
    detail: orderSend.order_detail,
  };
  const details = await Promise.all(
    infoCus.detail.map(async (detail) => {
      const product = await getProduct(detail.product_id);
      detail.order_price = detail.detail_price * detail.detail_quantity;
      return {
        ...detail,
        product_name: product.product_name,
        order_price: detail.order_price,
      };
    })
  );
  // send gamil
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nhuttramtv.vn@gmail.com",
      pass: "ripwexptqklkmaqq",
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve(__dirname, "../template"),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "../template"),
    extName: ".hbs",
  };

  mailTransporter.use("compile", hbs(handlebarOptions));

  let mailDetails = {
    from: "nhuttramtv.vn@gmail.com",
    to: gmail,
    subject: "Đơn hàng Sieu Thi Mini",
    template: "email",
    context: {
      order_id: infoCus.id,
      order_note: infoCus.note,
      order_phone: infoCus.phone,
      order_address: infoCus.add,
      order_detail: details,
      order_payment: infoCus.payment,
      order_total: total,
    },
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log(err);
      console.log("Error Occurs");
    } else {
      console.log("Email sent successfully");
    }
  });
}

async function updateStatusOrder(id, params) {
  const order = await getOrder(id);
  if (params === "Huỷ đơn") {
    await db.order.update(
      {
        soft_Delete: true,
      },
      {
        where: {
          order_id: order.order_id,
        },
      }
    );
  }
  await db.order_status.create({
    status: params.status,
    order_id: order.order_id,
  });
}

async function _delete(id) {
  const category = await getCategory(id);
  fs.unlink(category.category_img, (err) => {
    console.log("Xoá file thành công");
  });
  await category.destroy();
}

//payment
async function createPayment(req, res, net) {
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var dateFormat = require("dateformat");
  var tmnCode = "20K52K8G";
  var secretKey = "EJSNKRIBFDMAFTXULXBHTVJKRJCLLJCW";
  var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  var returnUrl = "https://localhost:5001/cart/payment";

  var date = new Date();

  var createDate = dateFormat(date, "yyyymmddHHmmss");
  var orderId = dateFormat(date, "HHmmss");
  var amount = req.body.amount;
  var bankCode = req.body.bankCode;

  var orderInfo = req.body.orderDescription;
  var orderType = req.body.orderType;
  var locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var querystring = require("qs");
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto");
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  return vnpUrl;
}
function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
// helper functions

async function getOrder(id) {
  const order = await db.order.findByPk(id);
  if (!order) throw "Order not found";
  return order;
}

async function getProduct(id) {
  const product = await db.product.findByPk(id);
  if (!product) throw "Product not found";
  return product;
}

async function getCustomer(id) {
  const customer = await db.customer.findByPk(id);
  if (!customer) throw "Customer not found";
  return customer;
}

module.exports = {
  getAll,
  create,
  sendMail,
  createPayment,
  updateStatusOrder,
  delete: _delete,
};

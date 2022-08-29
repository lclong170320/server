import db from "../models/index";

let createCategory = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.category.create({
        category_name: data.category_name,
      });
      resolve("oke db category");
    } catch (error) {
      reject(error);
    }
  });
};

let getCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let getListCategory = await db.category.findAll({
        include: [{ model: db.product }],
      });

      resolve(getListCategory);
    } catch (error) {
      reject(error);
    }
  });
};
// let getCategory = async (req, res) => {
//   try {
//     let getListCategory = await db.category.findAll({
//       include: [{ model: db.product, attributes: ["product_name"] }],
//     });
//     return res.status(200).json(getListCategory);
//   } catch (error) {
//     console.log(error);
//     return res.status(200).json({
//       error: -1,
//       errMessage: "Error from the server",
//     });
//   }
// };

let getCategoryById = (category_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let category = await db.category.findByPk(category_id);
      if (category) {
        resolve(category);
      } else {
        reject([]);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateCategory = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let update = await db.category.update(
        {
          category_name: data.category_name,
        },
        {
          where: {
            category_id: data.category_id,
          },
        }
      );
      if (update) {
        let allCategory = await db.category.findAll();
        resolve(allCategory);
      } else {
        resolve([]);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let xoaCategory1 = (category_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let xoa = await db.category.destroy({
        where: {
          category_id,
        },
      });
      if (xoa) {
        resolve("xoa thanh cong category");
      }
      resolve("xoa khong thanh cong category");
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createCategory: createCategory,
  getCategory: getCategory,
  getCategoryById: getCategoryById,
  updateCategory: updateCategory,
  xoaCategory1: xoaCategory1,
};

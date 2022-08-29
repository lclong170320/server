import db from "../models/index";
import servicesCRUD from "../services/servicesCRUD";

let getHomePage = async (req, res) => {
  try {
    let dataDB = await db.account.findAll();
    return res.render("homepage.ejs", {
      dataDB: JSON.stringify(dataDB),
    });
  } catch (error) {
    console.log(error);
  }
};

let getCrud = async (req, res) => {
  try {
    return res.render("crud.ejs");
  } catch (error) {
    console.log(error);
  }
};
let postCrud = async (req, res) => {
  let message = await servicesCRUD.createCategory(req.body);
  return res.send(message);
};

let getCategory = async (req, res) => {
  try {
    let dataDB = await servicesCRUD.getCategory();
    return res.render("crud.ejs", {
      dataDB: dataDB,
    });
    // return res.status(200).json(dataDB);
  } catch (error) {
    console.log(error);
  }
};

let suaCategory = async (req, res) => {
  let category_id = req.query.category_id;
  if (category_id) {
    let getCategory = await servicesCRUD.getCategoryById(category_id);
    return res.render("suaCategory.ejs", {
      category: getCategory,
    });
  } else {
    return res.send("khong tim thay category_id");
  }
};

let putCrud = async (req, res) => {
  try {
    let allCategory = await servicesCRUD.updateCategory(req.body);
    return res.render("crud.ejs", {
      dataDB: allCategory,
    });
  } catch (error) {
    console.log(error);
  }
};

let xoaCategory = async (req, res) => {
  try {
    let category_id = req.query.category_id;
    if (category_id) {
      let xoa = await servicesCRUD.xoaCategory1(category_id);
      return res.send(xoa);
    }
    return res.send(xoa);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getHomePage: getHomePage,
  getCrud: getCrud,
  postCrud: postCrud,
  getCategory: getCategory,
  suaCategory: suaCategory,
  putCrud: putCrud,
  xoaCategory: xoaCategory,
};

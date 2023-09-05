import product from "../controllers/product.controller.js";
import category from "../controllers/category.controller.js";
import customer from "../controllers/customer.controller.js";
import order from "../controllers/order.controller.js";
import favorite from "../controllers/favorite.controller.js";
import discount from "../controllers/discount.controller.js";
import comment from "../controllers/comment.controller.js";
import staff from "../controllers/staff.controller.js";
let initWebRouters = (app) => {
  // api routes
  app.use("/products", product);
  app.use("/categories", category);
  app.use("/customers", customer);
  app.use("/orders", order);
  app.use("/favorites", favorite);
  app.use("/discounts", discount);
  app.use("/comments", comment);
  app.use("/staffs", staff);
};

module.exports = initWebRouters;

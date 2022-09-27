import product from "../controllers/product.controller.js";
import category from "../controllers/category.controller.js";
import customer from "../controllers/customer.controller.js";
import order from "../controllers/order.controller.js";

let initWebRouters = (app) => {
  // api routes
  app.use("/product", product);
  app.use("/categories", category);
  app.use("/customer", customer);
  app.use("/order", order);
  
};

module.exports = initWebRouters;

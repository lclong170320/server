import product from "../controllers/product.controller.js";
import category from "../controllers/category.controller.js";
import customer from "../controllers/customer.controller.js";

let initWebRouters = (app) => {
  // api routes
  app.use("/products", product);
  app.use("/categories", category);
  app.use("/customers", customer);
 
};

module.exports = initWebRouters;

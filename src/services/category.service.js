import db from "../models/index";

async function getAll() {
  const category = await db.category.findAll();
  return { category };
}

async function getById(id) {
  return await getCategory(id);
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

  db.category.create({ category_name: params.category_name });
}

async function update(id, params) {
  const category = await getCategory(id);
  console.log(category);
  if (category) {
    await db.category.update(
      { category_name: params.category_name },
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
  getById,
  create,
  update,
  delete: _delete,
};

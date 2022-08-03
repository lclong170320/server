import db from '../models/index';

let createCategory = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.category.create({
                category_name: data.category_name,
            })
            resolve('oke db category');
        } catch (error) {
            reject(error)
        }
    }
    )
}

let getCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let getListCategory = await db.category.findAll();
            resolve(getListCategory);
        } catch (error) {
            reject(error)
        }

    })
}

module.exports = {
    createCategory: createCategory,
    getCategory: getCategory
}
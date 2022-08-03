import db from '../models/index';
import servicesCRUD from '../services/servicesCRUD';

let getHomePage = async (req, res) => {
    try {
        let dataDB = await db.account.findAll();
        return res.render("homepage.ejs", {
            dataDB: JSON.stringify(dataDB)
        });
    } catch (error) {
        console.log(error);

    }
}

let getCrud = async (req, res) => {
    try {
        return res.render("crud.ejs")
    } catch (error) {
        console.log(error);
    }
}
let postCrud = async (req, res) => {
    let message = await servicesCRUD.createCategory(req.body);
    return res.send(message);
};

let getCategory = async (req, res) => {
    try {
        let dataDB = await servicesCRUD.getCategory();
        return res.render("crud.ejs", {
            dataDB: dataDB
        });
    } catch (error) {
        console.log(error);

    }
}

getCategory
module.exports =
{
    getHomePage: getHomePage,
    getCrud: getCrud,
    postCrud: postCrud,
    getCategory: getCategory,
}
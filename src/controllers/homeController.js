import db from '../models/index'

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

module.exports = {
    getHomePage: getHomePage,
    getCrud: getCrud
}
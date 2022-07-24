import express from "express";

let configViewEngine = (app) => {
    app.use(express.static(__dirname + 'public'));
    app.set("view engine", "ejs");
    app.set("view", "../views")
}

module.exports = configViewEngine
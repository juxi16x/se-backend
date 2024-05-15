"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GetHandler = (req, res) => {
    res.render("index.html");
};
const exportsObject = {
    get(req, res) { GetHandler(req, res); },
    post(req, res) { console.log("Plese use get method to open this website"); }
};
module.exports = exportsObject;

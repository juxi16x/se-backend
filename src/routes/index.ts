import { SeRequest } from "../@types/Request";
import { SeResponse } from "../@types/Response";
import { RoutesExports } from "../@types/RoutesExports";

const GetHandler = (req: SeRequest, res: SeResponse) => {
    res.render("index.html");
}

const exportsObject: RoutesExports = {
    get(req: SeRequest, res: SeResponse) { GetHandler(req, res) },
    post(req: SeRequest, res: SeResponse) { console.log("Plese use get method to open this website") }
};

module.exports = exportsObject;
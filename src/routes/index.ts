import { SeRequest } from "../@types/Request";
import { SeResponse } from "../@types/Response";

const handler = (req: SeRequest, res: SeResponse) => {
    res.render("index.html");
}

module.exports = handler;
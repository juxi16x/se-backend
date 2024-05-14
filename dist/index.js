"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("fs");
dotenv_1.default.config();
const port = parseInt(String(process.env.PORT));
const server = http_1.default.createServer((req, res) => {
    res.setHeader("Content-Type", "text/html");
    let body = "";
    req.on("data", (chunk) => {
        if (chunk !== undefined) {
            body += chunk;
        }
    });
    req.on("end", () => {
        var _a, _b, _c, _d, _e;
        const url = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split("?")[0];
        const query = FormatQuery(String((_b = req.url) === null || _b === void 0 ? void 0 : _b.split("?")[1]));
        try {
            if (body != undefined && body != "")
                body = JSON.parse(body);
        }
        catch (_f) {
            console.log("Something went wrong with parsing body");
        }
        const FormatReq = {
            href: String(url),
            origin: String((_c = req.url) === null || _c === void 0 ? void 0 : _c.split("?")[0]),
            port: port,
            pathname: String((_d = req.url) === null || _d === void 0 ? void 0 : _d.split("?")[0]),
            query: query,
            body: body
        };
        const FormatRes = {
            send(data) {
                res.end(data);
            },
            end() {
                res.end();
            },
            statusCode(code) {
                res.writeHead(code);
            },
            writeHead(code, obj) {
                res.writeHead(code, obj);
            },
            setHeader(name, value) {
                res.setHeader(name, value);
            },
            render(filename) {
                fs_1.promises.readFile("./templates/" + filename).then(content => {
                    res.end(content);
                }).catch(err => {
                    res.end("404 Not Found");
                });
            },
        };
        res.setHeader("Content-Type", "text/html");
        if (url == "/") {
            try {
                require("./routes/index")(FormatReq, FormatRes);
            }
            catch (error) {
                fs_1.promises.readFile("./static/index.html").then(content => {
                    res.end(content);
                }).catch(err => {
                    res.end("404 Not Found");
                });
            }
        }
        else {
            try {
                require("./routes" + String((_e = req.url) === null || _e === void 0 ? void 0 : _e.split("?")[0]))(FormatReq, FormatRes);
            }
            catch (error) {
                fs_1.promises.readFile("./static" + url).then(content => {
                    res.end(content);
                    if (content == null) {
                        res.end("404 Not Found");
                    }
                    ;
                }).catch(err => {
                    fs_1.promises.readFile("./templates" + url).then(content => {
                        res.end(content);
                        if (content == null) {
                            res.end("404 Not Found");
                        }
                        ;
                    }).catch(err => {
                        res.end("404 Not Found");
                    });
                });
            }
        }
    });
});
const FormatQuery = (RawQuery) => {
    const Stage1Format = RawQuery.split("&");
    let Query;
    Stage1Format.forEach((element) => {
        const queryElementJSON = "{ " +
            '"' +
            element.split("=")[0] +
            '"' +
            ": " +
            '"' +
            element.split("=")[1] +
            '"' +
            " }";
        const query = Object.assign(Object.assign({}, Query), JSON.parse(queryElementJSON));
        Query = query;
    });
    return Query;
};
server.listen(port);

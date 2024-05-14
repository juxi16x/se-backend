import http from "http";
import { SeRequest } from "./@types/Request";
import { SeResponse } from "./@types/Response";
import dotenv from "dotenv";
import { promises as fs } from 'fs';

dotenv.config();

const port = parseInt(String(process.env.PORT));

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");

  let body = "";
  req.on("data", (chunk) => {
    if (chunk !== undefined) {
      body += chunk;
    }
  });

  req.on("end", () => {
    const url = req.url?.split("?")[0];
    const query = FormatQuery(String(req.url?.split("?")[1]));

    try {
      if (body != undefined && body != "") body = JSON.parse(body);
    } catch {
      console.log("Something went wrong with parsing body");
    }

    const FormatReq: SeRequest = {
      href: String(url),
      origin: String(req.url?.split("?")[0]),
      port: port,
      pathname: String(req.url?.split("?")[0]),
      query: query,
      body: body
    };

    const FormatRes: SeResponse = {
      send(data: any) {
        res.end(data);
      },
      end() {
        res.end();
      },
      statusCode(code: number) {
        res.writeHead(code);
      },
      writeHead(code, obj) {
        res.writeHead(code, obj);
      },
      setHeader(name, value) {
        res.setHeader(name, value);
      },
      render(filename: string) {
        fs.readFile("./templates/" + filename).then(content => {
          res.end(content);
        }).catch(err => {
          res.end("404 Not Found");
        });
      },
    };

    res.setHeader("Content-Type", "text/html")

    if (url == "/") {
      try {
        require("./routes/index")(FormatReq, FormatRes);
      } catch (error) {
        fs.readFile("./static/index.html").then(content => {
          res.end(content);
        }).catch(err => {
          res.end("404 Not Found");
        });
      }
    } else {
      try {
        require("./routes" + String(req.url?.split("?")[0]))(
          FormatReq,
          FormatRes
        );
      } catch (error) {
        fs.readFile("./static" + url).then(content => {
          res.end(content);
          if (content == null) {
            res.end("404 Not Found");
          };
        }).catch(err => {
          fs.readFile("./templates" + url).then(content => {
            res.end(content);
            if (content == null) {
              res.end("404 Not Found");
            };
          }).catch(err => {
            res.end("404 Not Found");
          });
        });
      }
    }
  });
});

const FormatQuery = (RawQuery: string) => {
  const Stage1Format: string[] = RawQuery.split("&");
  let Query: any;

  Stage1Format.forEach((element: string) => {
    const queryElementJSON =
      "{ " +
      '"' +
      element.split("=")[0] +
      '"' +
      ": " +
      '"' +
      element.split("=")[1] +
      '"' +
      " }";

    const query = { ...Query, ...JSON.parse(queryElementJSON) };
    Query = query;
  });

  return Query;
};

server.listen(port);

const url = require("url");
const controller = require("../controllers/person.controller");

const app = (req, res) => {
  // ?????????????????????????????
  // to json method middleware;
  res.json = (status, result) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  };

  const requestUrl = url.parse(req.url, true);
  const path = requestUrl.pathname.split("/").slice(1).join("/");

  switch (req.method) {
    case "GET":
      {
        switch (path) {
          case "":
            {
              res.json(200, {
                message: "It's a simple CRUD API from Task 3 of NodeJS course",
              });
            }
            break;

          case "person":
            // {
            //   res.json(200, {
            //     message: "It's a simple CRUD API from Task 3 of NodeJS course",
            //   });
            // }
            controller.getAllPersons(req, res);
            break;

          // case `person/${path[1]}`:
          //   getPerson(req, res, path[1]);
          //   break;
          default: {
            res.json(404, { error: "Page Not Found" });
          }
        }
      }
      break;
    // case "POST":
    //   {
    //     switch (root) {
    //       case "books":
    //         {
    //           addBook(req, res);
    //         }
    //         break;
    //       default: {
    //         res.json(501, "Internal Server Error");
    //       }
    //     }
    //   }
    //   break;
    // case "PATCH":
    //   {
    //     switch (root) {
    //       case `books/${path[1]}`:
    //         {
    //           updateBook(req, res, path[1]);
    //         }
    //         break;
    //       default: {
    //         res.json(501, "Internal Server Error");
    //       }
    //     }
    //   }
    //   break;
    // case "DELETE":
    //   {
    //     switch (root) {
    //       case `books/${path[1]}`:
    //         {
    //           deleteBook(req, res, path[1]);
    //         }
    //         break;
    //       default: {
    //         res.json(500, "Internal Server Error");
    //       }
    //     }
    //   }

    //   break;
    default: {
      res.json(404, { error: "Error 404 not found" });
    }
  }
};

module.exports = app;

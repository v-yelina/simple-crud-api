const http = require("http");
const process = require("process");
const { getAllPersons } = require("./src/controllers/person.controller");
require("dotenv").config();

const host = "localhost";
const PORT = process.env.PORT;

// getAllPersons();

const routes = require("./src/routes/person.routes");
// const server = http.createServer(routes);

// const requestListener = async (req, res) => {
//   //set the request route
//   if (req.url === "/person" && req.method === "GET") {
//     //response headers
//     const persons = await getAllPersons();
//     res.writeHead(200, { "Content-Type": "application/json" });
//     //set the response
//     res.write(persons);
//     //end the response
//     res.end(JSON.stringify(persons));
//   }

//   // If no route present
//   else {
//     res.writeHead(404, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ message: "Route not found" }));
//   }
// };

const server = http.createServer(routes);
server.listen(PORT, host, () => {
  console.log(`Server is running on http://${host}:${PORT}`);
});

const http = require("http");
const process = require("process");
require("dotenv").config();

const host = "localhost";
const PORT = process.env.PORT || 4000;

const routes = require("./src/routes/person.routes");

const server = http.createServer(routes);
server.listen(PORT, host, () => {
  console.log(`Server is running on http://${host}:${PORT}`);
});

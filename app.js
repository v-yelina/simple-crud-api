const http = require("http");
const process = require("process");
require("dotenv").config();

const host = "localhost";
const PORT = process.env.PORT;

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("It works!");
};

const server = http.createServer(requestListener);
server.listen(PORT, host, () => {
  console.log(`Server is running on http://${host}:${PORT}`);
});

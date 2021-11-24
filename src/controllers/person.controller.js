const fs = require("fs");

exports.getAllPersons = (req, res) => {
  fs.readFile(`${__dirname}/db.json`, "utf8", function (err, data) {
    if (err) throw err;
    try {
      res.end(data);
    } catch (err) {
      res.json(500, { error: "Internal Server Error" });
    }
  });
};

// const getPerson = () => {};

// const postPerson = () => {};

// const putPerson = () => {};

// const deletePerson = () => {};

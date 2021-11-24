const fs = require("fs");
const uuid = require("uuid");

exports.getAllPersons = (req, res) => {
  let persons;
  fs.readFile(`${__dirname}/db.json`, "utf8", function (err, data) {
    if (err) throw err;
    try {
      //   console.log("all:" + data);
      res.end(data);
    } catch (err) {
      res.json(500, { error: "Internal Server Error" });
      console.log(err);
    }
  });
};

exports.getPerson = (req, res, personID) => {
  let persons;
  let person;
  fs.readFile(`${__dirname}/db.json`, "utf8", function (err, data) {
    if (err) throw err;
    try {
      persons = JSON.parse(data);
      //   console.log("1:" + typeof persons);
      //   console.log("1:" + persons);
      person = persons.find((item) => item.id === personID);
      //   console.log(person);
      res.end(JSON.stringify(person));
    } catch (err) {
      res.json(500, { error: "Internal Server Error" });
      console.log(err);
    }
  });
};

exports.postPerson = (req, res) => {
  let newPerson;
  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));

  req.on("end", () => {
    const data = Buffer.concat(chunks).toString();
    newPerson = JSON.parse(data);
    newPerson.id = uuid.v4();
    // console.log(newPerson);
    res.end();
  });
  let persons;
  fs.readFile(`${__dirname}/db.json`, "utf8", function (err, data) {
    if (err) throw err;
    try {
      //   console.log(data);
      persons = JSON.parse(data);
      //   console.log(persons);
      persons.push(newPerson);
      fs.writeFile(
        `${__dirname}/db.json`,
        JSON.stringify(persons),
        function (err, data) {
          if (err) throw err;
        }
      );
      res.end();
    } catch (err) {
      res.json(500, { error: "Internal Server Error" });
      console.log(err);
    }
  });
};

// const putPerson = (req, res, personID) => {};

// const deletePerson = (req, res, personID) => {};

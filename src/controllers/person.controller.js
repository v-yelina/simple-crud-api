const fs = require("fs");
const uuid = require("uuid");

exports.getAllPersons = (req, res) => {
  fs.readFile(`${__dirname}/db.json`, "utf8", function (err, data) {
    if (err) throw err;
    try {
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
      person = persons.find((item) => item.id === personID);
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
    res.end();
  });
  let persons;
  fs.readFile(`${__dirname}/db.json`, "utf8", function (err, data) {
    if (err) throw err;
    try {
      persons = JSON.parse(data);
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

exports.putPerson = (req, res, personID) => {
  let newOptions;
  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));

  req.on("end", () => {
    const data = Buffer.concat(chunks).toString();
    newOptions = JSON.parse(data);
    console.log(newOptions);
    let persons;
    let newPersons = [];
    fs.readFile(`${__dirname}/db.json`, "utf8", function (err, data) {
      if (err) throw err;
      try {
        persons = JSON.parse(data);
        persons.map((item) => {
          if (item.id === personID) {
            item = { id: personID, ...newOptions };
          }
          newPersons.push(item);
        });
        fs.writeFile(
          `${__dirname}/db.json`,
          JSON.stringify(newPersons),
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
    res.end();
  });
};

exports.deletePerson = (req, res, personID) => {
  let persons;
  let newPersons = [];
  fs.readFile(`${__dirname}/db.json`, "utf8", function (err, data) {
    if (err) throw err;
    try {
      persons = JSON.parse(data);
      persons.map((item) => {
        if (item.id !== personID) {
          newPersons.push(item);
        }
      });
      fs.writeFile(
        `${__dirname}/db.json`,
        JSON.stringify(newPersons),
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

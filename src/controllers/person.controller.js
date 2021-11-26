const fs = require("fs");
const uuid = require("uuid");

// Check uuid
const checkUUID = (personID) => {
  const regexUUID =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexUUID.test(personID);
};

// Check if all required field existing
const checkRequiredFields = (person) => {
  const requiredFields = ["id", "name", "age", "hobbies"].sort();
  const newPersonKeys = Object.keys(person).sort();
  const areEqual =
    requiredFields.length == newPersonKeys.length &&
    requiredFields.every(function (element, index) {
      return element === newPersonKeys[index];
    });
  return areEqual;
};

// Get all persons
exports.getAllPersons = (req, res) => {
  fs.readFile(`${__dirname}/db.json`, "utf8", function (err, data) {
    if (err) throw err;
    try {
      res.json(200, JSON.parse(data));
    } catch (err) {
      console.log(err);
      res.json(500, { Error: "Internal Server Error" });
    }
  });
};

// Get one person by id
exports.getPerson = (req, res, personID) => {
  if (!checkUUID(personID)) {
    res.json(400, { Error: "Person id is invalid" });
  }

  let persons;
  let person;
  fs.readFile(`${__dirname}/db.json`, "utf8", function (err, data) {
    if (err) throw err;
    try {
      persons = JSON.parse(data);
      person = persons.find((item) => item.id === personID);
      if (!person) {
        res.json(404, { Error: "There isn't a person with such id" });
      }
      res.json(200, person);
    } catch (err) {
      console.log(err);
      res.json(500, { error: "Internal Server Error" });
    }
  });
};

// Post new person
exports.postPerson = (req, res) => {
  // Get data and create object with new peson
  let newPerson;
  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    const data = Buffer.concat(chunks).toString();
    newPerson = JSON.parse(data);
    newPerson.id = uuid.v4();

    if (!checkRequiredFields(newPerson)) {
      return res.json(400, {
        Error: "Some fields are missed. Required fields: name, age, hobbies",
      });
    }

    // Get array of all persons, add new person to it, write new array in a file
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

    res.json(201, newPerson);
  });
};

// Put changes in a person
exports.putPerson = (req, res, personID) => {
  if (!checkUUID(personID)) {
    res.json(400, { Error: "Person id is invalid" });
  }

  // Get new options and create changed person object
  let newOptions;
  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));

  req.on("end", () => {
    const data = Buffer.concat(chunks).toString();
    newOptions = JSON.parse(data);
    let updatedPerson;
    let persons;
    let newPersons = [];
    // Read array with all persons
    fs.readFile(`${__dirname}/db.json`, "utf8", function (err, data) {
      if (err) throw err;
      try {
        persons = JSON.parse(data);
        const person = persons.find((item) => item.id === personID);
        if (!person) {
          res.json(404, { Error: "There isn't a person with such id" });
        }
        persons.map((item) => {
          if (item.id === personID) {
            item = { id: personID, ...newOptions };
            updatedPerson = item;
            if (!checkRequiredFields(updatedPerson)) {
              res.json(400, {
                Error:
                  "Some fields are missed. Required fields: name, age, hobbies",
              });
            }
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

        res.json(200, updatedPerson);
        res.end();
      } catch (err) {
        res.json(500, { error: "Internal Server Error" });
        console.log(err);
      }
    });
  });
};

exports.deletePerson = (req, res, personID) => {
  if (!checkUUID(personID)) {
    res.json(400, { Error: "Person id is invalid" });
  }
  let persons;
  let newPersons = [];
  fs.readFile(`${__dirname}/db.json`, "utf8", function (err, data) {
    if (err) throw err;
    try {
      persons = JSON.parse(data);
      const person = persons.find((item) => item.id === personID);
      if (!person) {
        return res.json(404, { Error: "There isn't a person with such id" });
      }
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
      res.json(204, {});
      res.end();
    } catch (err) {
      res.json(500, { error: "Internal Server Error" });
      console.log(err);
    }
  });
};

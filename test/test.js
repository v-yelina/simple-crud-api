const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();
const uuid = require("uuid");

const testPerson = {
  name: "Mike",
  age: 2,
  hobbies: ["reading", "singing"],
};

const updateTestPerson = {
  name: "Kris",
  age: 28,
  hobbies: ["reading", "singing"],
};

let personWithoutHobbies = {
  name: "Kris",
  age: 28,
};

chai.use(chaiHttp);

describe("1 test suite", () => {
  // 1. Get all persons
  // 2. Create new person
  // 3. Get person by ID
  // 4. Update person with given ID
  // 5. Delete person with given ID
  // 6. Get deleted person

  let personID;

  it("it should GET all the persons", (done) => {
    chai
      .request(server)
      .get("/person")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(0);
        done();
      });
  });

  it("it should POST the person", (done) => {
    chai
      .request(server)
      .post("/person")
      .send(testPerson)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("id");
        res.body.should.have.property("name");
        res.body.should.have.property("age");
        res.body.should.have.property("hobbies");
        done();
      });
  });

  it("it should GET person by ID", (done) => {
    chai
      .request(server)
      .get("/person")
      .end((err, res) => {
        personID = res.body[0].id;
        chai
          .request(server)
          .get("/person/" + personID)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.id.should.be.eql(personID);
            done();
          });
      });
  });

  it("it should update person with given ID", (done) => {
    chai
      .request(server)
      .put("/person/" + personID)
      .send(updateTestPerson)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.id.should.be.eql(personID);
        res.body.should.have.property("name").eql(updateTestPerson.name);
        res.body.should.have.property("age").eql(updateTestPerson.age);
        done();
      });
  });

  it("it should delete person with given ID", (done) => {
    chai
      .request(server)
      .delete("/person/" + personID)
      .end((err, res) => {
        res.should.have.status(204);
        res.should.have.property("ok").eql(true);
        res.body.should.be.a("string");
        res.body.length.should.be.eql(0);
        done();
      });
  });

  it("it should return error message after trying to get deleted person", (done) => {
    chai
      .request(server)
      .get("/person")
      .end((err, res) => {
        chai
          .request(server)
          .get("/person/" + personID)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be
              .a("object")
              .eql({ Error: "There isn't a person with such id" });
            done();
          });
      });
  });
});

describe("2 test suite", () => {
  // 1. Get all persons
  // 2. Create new person
  // 3. Get person by ID
  // 4. Update person with not all required fields
  // 5. Get person by ID, check, that fields was not changed
  // 6. Delete person with given ID

  let personID;

  it("it should GET all the persons", (done) => {
    chai
      .request(server)
      .get("/person")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(0);
        done();
      });
  });

  it("it should POST the person", (done) => {
    chai
      .request(server)
      .post("/person")
      .send(testPerson)
      .end((err, res) => {
        res.should.have.status(201);
        should.exist(res.body);
        res.body.should.be.a("object");
        res.body.should.have.property("id");
        res.body.should.have.property("name");
        res.body.should.have.property("age");
        res.body.should.have.property("hobbies");
        done();
      });
  });

  it("it should GET person by ID", (done) => {
    chai
      .request(server)
      .get("/person")
      .end((err, res) => {
        personID = res.body[0].id;
        chai
          .request(server)
          .get("/person/" + personID)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.id.should.be.eql(personID);
            done();
          });
      });
  });

  it("it should show an error with status 400 when updating person without all required fields", (done) => {
    chai
      .request(server)
      .put("/person/" + personID)
      .send(personWithoutHobbies)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object").eql({
          Error: "Some fields are missed. Required fields: name, age, hobbies",
        });
        done();
      });
  });

  it("The person should remain unchanged", (done) => {
    chai
      .request(server)
      .get("/person")
      .end((err, res) => {
        personID = res.body[0].id;
        chai
          .request(server)
          .get("/person/" + personID)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.id.should.be.eql(personID);
            res.body.should.have.property("name").eql(testPerson.name);
            res.body.should.have.property("age").eql(testPerson.age);
            res.body.should.have.property("hobbies").eql(testPerson.hobbies);
            done();
          });
      });
  });

  it("it should delete person with given ID", (done) => {
    chai
      .request(server)
      .delete("/person/" + personID)
      .end((err, res) => {
        res.should.have.status(204);
        res.should.have.property("ok").eql(true);
        res.body.should.be.a("string");
        res.body.length.should.be.eql(0);
        done();
      });
  });
});

describe("3 test suite", () => {
  // 1. Get all persons
  // 2. Try to create new person with not all required fields
  // 3. Check that person wasn't added
  // 4. Add person with all required fields
  // 5. Get person by ID with invalid id (not uuid)
  // 6. Get person by ID that not exists
  // 7. Get person by ID (valid)
  // 8. Delete person with given ID

  let personID;
  const testId = uuid.v4();

  it("it should GET all the persons", (done) => {
    chai
      .request(server)
      .get("/person")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(0);
        done();
      });
  });

  it("it shouldn't POST the person without all required fields", (done) => {
    chai
      .request(server)
      .post("/person")
      .send(personWithoutHobbies)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object").eql({
          Error: "Some fields are missed. Required fields: name, age, hobbies",
        });
        done();
      });
  });

  it("Array of persons should still be empty", (done) => {
    chai
      .request(server)
      .get("/person")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(0);
        done();
      });
  });

  it("it should POST the person", (done) => {
    chai
      .request(server)
      .post("/person")
      .send(testPerson)
      .end((err, res) => {
        res.should.have.status(201);
        should.exist(res.body);
        res.body.should.be.a("object");
        res.body.should.have.property("id");
        res.body.should.have.property("name");
        res.body.should.have.property("age");
        res.body.should.have.property("hobbies");
        done();
      });
  });

  it("it should show an error and status code should be 400 when id is invalid", (done) => {
    chai
      .request(server)
      .get("/person")
      .end((err, res) => {
        chai
          .request(server)
          .get("/person/" + 123)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object").eql({
              Error: "Person id is invalid",
            });
            done();
          });
      });
  });

  it("it should show an error and status code should be 404 when person with given id not found", (done) => {
    chai
      .request(server)
      .get("/person")
      .end((err, res) => {
        chai
          .request(server)
          .get("/person/" + testId)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a("object").eql({
              Error: "There isn't a person with such id",
            });
            done();
          });
      });
  });

  it("it should GET person by ID", (done) => {
    chai
      .request(server)
      .get("/person")
      .end((err, res) => {
        personID = res.body[0].id;
        chai
          .request(server)
          .get("/person/" + personID)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.id.should.be.eql(personID);
            done();
          });
      });
  });

  it("it should delete person with given ID", (done) => {
    chai
      .request(server)
      .delete("/person/" + personID)
      .end((err, res) => {
        res.should.have.status(204);
        res.should.have.property("ok").eql(true);
        res.body.should.be.a("string");
        res.body.length.should.be.eql(0);
        done();
      });
  });
});

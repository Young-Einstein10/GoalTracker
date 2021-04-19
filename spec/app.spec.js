var request = require("supertest");
import app from "../app";
import * as DB from "../test_db";

describe("User can", () => {
  beforeAll(() => {
    // DB.dropAllTables();
    DB.createSchema();
    DB.createAllTables();
  });

  afterAll(() => {
    DB.dropAllTables();
  });

  describe("POST api/v1/users/signin", () => {
    it("should return a 200 success when user logs in with correct email and password", async () => {
      const user = {
        email: "john@gmail.com",
        password: "123456",
      };
      const res = await request(app).post("/api/v1/users/signin").send(user);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(jasmine.objectContaining({ status: "success" }));
    });
  });

  describe("GET /", () => {
    it("should return a 200 response for getting a single gif", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        jasmine.objectContaining({
          info: "Goal Tracker is live and running 🎉🎉🎉",
        })
      );
    });
  });
});

function tellJasmine(done) {
  return function (err) {
    if (err) {
      done.fail(err);
    } else {
      done();
    }
  };
}

// describe("GET /", function () {
//   it("should return a 200 response and info object", function (done) {
//     request(app)
//       .get("/")
//       .set("Accept", "application/json")
//       .expect("Content-Type", /json/)
//       .expect(200)
//       .end(tellJasmine(done));
//   });
// });

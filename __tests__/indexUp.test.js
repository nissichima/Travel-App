const app = require("../src/server/index");
const supertest = require("supertest");
const request = supertest(app);

describe("get the endpoints right", () => {
  it("returns an html file", async (done) => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
    done();
  });
});
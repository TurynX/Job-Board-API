import { buildApp } from "../app";

describe("Auth", () => {
  const app = buildApp();
  const email = `user-${Date.now()}@example.com`;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should register a new user", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        email,
        password: "password",
        role: "CANDIDATE",
      },
    });

    expect(response.statusCode).toBe(201);
  });

  it("should login a user", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email,
        password: "password",
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body).toHaveProperty("data.token");
  });
});

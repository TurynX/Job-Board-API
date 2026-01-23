import { buildApp } from "../app";

describe("Admin", () => {
  const app = buildApp();
  let adminToken: string;
  beforeAll(async () => {
    await app.ready();

    const registerAdmin = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        email: "admin@gmail.com",
        password: "123456",
        role: "ADMIN",
      },
    });

    const login = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: "admin@gmail.com",
        password: "123456",
      },
    });
    const data = login.json();
    adminToken = data.data.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return statistics successfully", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/admin/stats",
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.stats).toHaveProperty("users");
    expect(body.stats).toHaveProperty("jobs");
    expect(body.stats).toHaveProperty("companies");
    expect(body.stats).toHaveProperty("applications");
  });
});

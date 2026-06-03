import { buildApp } from "../app";

describe("Jobs", () => {
  const companyEmail = `company${Date.now()}@gmail.com`;
  const app = buildApp();
  let companyToken: string;
  beforeAll(async () => {
    await app.ready();
    const registerCompany = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        role: "COMPANY",
        email: companyEmail,
        password: "123456",
        companyName: "Company 2",
        companyWebsite: "https://company2.com",
        companyDescription: "Description 2",
      },
    });

    const loginCompany = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: companyEmail,
        password: "123456",
      },
    });
    const body = loginCompany.json();
    console.log(body);

    companyToken = body.data.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create a new job", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/jobs",
      payload: {
        title: "Test Job",
        description: "Test Job Description",
        location: "Test Location",
        salary: 1000,
        category: "Test Category",
        experienceLevel: "Test Experience",
      },
      headers: {
        authorization: `Bearer ${companyToken}`,
      },
    });
    expect(response.statusCode).toBe(201);
    console.log(companyToken);
  });
});

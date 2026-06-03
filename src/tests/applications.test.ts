import { buildApp } from "../app";

describe("Applications", () => {
  const app = buildApp();
  const candidateEmail = `candidate-${Date.now()}@example.com`;
  const companyEmail = `company-${Date.now()}@example.com`;
  let candidateToken: string;
  let companyToken: string;
  let jobId!: string;

  beforeAll(async () => {
    await app.ready();

    const registerCandidate = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        email: candidateEmail,
        password: "123456",
        role: "CANDIDATE",
      },
    });

    const candidateLogin = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: candidateEmail,
        password: "123456",
      },
    });

    const candidateBody = candidateLogin.json();

    candidateToken = candidateBody.data.token;

    const registerCompany = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        role: "COMPANY",
        email: companyEmail,
        password: "123456",
        companyName: "Company 1",
        companyWebsite: "https://company1.com",
        companyDescription: "Description 1",
      },
    });

    const companyLogin = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: companyEmail,
        password: "123456",
      },
    });
    const companyBody = companyLogin.json();

    companyToken = companyBody.data.token;

    const createJob = await app.inject({
      method: "POST",
      url: "/api/jobs",
      headers: {
        authorization: `Bearer ${companyToken}`,
      },
      payload: {
        title: "Job 1",
        description: "Description 1",
        location: "Location 1",
        salary: 1000,
        category: "Category 1",
        experienceLevel: "Experience Level 1",
      },
    });

    const jobBody = createJob.json();

    jobId = jobBody.job.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it("should apply to a job successfully", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/api/jobs/${jobId}/apply`,
      payload: {
        cvUrl: "http://localhost:5555/",
      },
      headers: {
        authorization: `Bearer ${candidateToken}`,
      },
    });

    expect(response.statusCode).toBe(201);
  });
});

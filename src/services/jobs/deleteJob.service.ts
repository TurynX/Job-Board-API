import redis from "../../lib/redis";
import { prisma } from "../../lib/db";

export async function deleteJobService(jobId: string, auth0Id: string) {
  const job = await prisma.jobs.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new Error("Job not found");
  }

  const user = await prisma.users.findUnique({ where: { auth0Id } });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "ADMIN") {
    return await prisma.jobs.delete({ where: { id: jobId } });
  }

  const company = await prisma.companies.findUnique({
    where: { userId: user.id },
  });
  if (!company) {
    throw new Error("You are not a company");
  }

  if (job.companyId !== company.id) {
    throw new Error("You are not owner of this job");
  }

  await redis.del("jobs");

  return await prisma.jobs.delete({ where: { id: jobId } });
}

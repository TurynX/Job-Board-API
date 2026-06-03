import redis from "../../lib/redis";
import { prisma } from "../../lib/db";
import { JobInput } from "../../utils/schema";
import { JobStatus } from "@prisma/client";

export async function createJobService(auth0Id: string, jobData: JobInput) {
  const user = await prisma.users.findUnique({
    where: { auth0Id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const company = await prisma.companies.findUnique({
    where: { userId: user.id },
  });

  if (!company) {
    throw new Error("You are not a company");
  }

  if (company.isApproved === false) {
    throw new Error("Your company is not approved yet");
  }

  await redis.del("jobs");

  return await prisma.jobs.create({
    data: {
      ...jobData,
      companyId: company.id,
      companyName: company.name,
      status: JobStatus.OPEN,
    },
  });
}

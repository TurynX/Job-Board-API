import { prisma } from "../../lib/db";
import { ApplyJobInput } from "../../utils/schema";

export async function applyJobService(
  jobId: string,
  auth0Id: string,
  jobData: ApplyJobInput,
) {
  const job = await prisma.jobs.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new Error("Job not found");
  }

  const user = await prisma.users.findUnique({ where: { auth0Id } });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "COMPANY") {
    throw new Error("Company can't apply for jobs");
  }

  const existingApplication = await prisma.applications.findFirst({
    where: {
      jobId,
      candidateId: user.id,
    },
  });

  if (existingApplication) {
    throw new Error("You already applied for this job");
  }

  const newApplication = await prisma.applications.create({
    data: {
      ...jobData,
      jobId,
      candidateId: user.id,
      status: "APPLIED",
    },
  });

  return newApplication;
}

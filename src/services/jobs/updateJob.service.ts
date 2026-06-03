import redis from "../../lib/redis";
import { prisma } from "../../lib/db";
import { UpdateJobInput } from "../../utils/schema";

export async function updateJobService(
  jobId: string,
  auth0Id: string,
  jobData: UpdateJobInput,
) {
  const job = await prisma.jobs.findUnique({
    where: { id: jobId },
    include: { company: true },
  });
  if (!job) {
    throw new Error("Job not found");
  }

  const user = await prisma.users.findUnique({ where: { auth0Id } });

  if (!user) {
    throw new Error("User not found");
  }

  if (job.company.userId !== user.id) {
    throw new Error("You are not owner of this job");
  }

  await redis.del("jobs");

  return await prisma.jobs.update({
    where: { id: jobId },
    data: { ...jobData, status: jobData.status },
  });
}

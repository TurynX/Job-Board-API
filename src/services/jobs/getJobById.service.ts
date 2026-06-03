import redis from "../../lib/redis";
import { prisma } from "../../lib/db";

export async function getJobByIdService(id: string) {
  const cachedJob = await redis.get(`job:${id}`);
  if (cachedJob) {
    return JSON.parse(cachedJob);
  }
  const job = await prisma.jobs.findUnique({ where: { id } });
  if (!job) {
    throw new Error("Job not found");
  }
  await redis.set(`job:${id}`, JSON.stringify(job));

  return job;
}

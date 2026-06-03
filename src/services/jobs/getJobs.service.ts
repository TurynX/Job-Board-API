import redis from "../../lib/redis";
import { prisma } from "../../lib/db";

export async function getJobsService() {
  const cachedJobs = await redis.get("jobs");
  if (cachedJobs) {
    return JSON.parse(cachedJobs);
  }
  const jobs = await prisma.jobs.findMany();
  await redis.set("jobs", JSON.stringify(jobs));
  return jobs;
}

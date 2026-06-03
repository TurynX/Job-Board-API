import { prisma } from "../../lib/db";

export async function adminStatsService(auth0Id: string) {
  const user = await prisma.users.findUnique({ where: { auth0Id } });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Not admin");
  }

  const stats = await prisma.$transaction([
    prisma.users.count(),
    prisma.jobs.count(),
    prisma.jobs.count({ where: { status: "OPEN" } }),
    prisma.applications.count(),
    prisma.applications.count({ where: { status: "APPLIED" } }),
    prisma.companies.count(),
    prisma.companies.count({ where: { isApproved: true } }),
  ]);
  return {
    users: stats[0],
    jobs: stats[1],
    openJobs: stats[2],
    applications: stats[3],
    appliedApplications: stats[4],
    companies: stats[5],
    approvedCompanies: stats[6],
  };
}

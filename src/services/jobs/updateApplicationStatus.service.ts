import { prisma } from "../../lib/db";
import { ApplicationStatus } from "@prisma/client";

export async function updateApplicationStatusService(
  applicationId: string,
  auth0Id: string,
  status: ApplicationStatus,
) {
  const application = await prisma.applications.findUnique({
    where: { id: applicationId },
    include: { job: { include: { company: { include: { user: true } } } } },
  });
  if (!application) {
    throw new Error("Application not found");
  }

  const user = await prisma.users.findUnique({ where: { auth0Id } });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "CANDIDATE") {
    throw new Error("Only companies can update application status");
  }

  if (application.job.company.user.id !== user.id) {
    throw new Error("You are not the owner of this job");
  }

  return await prisma.applications.update({
    where: { id: applicationId },
    data: { status },
  });
}

import { prisma } from "../../lib/db";

export async function getApplicationsService(auth0Id: string) {
  const user = await prisma.users.findUnique({ where: { auth0Id } });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "CANDIDATE") {
    const applications = await prisma.applications.findMany({
      where: { candidateId: user.id },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });
    if (applications.length === 0) {
      throw new Error("Applications not found");
    }

    return applications;
  }

  if (user.role === "COMPANY") {
    const company = await prisma.companies.findUnique({
      where: { userId: user.id },
    });
    if (!company) {
      throw new Error("Company not found");
    }

    const applications = await prisma.applications.findMany({
      where: {
        job: {
          companyId: company.id,
        },
      },
      include: {
        job: true,
        candidate: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });
    if (applications.length === 0) {
      throw new Error("Applications not found");
    }

    return applications;
  }

  if (user.role === "ADMIN") {
    const applications = await prisma.applications.findMany({
      include: {
        job: true,
        candidate: true,
      },
      orderBy: { appliedAt: "desc" },
    });
    if (applications.length === 0) {
      throw new Error("Applications not found");
    }

    return applications;
  }
}

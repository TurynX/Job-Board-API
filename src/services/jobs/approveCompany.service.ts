import { prisma } from "../../lib/db";

export async function approveCompanyService(id: string, auth0Id: string) {
  const company = await prisma.companies.findUnique({ where: { id } });
  if (!company) {
    throw new Error("Company not found");
  }

  if (company.isApproved) {
    throw new Error("Company already approved");
  }

  const user = await prisma.users.findUnique({ where: { auth0Id } });
  if (!user || user.role !== "ADMIN") {
    throw new Error("Not admin");
  }

  return await prisma.companies.update({
    where: { id },
    data: { isApproved: true },
  });
}

import { prisma } from "../../lib/db";

import {
  assignAuth0RoleToUser,
  createAuth0User,
  getManagementToken,
} from "./auth0Management";

export async function registerService(input: any) {
  const {
    email,
    password,
    role,
    companyName,
    companyWebsite,
    companyDescription,
  } = input;

  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  if (role === "COMPANY") {
    const existingCompany = await prisma.companies.findFirst({
      where: { name: companyName },
    });

    if (existingCompany) {
      throw new Error("Company already exists");
    }
  }

  const managementToken = await getManagementToken();

  try {
    const auth0User = await createAuth0User(
      email,
      password,
      role,
      managementToken,
    );

    await assignAuth0RoleToUser(auth0User.user_id, role, managementToken);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          email,
          auth0Id: auth0User.user_id,
          role,
        },
        select: { id: true, email: true, role: true, auth0Id: true },
      });

      let company = null;

      if (role === "COMPANY") {
        company = await tx.companies.create({
          data: {
            userId: user.id,
            name: companyName,
            website: companyWebsite,
            description: companyDescription,
            isApproved: true,
          },
        });
      }

      return { user, company };
    });
  } catch (error: any) {
    //console.log("Auth0 error:", error.response?.data); // ← add this
    throw error;
  }
}

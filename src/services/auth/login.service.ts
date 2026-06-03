import { prisma } from "../../lib/db";
import { authenticateWithAuth0 } from "./auth0Management";

export async function loginService(email: string, password: string) {
  const tokenResponse = await authenticateWithAuth0(email, password);

  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      auth0Id: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
  };
}

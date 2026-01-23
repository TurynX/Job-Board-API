import { prisma } from "../lib/db";
import { comparePassword, hashPassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import {
  CompanyExistsError,
  InvalidCredentialsError,
  UserExistsError,
  UserNotFoundError,
} from "../utils/error";

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
    throw new UserExistsError();
  }

  if (role === "COMPANY") {
    const existingCompany = await prisma.companies.findFirst({
      where: { name: companyName },
    });

    if (existingCompany) {
      throw new CompanyExistsError();
    }
  }

  const hashedPassword = await hashPassword(password);
  if (!hashedPassword) {
    throw new InvalidCredentialsError();
  }

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.users.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
      select: { id: true, email: true, role: true },
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

  return {
    message:
      role === "COMPANY"
        ? "Company account created. Pending admin approval."
        : "User registered successfully",
    user: result.user,
    company: result.company
      ? {
          id: result.company.id,
          name: result.company.name,
          isApproved: result.company.isApproved,
        }
      : undefined,
  };
}

export async function loginService(email: string, password: string) {
  const user = await prisma.users.findUnique({
    where: { email },
  });
  if (!user) {
    throw new UserNotFoundError();
  }

  const isPasswordValid = comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  };
}

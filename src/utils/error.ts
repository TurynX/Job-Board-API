import {createError} from "@fastify/error"


export const UserExistsError = createError("UserExistsError", "User already exists", 409);

export const UserNotFoundError = createError("UserNotFoundError", "User not found", 404);

export const InvalidCredentialsError = createError("InvalidCredentialsError", "Invalid credentials", 401);

export const JobNotFoundError = createError("JobNotFoundError", "Job not found", 404);

export const CompanyOnlyError = createError("CompanyOnlyError", "Company only", 403);

export const CompanyExistsError = createError("CompanyExistsError", "Company already exists", 409);

export const CandidateOnlyError = createError("CandidateOnlyError", "Candidate only", 403);

export const AlreadyAppliedError = createError("AlreadyAppliedError", "Already applied", 409);

export const ApplicationNotFoundError = createError("ApplicationNotFoundError", "Application not found", 404);

export const NotOwnerError = createError("NotOwnerError", "You are not the owner", 403);

export const CompanyNotApprovedError = createError("CompanyNotApprovedError", "Company not approved", 403);

export const CompanyNotFoundError = createError("CompanyNotFoundError", "Company not found", 404);

export const NotAdminError = createError("NotAdminError", "You are not the admin", 403);

export const CompanyAlreadyApprovedError = createError("CompanyAlreadyApprovedError", "Company already approved", 409);



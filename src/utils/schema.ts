import z from "zod";
import { ApplicationStatus } from "@prisma/client";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const registerSchema = z.discriminatedUnion('role', [
  z.object({
    role: z.literal('CANDIDATE'),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  
    z.object({
    role: z.literal('COMPANY'),
    email: z.string().email(),
    password: z.string().min(6),
    companyName: z.string().min(3).max(100),
    companyWebsite: z.string().url(),
    companyDescription: z.string().min(3).max(500).optional(),
  }),
]);

export const jobSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(100),
  location: z.string().min(3).max(100),
  salary: z.number().min(0),
  category: z.string().min(3).max(100),
  experienceLevel: z.string().min(3).max(100),
}); 

export const updateJobSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(3).max(100).optional(),
  location: z.string().min(3).max(100).optional(),
  salary: z.number().min(0).optional(),
  category: z.string().min(3).max(100).optional(),
  experienceLevel: z.string().min(3).max(100).optional(),
  status: z.enum(["OPEN","CLOSED"]).optional(),
});

export const applyJobSchema = z.object({
  cvUrl: z.string().url(),  
}); 

export const updateApplicationSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
});

export type JobInput = z.infer<typeof jobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type ApplyJobInput = z.infer<typeof applyJobSchema>;
  

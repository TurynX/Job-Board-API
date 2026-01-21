import { prisma } from "../lib/db";
import { AlreadyAppliedError, ApplicationNotFoundError, CandidateOnlyError, CompanyAlreadyApprovedError, CompanyNotApprovedError, CompanyNotFoundError, CompanyOnlyError, JobNotFoundError, NotAdminError, NotOwnerError, UserNotFoundError } from "../utils/error";
import { ApplyJobInput, JobInput, UpdateJobInput } from "../utils/schema";
import { ApplicationStatus, JobStatus } from "@prisma/client";


export async function getJobsService() {
    return await prisma.jobs.findMany(); 
}
export async function getJobByIdService(id:string) {
    const job =  await prisma.jobs.findUnique({where:{id}}); 
    if(!job) {
        throw new JobNotFoundError();
    }

    return job
}

export async function createJobService(userId: string, jobData: JobInput) {
    const company = await prisma.companies.findUnique({
        where: { userId },
    });

    if (!company) {
         throw new CompanyNotFoundError();   
    }
   
    if(company.isApproved === false) {
        throw new CompanyNotApprovedError();
    }

    return await prisma.jobs.create({ 
       data: {
    ...jobData,
    companyId: company.id,
    companyName: company.name,
    status: JobStatus.OPEN,
  },
    });
}

export async function updateJobService(jobId: string,userId: string, jobData: UpdateJobInput) {
    const job = await prisma.jobs.findUnique({where:{id:jobId}});
    if(!job) {
        throw new JobNotFoundError();
    }

    const company = await prisma.companies.findUnique({where:{userId}});
    if(!company) {
        throw new CompanyNotFoundError();
    }
    if(job.companyId !== company.id) {
        throw new NotOwnerError();
    }

    return await prisma.jobs.update({where:{id:jobId}, data: {...jobData, status: jobData.status}});     
}

export async function deleteJobService(jobId: string,userId: string) {
    const job = await prisma.jobs.findUnique({where:{id:jobId}});
    if(!job) {
        throw new JobNotFoundError();
    }


    const user = await prisma.users.findUnique({where:{id:userId}});
    if(!user) {
        throw new UserNotFoundError();
    }

    if(user.role === "ADMIN") {
       return await prisma.jobs.delete({where:{id:jobId}})  ;
    }

    const company = await prisma.companies.findUnique({where:{userId}});
    if(!company) {
        throw new CompanyNotFoundError();
    }
    if(job.companyId !== company.id) {
        throw new NotOwnerError();
    }
    return await prisma.jobs.delete({where:{id:jobId}});
}

export async function applyJobService(jobId: string,userId: string,jobData: ApplyJobInput) {
    const job = await prisma.jobs.findUnique({where:{id:jobId}});
    if(!job) {
        throw new JobNotFoundError();
    }

    const user = await prisma.users.findUnique({where:{id:userId}});
    if(!user) {
        throw new UserNotFoundError();
    }

    if(user.role === "COMPANY") {
        throw new CandidateOnlyError();
    }   

    const existingApplication = await prisma.applications.findFirst({
        where:  {
            jobId,
            candidateId: userId,
        },
    });

    if(existingApplication) {
        throw new AlreadyAppliedError();
    }
    
    return await prisma.applications.create({
        data: {
            ...jobData,
            jobId,
            candidateId: userId,
            status: "APPLIED",
        }
    })
}

export async function getApplicationsService(userId: string) {
    const user = await prisma.users.findUnique({where:{id:userId}});
    if(!user) {
        throw new UserNotFoundError();
    }

    
    if(user.role === "CANDIDATE") {
        return await prisma.applications.findMany({
            where: { candidateId: userId },
            include: {
                job: {
                    include: {
                        company: true,
                    },
                },
            },
            orderBy: { appliedAt: 'desc' }
        });
    }

    
    if(user.role === "COMPANY") {
        const company = await prisma.companies.findUnique({where:{userId}});
        if(!company) {
            throw new CompanyNotFoundError();
        }

        const applications = await prisma.applications.findMany({
            where: {
                job: {
                    companyId: company.id
                }
            },
            include: {
                job: true,
                candidate: {
                    select: {
                        id: true,
                        email: true,
                    }
                }
            },
            orderBy: { appliedAt: 'desc' }
        });

    }

    
    if(user.role === "ADMIN") {
        return await prisma.applications.findMany({
            include: {
                job: true,
                candidate: true
            },
            orderBy: { appliedAt: 'desc' }
        });
    }

    return [];
}       

export async function updateApplicationService(applicationId: string, userId: string,status: ApplicationStatus) {
    const application = await prisma.applications.findUnique({where:{id:applicationId}, include:{job:{include:{company:{include:{user:true}}}}}});
    if(!application) {
        throw new ApplicationNotFoundError();
    }

    const user = await prisma.users.findUnique({where:{id:userId}});
    if(!user) {
        throw new UserNotFoundError();
    }

    if(user.role === "CANDIDATE") {
        throw new CompanyOnlyError();
    }

    if(application.job.company.user.id !== user.id) {
        throw new NotOwnerError();
    }

    return await prisma.applications.update({where:{id:applicationId}, data: {status}});
}

export async function adminStatsService() {
    const stats = await prisma.$transaction([
        prisma.users.count(),
        prisma.jobs.count(),
        prisma.jobs.count({where: {status: "OPEN"}}),
        prisma.applications.count(),
        prisma.applications.count({where:{status: "APPLIED"}}),
        prisma.companies.count(),
        prisma.companies.count({where:{isApproved: true}}),
    ])
    return {
        users: stats[0],
        jobs: stats[1],
        openJobs: stats[2],
        applications: stats[3],
        appliedApplications: stats[4],
        companies: stats[5],
        approvedCompanies: stats[6],
    }
}

export async function approveCompanyService(id: string, userId: string) {
    const company = await prisma.companies.findUnique({where:{id}});
    if(!company) {
        throw new CompanyNotFoundError();
    }

    if(company.isApproved) {
        throw new CompanyAlreadyApprovedError();
    }

    const user = await prisma.users.findUnique({where:{id:userId}});
    if(!user || user.role !== "ADMIN") {
        throw new NotAdminError();
    }

    
    
    return await prisma.companies.update({where:{id}, data:{isApproved: true}});
}
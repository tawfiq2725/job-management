import { Job } from "../interface.job";

export interface JobRepoSitory {
  createJob(data: Partial<Job>): Promise<Job>;
  getAllJobs(filters: any): Promise<Job[]>;
}

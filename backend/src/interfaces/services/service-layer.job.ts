import { Job } from "../interface.job";

export interface Jobs {
  createJob(data: Partial<Job>): Promise<Job>;
  getAllJobs(filters: any): Promise<Job[]>;
}

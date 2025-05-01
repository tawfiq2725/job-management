import { Job } from "../interfaces/interface.job";
import { Jobs } from "../interfaces/services/service-layer.job";
import { JobRepoSitory } from "../interfaces/repository/repo.layer";
import { JobFilters } from "../repository/repo.job";

export class JobRepo implements Jobs {
  constructor(private jobRepo: JobRepoSitory) {}

  public async createJob(data: Partial<Job>): Promise<Job> {
    try {
      let res = await this.jobRepo.createJob(data);
      return res;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async getAllJobs(filters: JobFilters): Promise<Job[]> {
    try {
      return await this.jobRepo.getAllJobs(filters);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

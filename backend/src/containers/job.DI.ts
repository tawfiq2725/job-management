import { Job } from "../controllers/controller.job";
import { JobRepo } from "../services/service.job";
import { JobRepository } from "../repository/repo.job";

const jobRepos = new JobRepository();
const jobService = new JobRepo(jobRepos);
export const JobCtrlDI = new Job(jobService);

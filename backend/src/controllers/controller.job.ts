import { Request, Response, NextFunction } from "express";
import { Jobs } from "../interfaces/services/service-layer.job";
import { sendResponse } from "../utils/sendResponse";
import { HttpStatus } from "../utils/HttpStatus";
export class Job {
  constructor(private jobService: Jobs) {}

  public async getAllJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Match the exact query-param names you’re sending:
      const filters = {
        title: req.query.search as string | undefined,
        location: req.query.location as string | undefined,
        job_type: req.query.jobType as string | undefined,
        minSalary: req.query.minSalary
          ? Number(req.query.minSalary)
          : undefined,
        maxSalary: req.query.maxSalary
          ? Number(req.query.maxSalary)
          : undefined,
      };

      const jobs = await this.jobService.getAllJobs(filters);
      sendResponse(res, HttpStatus.OK, true, "Jobs fetched successfully", jobs);
    } catch (err) {
      next(err);
    }
  }

  public async createNewJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let data = req.body;
      let result = await this.jobService.createJob(data);
      sendResponse(
        res,
        HttpStatus.CREATED,
        true,
        "Job Created Successfully",
        result
      );
    } catch (err) {
      next(err);
    }
  }
}

import { Job } from "../interfaces/interface.job";
import { JobRepoSitory } from "../interfaces/repository/repo.layer";
import { pool } from "../db/connection";

export interface JobFilters {
  title?: string;
  location?: string;
  job_type?: string;
  minSalary?: number;
  maxSalary?: number;
}
export class JobRepository implements JobRepoSitory {
  async createJob(data: Partial<Job>): Promise<Job> {
    const query = `
      INSERT INTO jobs (
        title, company_name, location, job_type, salary_range,
        description, application_deadline
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      data.title,
      data.company_name,
      data.location,
      data.job_type,
      data.salary_range,
      data.description,
      data.application_deadline,
    ];

    try {
      const result = await pool.query(query, values);
      const row = result.rows[0];
      return {
        ...row,
        application_deadline: new Date(row.application_deadline),
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
      };
    } catch (error) {
      console.error("Error creating job:", error);
      throw new Error("Failed to create job");
    }
  }
  async getAllJobs(filters: JobFilters): Promise<Job[]> {
    let baseQuery = `SELECT * FROM jobs WHERE 1=1`;
    const values: any[] = [];
    let idx = 1;

    if (filters.title) {
      baseQuery += ` AND LOWER(title) LIKE LOWER($${idx++})`;
      values.push(`%${filters.title}%`);
    }

    if (filters.location) {
      baseQuery += ` AND LOWER(location) LIKE LOWER($${idx++})`;
      values.push(`%${filters.location}%`);
    }

    if (filters.job_type) {
      baseQuery += ` AND job_type = $${idx++}`;
      values.push(filters.job_type);
    }

    if (filters.minSalary !== undefined) {
      baseQuery += ` AND salary_range >= $${idx++}`;
      values.push(filters.minSalary);
    }

    if (filters.maxSalary !== undefined) {
      baseQuery += ` AND salary_range <= $${idx++}`;
      values.push(filters.maxSalary);
    }

    baseQuery += ` ORDER BY created_at DESC`;

    try {
      const result = await pool.query(baseQuery, values);
      return result.rows.map((row) => ({
        ...row,
        application_deadline: new Date(row.application_deadline),
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
      }));
    } catch (error) {
      console.error("Error fetching filtered jobs:", error);
      throw new Error("Failed to fetch jobs");
    }
  }
}

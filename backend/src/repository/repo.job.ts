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

    console.log("Filters:", filters); // Debug input

    // Handle title filter with partial match (case-insensitive)
    if (filters.title) {
      baseQuery += ` AND LOWER(title) LIKE LOWER($${idx++})`;
      values.push(`%${filters.title}%`);
    }

    // Handle location filter with exact match
    if (filters.location) {
      baseQuery += ` AND location = $${idx++}`;
      values.push(filters.location);
    }

    // Handle job_type filter with exact match
    if (filters.job_type) {
      const validJobTypes = [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
      ];
      if (!validJobTypes.includes(filters.job_type)) {
        throw new Error(`Invalid job_type: ${filters.job_type}`);
      }
      baseQuery += ` AND job_type = $${idx++}`;
      values.push(filters.job_type);
    }

    // Handle minSalary filter (converted to yearly INR)
    if (filters.minSalary !== undefined) {
      if (filters.minSalary < 0) {
        throw new Error("minSalary cannot be negative");
      }
      const minSalaryINR = filters.minSalary * 12;
      baseQuery += ` AND salary_range >= $${idx++}`;
      values.push(minSalaryINR);
    }

    // Handle maxSalary filter (converted to yearly INR)
    if (filters.maxSalary !== undefined) {
      if (filters.maxSalary < 0) {
        throw new Error("maxSalary cannot be negative");
      }
      const maxSalaryINR = filters.maxSalary * 12;
      baseQuery += ` AND salary_range <= $${idx++}`;
      values.push(maxSalaryINR);
    }

    // Validate minSalary <= maxSalary
    if (filters.minSalary !== undefined && filters.maxSalary !== undefined) {
      if (filters.minSalary > filters.maxSalary) {
        throw new Error("minSalary cannot be greater than maxSalary");
      }
    }

    baseQuery += ` ORDER BY created_at DESC`;

    console.log("SQL Query:", baseQuery);
    console.log("Query Values:", values);

    try {
      const result = await pool.query(baseQuery, values);
      console.log("Rows returned:", result.rows.length);

      // If no rows match the exact criteria, return empty array
      if (result.rows.length === 0) {
        return [];
      }

      // Map the results to the desired Job format
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

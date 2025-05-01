  export interface Job {
    id?: number;
    title: string;
    company_name: string;
    location: string;
    job_type: "Full-time" | "Part-time" | "Contract" | "Internship";
    salary_range: number;
    description: string;
    application_deadline: string | Date;
    created_at?: string | Date;
    updated_at?: string | Date;
  }

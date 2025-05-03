import { useState, useCallback, useEffect } from "react";
import { backendUrl } from "@/utils/url";

// Define job interface
interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  salary_range: string;
  description: string;
  application_deadline: string;
  created_at: string;
  updated_at: string;
}

// Define filters interface
interface JobFilters {
  searchQuery: string;
  location: string | null;
  jobType: string | null;
  salary: [number, number];
}

export default function JobListingPage({ filters = {} as JobFilters }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const buildQueryParams = (filters: JobFilters): string => {
    const params = new URLSearchParams();

    if (filters.searchQuery) params.append("search", filters.searchQuery);
    if (filters.location) params.append("location", filters.location);
    if (filters.jobType) params.append("jobType", filters.jobType);

    if (
      filters.salary &&
      Array.isArray(filters.salary) &&
      filters.salary.length === 2
    ) {
      params.append("minSalary", (filters.salary[0] * 1000).toString());
      params.append("maxSalary", (filters.salary[1] * 1000).toString());
    }

    return params.toString();
  };

 const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams(filters);
      const url = queryParams
        ? `${backendUrl}/all-jobs?${queryParams}`
        : `${backendUrl}/all-jobs`;

      console.log("Fetching jobs with URL:", url);

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setJobs(result.data);
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching jobs");
    } finally {
      setLoading(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  }, [filters, isInitialLoad]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  if (loading && isInitialLoad) {
    return (
      <div className="min-h-screen bg-white p-4 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4 flex justify-center items-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchJobs}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const firstRowJobs = jobs.slice(0, 4);
  const secondRowJobs = jobs.slice(4, 8);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="container mx-auto">
        {loading && !isInitialLoad && (
          <div className="text-center py-2 mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
              Updating results...
            </div>
          </div>
        )}

        {!loading && jobs.length === 0 ? (
          <div className="text-center py-10">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">No jobs found</h2>
            <p className="text-gray-600 mt-2 max-w-md mx-auto">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <>
            {firstRowJobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {firstRowJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {secondRowJobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {secondRowJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
// Job card component
function JobCard({ job }: { job: Job }) {
  // Create an array from the description string (split by new lines)
  const descriptionLines: string[] = job.description
    .split("\n")
    .filter((line: string): boolean => line.trim() !== "");

  // Get the first letter of company name (capitalized)
  const logoLetter = job.company_name.charAt(0).toUpperCase();

  // Pick a background color based on company name
  const logoBackground = (() => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-black",
    ];
    const index = job.company_name.length % colors.length;
    return colors[index];
  })();

  // Format the posted time
  const postedTime = (() => {
    try {
      const createdDate = new Date(job.created_at);
      const now = new Date();
      const diffHours = Math.floor(
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60)
      );

      if (diffHours < 1) {
        return "Recently";
      } else if (diffHours < 24) {
        return `${diffHours}h Ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d Ago`;
      }
    } catch {
      return "Recently";
    }
  })();

  // Format salary
  const formattedSalary = (() => {
    const salaryInLakhs = parseInt(job.salary_range) / 100000;
    return `${salaryInLakhs}LPA`;
  })();

  // Determine location type display
  const locationTypeDisplay =
    job.location.toLowerCase() === "remote" ? "Remote" : "Onsite";

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col">
      <div className="flex justify-between items-center p-4">
        <div
          className={`w-12 h-12 rounded-full ${logoBackground} flex items-center justify-center text-lg font-bold text-white`}
        >
          {logoLetter}
        </div>
        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {postedTime}
        </div>
      </div>

      <div className="px-4 pb-2">
        <h3 className="font-bold text-black text-lg mb-2">{job.title}</h3>

        <div className="flex items-center text-sm text-gray-600 space-x-2 mb-3">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            0-3 yr Exp
          </div>

          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            {locationTypeDisplay}
          </div>

          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {formattedSalary}
          </div>
        </div>

        <ul className="text-sm mb-4">
          {descriptionLines.slice(0, 2).map(
            (item: string, i: number): React.ReactElement => (
              <li key={i} className="flex text-black items-start mb-1">
                <span className="mr-2">•</span>
                <span>
                  {item.length > 60 ? item.substring(0, 60) + "..." : item}
                </span>
              </li>
            )
          )}
        </ul>
      </div>

      <div className="mt-auto px-4 pb-4">
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
          Apply Now
        </button>
      </div>
    </div>
  );
}

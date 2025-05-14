import { useState, useCallback, useEffect, useRef } from "react";
import { backendUrl } from "@/utils/url";
import { useJobStore } from "@/store/store";
import { JobCard } from "./jobCard";
import { JobFilters } from "@/interface/job";

export default function JobListingPage({ filters = {} as JobFilters }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Prevent duplicate fetchJobs calls
  const hasFetched = useRef(false);

  // Get jobs from store
  const jobs = useJobStore((state) => state.jobs);

  // Debug renders and filters
  useEffect(() => {
    console.log("JobListingPage rendered with filters:", filters);
    console.log("Jobs in store:", jobs);
  }, [filters, jobs]);

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
    // Skip if already fetched
    if (hasFetched.current) {
      console.log("Skipping duplicate fetchJobs call");
      return;
    }
    hasFetched.current = true;

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
        // Replace jobs in store with fetched data
        useJobStore.setState((s) => ({
          ...s,
          jobs: result.data,
        }));
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching jobs");
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Reset hasFetched on filters change to allow new fetches
  useEffect(() => {
    hasFetched.current = false; // Allow fetchJobs on filters change
  }, [filters]);

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
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Oops! Something went wrong
          </h2>
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

        {jobs.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

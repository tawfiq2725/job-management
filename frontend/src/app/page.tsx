"use client";
import { useState, useCallback } from "react";
import JobFilter from "@/components/filter";
import JobListingPage from "@/components/listing";
import NavbarDemo from "@/components/navbar";
import { JobFilters } from "@/interface/job";
import { isEqual } from "lodash";

export default function Home() {
  // State to manage filter values with proper initial values
  const [filters, setFilters] = useState<JobFilters>({
    searchQuery: "",
    location: null,
    jobType: null,
    salary: [20, 80],
  });

  // Memoized handler for filter changes to prevent unnecessary re-renders
  const handleFilterChange = useCallback((newFilters: JobFilters): void => {
    console.log("Filters changed:", newFilters);
    setFilters((prev) => {
      if (isEqual(prev, newFilters)) {
        return prev; // Prevent update if filters are unchanged
      }
      return newFilters;
    });
  }, []);

  return (
    <>
      <NavbarDemo />
      <div className="container mx-auto px-4 py-2">
        <JobFilter onFilterChange={handleFilterChange} />
        <JobListingPage filters={filters} />
      </div>
    </>
  );
}
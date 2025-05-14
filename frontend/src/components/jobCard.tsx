import { Job } from "@/interface/job";
// Job card component
export function JobCard({ job }: { job: Job }) {
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

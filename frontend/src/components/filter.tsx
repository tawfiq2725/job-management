import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Users, ChevronDown } from "lucide-react";

interface JobFilters {
  searchQuery: string;
  location: string | null;
  jobType: string | null;
  salary: [number, number];
}

interface JobFilterProps {
  onFilterChange: (filters: JobFilters) => void;
}

export default function JobFilter({ onFilterChange }: JobFilterProps) {
  // State for form inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Preferred Location");
  const [jobType, setJobType] = useState("Job type");
  const [salary, setSalary] = useState<[number, number]>([0, 100]);

  // Dropdown states
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [jobTypeDropdownOpen, setJobTypeDropdownOpen] = useState(false);

  // Refs for range slider
  const rangeRef = useRef<HTMLDivElement | null>(null);
  const minThumbRef = useRef<HTMLDivElement | null>(null);
  const maxThumbRef = useRef<HTMLDivElement | null>(null);
  const rangeTrackRef = useRef<HTMLDivElement | null>(null);

  // For debouncing filter changes
  const filterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const locations = ["Chennai", "Banglore", "Hyderabad", "Noida", "Remote"];
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];

  // Send filter updates to parent component with debounce
  const updateFilters = () => {
    if (filterDebounceRef.current) {
      clearTimeout(filterDebounceRef.current);
    }

    filterDebounceRef.current = setTimeout(() => {
      onFilterChange({
        searchQuery,
        location: location === "Preferred Location" ? null : location,
        jobType: jobType === "Job type" ? null : jobType,
        salary,
      });
    }, 500);
  };

  // Update filters when any input changes
  useEffect(() => {
    updateFilters();
    
    return () => {
      if (filterDebounceRef.current) {
        clearTimeout(filterDebounceRef.current);
      }
    };
  }, [searchQuery, location, jobType, salary]);

  const handleRangeChange = (isMin: boolean, event: MouseEvent) => {
    if (!rangeRef.current) return;
    const container = rangeRef.current.getBoundingClientRect();
    const containerWidth = container.width;

    let position = ((event.clientX - container.left) / containerWidth) * 100;
    position = Math.max(0, Math.min(position, 100));

    const minVal = salary[0];
    const maxVal = salary[1];
    const range = 100;
    const newValue = Math.round((position / 100) * range);

    // Ensure min doesn't exceed max and max doesn't go below min
    if (isMin) {
      setSalary([Math.min(newValue, maxVal - 5), maxVal]);
    } else {
      setSalary([minVal, Math.max(newValue, minVal + 5)]);
    }
  };

  // Mouse move and up event handlers for dragging
  const handleMouseMove = (isMin: boolean, event: MouseEvent) => {
    handleRangeChange(isMin, event);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMinMove);
    document.removeEventListener("mousemove", handleMaxMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMinMove = (event: MouseEvent) => handleMouseMove(true, event);
  const handleMaxMove = (event: MouseEvent) => handleMouseMove(false, event);

  const startDrag =
    (isMin: boolean) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (isMin) {
        document.addEventListener("mousemove", handleMinMove);
      } else {
        document.addEventListener("mousemove", handleMaxMove);
      }

      document.addEventListener("mouseup", handleMouseUp);
    };

  // Update range track position
  useEffect(() => {
    if (rangeTrackRef.current) {
      const minPercent = (salary[0] / 100) * 100;
      const maxPercent = (salary[1] / 100) * 100;

      rangeTrackRef.current.style.left = `${minPercent}%`;
      rangeTrackRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [salary]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      const locationDropdown = document.getElementById("location-dropdown");
      const jobTypeDropdown = document.getElementById("jobtype-dropdown");

      if (
        locationDropdownOpen &&
        locationDropdown &&
        !locationDropdown.contains(target)
      ) {
        setLocationDropdownOpen(false);
      }

      if (
        jobTypeDropdownOpen &&
        jobTypeDropdown &&
        !jobTypeDropdown.contains(target)
      ) {
        setJobTypeDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [locationDropdownOpen, jobTypeDropdownOpen]);

  return (
    <div className="w-full bg-white shadow-sm rounded-lg px-3 mb-6">
      <div className="flex flex-col md:flex-row items-center gap-2 py-3">
        {/* Search Input */}
        <div className="relative w-full md:w-1/4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700"
            size={18}
          />
          <input
            type="text"
            placeholder="Search By Job Title, Role"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Location Dropdown */}
        <div className="relative w-full md:w-1/4" id="location-dropdown">
          <div
            className="flex items-center w-full px-4 py-3 border border-gray-200 rounded-lg cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setLocationDropdownOpen(!locationDropdownOpen);
              setJobTypeDropdownOpen(false);
            }}
          >
            <MapPin size={18} className="text-gray-700 mr-3" />
            <span className="text-black flex-1 font-medium">{location}</span>
            <ChevronDown size={18} className="text-gray-700" />
          </div>

          {locationDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {locations.map((loc, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black font-medium"
                  onClick={() => {
                    setLocation(loc);
                    setLocationDropdownOpen(false);
                  }}
                >
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Job Type Dropdown */}
        <div className="relative w-full md:w-1/4" id="jobtype-dropdown">
          <div
            className="flex items-center w-full px-4 py-3 border border-gray-200 rounded-lg cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setJobTypeDropdownOpen(!jobTypeDropdownOpen);
              setLocationDropdownOpen(false);
            }}
          >
            <Users size={18} className="text-gray-700 mr-3" />
            <span className="text-black flex-1 font-medium">{jobType}</span>
            <ChevronDown size={18} className="text-gray-700" />
          </div>

          {jobTypeDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {jobTypes.map((type, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black font-medium"
                  onClick={() => {
                    setJobType(type);
                    setJobTypeDropdownOpen(false);
                  }}
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Salary Range Slider */}
        <div className="w-full md:w-1/4 px-2 py-2">
          <div className="px-2">
            <div className="text-sm font-medium text-black mb-2">
              Salary Per Month
            </div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-sm font-bold text-black">
                ₹{salary[0]}k
              </span>
              <span className="text-sm font-bold text-black">
                ₹{salary[1]}k
              </span>
            </div>
            <div
              className="relative h-1 bg-gray-200 rounded-full my-6 cursor-pointer"
              ref={rangeRef}
            >
              {/* Active Range Track */}
              <div
                ref={rangeTrackRef}
                className="absolute top-0 h-1 bg-black rounded-full"
                style={{
                  left: `${(salary[0] / 100) * 100}%`,
                  width: `${((salary[1] - salary[0]) / 100) * 100}%`,
                }}
              ></div>

              {/* Min Thumb */}
              <div
                ref={minThumbRef}
                className="absolute -top-2 -ml-2 touch-none"
                style={{ left: `${(salary[0] / 100) * 100}%` }}
                onMouseDown={startDrag(true)}
              >
                <div className="w-5 h-5 bg-white border-2 border-black rounded-full cursor-grab"></div>
              </div>

              {/* Max Thumb */}
              <div
                ref={maxThumbRef}
                className="absolute -top-2 -ml-2 touch-none"
                style={{ left: `${(salary[1] / 100) * 100}%` }}
                onMouseDown={startDrag(false)}
              >
                <div className="w-5 h-5 bg-white border-2 border-black rounded-full cursor-grab"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
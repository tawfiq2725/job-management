import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDown, Calendar, ChevronRight, Save } from "lucide-react";
import { backendUrl } from "@/utils/url";
import { toast } from "react-toastify";

type FormData = {
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  minSalary: string;
  maxSalary: string;
  applicationDeadline: Date | null;
  jobDescription: string;
};

type JobOpeningFormProps = {
  closeForm: () => void;
};

const JobOpeningForm: React.FC<JobOpeningFormProps> = ({ closeForm }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      jobTitle: "",
      companyName: "",
      location: "",
      jobType: "FullTime",
      minSalary: "",
      maxSalary: "",
      applicationDeadline: null,
      jobDescription: "",
    },
  });

  const [isSaved, setSaved] = useState(false);

  // Load saved draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("jobOpeningDraft");
    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft);
      Object.keys(parsedDraft).forEach((key) => {
        if (key === "applicationDeadline" && parsedDraft[key]) {
          setValue(key as keyof FormData, new Date(parsedDraft[key]));
        } else {
          setValue(key as keyof FormData, parsedDraft[key]);
        }
      });
    }
  }, [setValue]);

  const saveDraft = () => {
    const formData = watch();
    localStorage.setItem("jobOpeningDraft", JSON.stringify(formData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  function convertJobType(
    type: string
  ): "Full-time" | "Part-time" | "Contract" | "Internship" {
    switch (type) {
      case "FullTime":
        return "Full-time";
      case "PartTime":
        return "Part-time";
      case "Contract":
        return "Contract";
      case "Internship":
        return "Internship";
      default:
        return "Full-time";
    }
  }

  const onSubmit = async (data: FormData) => {
    const transformedData = {
      title: data.jobTitle,
      company_name: data.companyName,
      location: data.location,
      job_type: convertJobType(data.jobType),
      salary_range: Number(data.maxSalary),
      description: data.jobDescription,
      application_deadline: data.applicationDeadline,
    };
    console.log("Form submitted:", data);
    try {
      const response = await fetch(backendUrl + "/create-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });
      const datad = await response.json();
      console.log(datad);
      reset();
      toast.success("Job created successfully!");
      localStorage.removeItem("jobOpeningDraft");
      closeForm();
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Failed to create job.");
    }
  };

  const locationOptions = [
    "Chennai",
    "Banglore",
    "Hyderabad",
    "Noida",
    "Remote",
  ];

  const jobTypeOptions = ["FullTime", "PartTime", "Contract", "Internship"];

  return (
    <div className="flex justify-center items-center max-h-screen p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl">
        <h1 className="text-xl font-semibold text-center text-black mb-4">
          Create Job Opening
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* First Row: Job Title and Company Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Job Title
              </label>
              <input
                className={`w-full border ${
                  errors.jobTitle ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                placeholder="Full Stack Developer"
                {...register("jobTitle", {
                  required: "Job title is required",
                  minLength: {
                    value: 3,
                    message: "Job title must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters are allowed",
                  },
                })}
              />
              {errors.jobTitle && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Company Name
              </label>
              <input
                className={`w-full border ${
                  errors.companyName ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                placeholder="Amazon, Microsoft, Swiggy"
                {...register("companyName", {
                  required: "Company name is required",
                  minLength: {
                    value: 2,
                    message: "Company name must be at least 2 characters",
                  },
                })}
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>
          </div>

          {/* Second Row: Location and Job Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Location
              </label>
              <div className="relative">
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: "Location is required" }}
                  render={({ field }) => (
                    <select
                      className={`w-full border ${
                        errors.location ? "border-red-500" : "border-gray-300"
                      } rounded-md p-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                      {...field}
                    >
                      <option value="" disabled>
                        Choose Preferred Location
                      </option>
                      {locationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={14}
                />
              </div>
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Job Type
              </label>
              <div className="relative">
                <Controller
                  name="jobType"
                  control={control}
                  rules={{ required: "Job type is required" }}
                  render={({ field }) => (
                    <select
                      className={`w-full border ${
                        errors.jobType ? "border-red-500" : "border-gray-300"
                      } rounded-md p-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                      {...field}
                    >
                      {jobTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={14}
                />
              </div>
              {errors.jobType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.jobType.message}
                </p>
              )}
            </div>
          </div>

          {/* Third Row: Salary Range and Application Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Salary Range
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="text"
                    className={`w-full border ${
                      errors.minSalary ? "border-red-500" : "border-gray-300"
                    } rounded-md p-2 pl-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                    placeholder="0"
                    {...register("minSalary", {
                      required: "Min salary is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Only numbers allowed",
                      },
                    })}
                  />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="text"
                    className={`w-full border ${
                      errors.maxSalary ? "border-red-500" : "border-gray-300"
                    } rounded-md p-2 pl-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                    placeholder="12,00,000"
                    {...register("maxSalary", {
                      required: "Max salary is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Only numbers allowed",
                      },
                      validate: {
                        greaterThanMin: (value) => {
                          const minSalary = parseInt(watch("minSalary") || "0");
                          const maxSalary = parseInt(value || "0");
                          return (
                            maxSalary > minSalary ||
                            "Max salary must be greater than min salary"
                          );
                        },
                      },
                    })}
                  />
                </div>
              </div>
              {(errors.minSalary || errors.maxSalary) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.minSalary?.message || errors.maxSalary?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Application Deadline
              </label>
              <div className="relative">
                <Controller
                  name="applicationDeadline"
                  control={control}
                  rules={{ required: "Application deadline is required" }}
                  render={({
                    field,
                  }: {
                    field: import("react-hook-form").ControllerRenderProps<
                      FormData,
                      "applicationDeadline"
                    >;
                  }) => (
                    <div className="relative">
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        className={`w-full border ${
                          errors.applicationDeadline
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                        placeholderText="Select deadline"
                        minDate={new Date()}
                        dateFormat="MM/dd/yyyy"
                      />
                      <Calendar
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                        size={14}
                      />
                    </div>
                  )}
                />
              </div>
              {errors.applicationDeadline && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.applicationDeadline.message}
                </p>
              )}
            </div>
          </div>

          {/* Fourth Row: Job Description */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Job Description
            </label>
            <textarea
              className={`w-full border ${
                errors.jobDescription ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 h-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
              placeholder="Please share a description to let the candidate know more about the job role"
              {...register("jobDescription", {
                required: "Job description is required",
                minLength: {
                  value: 50,
                  message: "Job description must be at least 50 characters",
                },
              })}
            ></textarea>
            {errors.jobDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.jobDescription.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              type="button"
              onClick={saveDraft}
              className="flex items-center justify-center px-4 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto text-sm text-black"
            >
              Save Draft{" "}
              <Save size={14} className="ml-2" />
              {isSaved && <span className="ml-2 text-green-500">(Saved!)</span>}
            </button>

            <button
              type="submit"
              className="flex items-center justify-center px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full sm:w-auto text-sm"
            >
              Publish <ChevronRight className="ml-1" size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobOpeningForm;
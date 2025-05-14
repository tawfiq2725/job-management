export function convertJobType(
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

export const locationOptions = [
  "Chennai",
  "Banglore",
  "Hyderabad",
  "Noida",
  "Remote",
];

export const jobTypeOptions = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

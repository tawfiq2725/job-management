const productionUrl = "https://job-management-app-ixcg.onrender.com/api/job";

export const backendUrl =
  process.env.NEXT_PUBLIC_NODE_ENV === "production"
    ? productionUrl
    : "http://localhost:5000/api/job";

console.log(backendUrl);

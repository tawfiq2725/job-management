import { Job } from "@/interface/job";
import { create } from "zustand";

interface jobStore {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  createJob: (job: Job) => void;
  getJobs: () => Job[];
}

export const useJobStore = create<jobStore>((set, get) => ({
  jobs: [],
  setJobs: (jobsList: Job[]) => {
    set({ jobs: jobsList });
  },
  createJob: (job: Job) => {
    set((state) => ({ jobs: [...state.jobs, job] }));
  },
  getJobs: () => {
    return get().jobs;
  },
}));

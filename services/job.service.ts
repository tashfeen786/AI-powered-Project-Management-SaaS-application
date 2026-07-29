import { apiClient } from "./api";
import { JobResponse, StandardResponse } from "@/types/api";

export const JobService = {
  getJobs: async (): Promise<JobResponse[]> => {
    const response: StandardResponse<JobResponse[]> = await apiClient.get("/jobs");
    return response.data ?? [];
  },

  getJob: async (jobId: string): Promise<JobResponse> => {
    const response: StandardResponse<JobResponse> = await apiClient.get(`/jobs/${jobId}`);
    return response.data!;
  },

  createJob: async (data: { job_type: string; payload?: any }): Promise<JobResponse> => {
    const response: StandardResponse<JobResponse> = await apiClient.post("/jobs", data);
    return response.data!;
  },

  deleteJob: async (jobId: string): Promise<void> => {
    await apiClient.delete(`/jobs/${jobId}`);
  },
};

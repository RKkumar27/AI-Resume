import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("resumatch_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("resumatch_token");
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

export const resumeAPI = {
  getResumes: () => api.get("/resumes"),
  uploadResume: (formData) =>
    api.post("/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  setActiveResume: (id) => api.put(`/resumes/${id}/active`),
  deleteResume: (id) => api.delete(`/resumes/${id}`),
};

export const jobAPI = {
  getJobs: (q) => api.get("/jobs", { params: { q } }),
  getJobRecommendations: (role) =>
    api.get("/jobs/recommendations", { params: { role } }),
};

export const applicationAPI = {
  getApplications: () => api.get("/applications"),
  createApplication: (data) => api.post("/applications", data),
  updateStatus: (id, data) => api.patch(`/applications/${id}`, data),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
};

export const aiAPI = {
  analyzeResume: (data) => api.post("/ai/analyze-resume", data),
  matchJob: (data) => api.post("/ai/match-job", data),
  skillGap: (data) => api.post("/ai/skill-gap", data),
  generateInterview: (data) => api.post("/ai/generate-interview", data),
  evaluateAnswer: (data) => api.post("/ai/evaluate-answer", data),
};

export const healthAPI = {
  getHealth: () => api.get("/health"),
};

export default api;

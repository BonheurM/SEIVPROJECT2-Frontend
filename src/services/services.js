import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "http://localhost:8080" : "/");

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 2000, // helps meet the "≤2s" acceptance criteria
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Uniform, friendly errors (no double JSON parsing)
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.error || err.message || "Request failed";
    return Promise.reject(new Error(msg));
  }
);

export default apiClient;

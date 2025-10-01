import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "http://localhost:8080" : "/course-t2");

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // Increased timeout for production
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
apiClient.interceptors.response.use(
  (res) => {
    console.log('API Response:', res.status, res.data);
    return res;
  },
  (err) => {
    console.error('API Error:', err.response?.status, err.response?.data || err.message);
    const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || "Request failed";
    return Promise.reject(new Error(msg));
  }
);

export default apiClient;

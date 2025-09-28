import apiClient from "./services"; // your axios instance with baseURL & timeout
import { USE_MOCK_DATA, mockCourses, simulateDelay } from "./mockData";

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function assertDept(dept) {
  try {
    const d = String(dept || "").trim().toUpperCase();
    if (!/^[A-Z]{2,4}$/.test(d)) {
      throw new ValidationError("Department code must be 2-4 letters (e.g., CS, MAT, HIST)");
    }
    return d;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new ValidationError("Invalid department code format");
  }
}

export default {
  // Search courses by department code
  async searchByDepartment(deptCode) {
    try {
      const department = assertDept(deptCode);
      console.log('Searching for department:', department);
      
      // Use mock data if enabled or if backend fails
      if (USE_MOCK_DATA) {
        await simulateDelay(300); // Simulate network delay
        const courses = mockCourses[department] || [];
        console.log('Using mock data:', courses);
        return courses;
      }
      
      const response = await apiClient.get("/api/courses", { 
        params: { department }
      });
      
      console.log('API Response:', response);
      
      const { data } = response;
      if (!Array.isArray(data)) {
        console.warn('Unexpected response format:', data);
        return [];
      }
      console.log('Found courses:', data);
      return data;
    } catch (error) {
      console.error('API Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error instanceof ValidationError) {
        throw error;
      }
      
      if (error.response?.status === 404) {
        return []; // Return empty array for no results
      }
      
      // Fallback to mock data if API is unavailable
      if (error.message.includes('Network') || error.code === 'ECONNABORTED') {
        console.warn('API unavailable, falling back to mock data');
        const department = assertDept(deptCode);
        await simulateDelay(300);
        return mockCourses[department] || [];
      }
      
      throw new Error(error.response?.data?.message || 'Failed to search courses. Please try again.');
    }
  },

  // Get all courses (with optional pagination)
  async getAll(page = 1, limit = 20) {
    const { data } = await apiClient.get("/api/courses", { params: { page, limit } });
    return Array.isArray(data) ? data : [];
  },

  // Get a single course by ID
  async get(id) {
    const { data } = await apiClient.get(`/api/courses/${encodeURIComponent(id)}`);
    return data;
  },

  // Search courses with multiple filters
  async searchWithFilters(filters = {}) {
    const params = {};
    if (filters.department) params.department = assertDept(filters.department);
    if (filters.level) params.level = String(filters.level).trim();         // e.g., 100/200/300
    if (filters.instructor) params.instructor = String(filters.instructor).trim();
    if (filters.days) params.days = Array.isArray(filters.days) ? filters.days.join(",") : String(filters.days);
    if (filters.time) params.time = String(filters.time).trim();            // e.g., "08:00-12:00"

    const { data } = await apiClient.get("/api/courses/search", { params });
    return Array.isArray(data) ? data : [];
  },

  // Get courses by instructor
  async getByInstructor(instructorName) {
    const name = String(instructorName || "").trim();
    const { data } = await apiClient.get(
      `/api/courses/instructor/${encodeURIComponent(name)}`
    );
    return Array.isArray(data) ? data : [];
  },

  // // Future admin endpoints
  // create(data) { return apiClient.post("/api/courses", data); },
  // update(id, data) { return apiClient.put(`/api/courses/${encodeURIComponent(id)}`, data); },
  // delete(id) { return apiClient.delete(`/api/courses/${encodeURIComponent(id)}`); },
};
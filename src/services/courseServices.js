import apiClient from "./services.js";

export default {
  // Search courses by department code
  searchByDepartment(deptCode) {
    return apiClient.get(`/courses/search?dept=${deptCode}`);
  },

  // Get all courses (with optional pagination)
  getAll(page = 1, limit = 20) {
    return apiClient.get(`/courses?page=${page}&limit=${limit}`);
  },

  // Get a single course by ID
  get(id) {
    return apiClient.get(`/courses/${id}`);
  },

  // Search courses with multiple filters
  searchWithFilters(filters) {
    const params = new URLSearchParams();
    if (filters.department) params.append('dept', filters.department);
    if (filters.level) params.append('level', filters.level);
    if (filters.instructor) params.append('instructor', filters.instructor);
    if (filters.days) params.append('days', filters.days);
    if (filters.time) params.append('time', filters.time);
    
    return apiClient.get(`/courses/search?${params.toString()}`);
  },

  // Get courses by instructor
  getByInstructor(instructorName) {
    return apiClient.get(`/courses/instructor/${instructorName}`);
  },

  // Future admin endpoints (commented out for now)
  // create(data) {
  //   return apiClient.post("/courses", data);
  // },
  
  // update(id, data) {
  //   return apiClient.put(`/courses/${id}`, data);
  // },
  
  // delete(id) {
  //   return apiClient.delete(`/courses/${id}`);
  // },
};
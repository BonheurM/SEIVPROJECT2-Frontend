# API Integration Guide - Frontend & Backend Communication

## Critical: Backend Coordination Checklist

### Before Writing ANY Code:

1. **Confirm API Base URL**
   ```
   Current assumption: http://localhost:8080/api/courses
   Need to confirm:
   - [ ] Exact base URL
   - [ ] Port number (8080?)
   - [ ] API prefix (/api or /tutorial-simple?)
   - [ ] Environment-specific URLs
   ```

2. **Get Exact API Contract**
   ```
   MUST HAVE IN WRITING:
   - [ ] Request format (query params vs path params)
   - [ ] Response format (exact JSON structure)
   - [ ] Error response format
   - [ ] Status codes used
   - [ ] Authentication requirements (if any)
   ```

3. **Test with Postman/cURL FIRST**
   ```bash
   # Before coding, verify this works:
   curl -X GET "http://localhost:8080/api/courses?department=CS" \
        -H "Accept: application/json"
   
   # Expected response?
   # Error response?
   # Response time?
   ```

## API Specification Document

### Course Search Endpoint

**Endpoint**: `GET /api/courses`

**Request Format**:
```
GET /api/courses?department={dept_code}

Query Parameters:
- department: string (required, 2-4 letters, case-insensitive)

Headers:
- Accept: application/json
- Content-Type: application/json (if needed)
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "department": "CS",
      "number": "101",
      "title": "Introduction to Computer Science",
      "credits": 3,
      "instructor": "Dr. Smith",
      "instructorEmail": "smith@university.edu",
      "description": "An introduction to computer science...",
      "schedule": {
        "days": "MWF",
        "time": "10:00-11:00",
        "location": "Room 101"
      },
      "enrollment": {
        "current": 25,
        "capacity": 30
      },
      "prerequisites": []
    }
  ],
  "meta": {
    "count": 1,
    "responseTime": 156
  }
}
```

**Empty Result Response (200 OK)**:
```json
{
  "success": true,
  "data": [],
  "meta": {
    "count": 0,
    "responseTime": 89
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_DEPARTMENT",
    "message": "Department code must be 2-4 letters",
    "field": "department"
  }
}
```

**Error Response (500 Server Error)**:
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An error occurred while fetching courses"
  }
}
```

## Frontend API Service Implementation

### 1. Robust API Client Setup

```javascript
// src/services/apiClient.js
import axios from 'axios';

// Configuration with fallbacks
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 1800, // 1.8s to leave buffer for 2s requirement
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
};

const apiClient = axios.create(API_CONFIG);

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`, {
      params: config.params,
      timestamp: new Date().toISOString()
    });
    config.metadata = { startTime: performance.now() };
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for timing and error handling
apiClient.interceptors.response.use(
  (response) => {
    const duration = performance.now() - response.config.metadata.startTime;
    console.log(`[API] Response in ${duration.toFixed(0)}ms:`, {
      status: response.status,
      data: response.data
    });
    
    // Warn if approaching 2s limit
    if (duration > 1500) {
      console.warn(`[API] Slow response: ${duration.toFixed(0)}ms`);
    }
    
    return response;
  },
  (error) => {
    if (error.config?.metadata) {
      const duration = performance.now() - error.config.metadata.startTime;
      console.error(`[API] Error after ${duration.toFixed(0)}ms:`, error);
    }
    
    // Standardize error format
    const standardError = {
      message: 'An error occurred',
      code: 'UNKNOWN_ERROR',
      status: 0
    };
    
    if (error.response) {
      // Server responded with error
      standardError.status = error.response.status;
      standardError.message = error.response.data?.error?.message || 
                             error.response.data?.message || 
                             `Server error: ${error.response.status}`;
      standardError.code = error.response.data?.error?.code || 'SERVER_ERROR';
    } else if (error.request) {
      // No response received
      standardError.message = 'No response from server. Please check if the backend is running.';
      standardError.code = 'NETWORK_ERROR';
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      standardError.message = 'Request timeout - must complete within 2 seconds';
      standardError.code = 'TIMEOUT';
    }
    
    return Promise.reject(standardError);
  }
);

export default apiClient;
```

### 2. Course Service with Backend Coordination

```javascript
// src/services/courseService.js
import apiClient from './apiClient';
import { mockCourses, USE_MOCK_DATA } from './mockData';

class CourseService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute cache
  }

  // Main search method with all safety checks
  async searchByDepartment(deptCode) {
    try {
      // 1. Validate input
      const dept = this.validateDepartment(deptCode);
      
      // 2. Check cache first
      const cached = this.getFromCache(dept);
      if (cached) {
        console.log('[Cache] Returning cached data for', dept);
        return cached;
      }
      
      // 3. Try API call
      const response = await apiClient.get('/api/courses', {
        params: { department: dept }
      });
      
      // 4. Validate response structure
      const courses = this.validateResponse(response);
      
      // 5. Cache successful response
      this.setCache(dept, courses);
      
      return courses;
      
    } catch (error) {
      console.error('[CourseService] Search failed:', error);
      
      // 6. Handle specific errors
      if (error.code === 'INVALID_DEPARTMENT') {
        throw error; // Re-throw validation errors
      }
      
      // 7. Fallback to mock data if backend is down
      if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
        console.warn('[CourseService] Falling back to mock data');
        return this.getMockData(deptCode);
      }
      
      // 8. Generic error
      throw {
        message: error.message || 'Failed to search courses',
        code: error.code || 'SEARCH_ERROR'
      };
    }
  }
  
  // Validate department code
  validateDepartment(dept) {
    const cleaned = String(dept || '').trim().toUpperCase();
    if (!/^[A-Z]{2,4}$/.test(cleaned)) {
      throw {
        message: 'Department code must be 2-4 letters',
        code: 'INVALID_DEPARTMENT'
      };
    }
    return cleaned;
  }
  
  // Validate API response structure
  validateResponse(response) {
    if (!response?.data) {
      throw {
        message: 'Invalid response from server',
        code: 'INVALID_RESPONSE'
      };
    }
    
    // Handle both wrapped and unwrapped responses
    let courses = response.data;
    
    // If response is wrapped in success/data structure
    if (response.data.hasOwnProperty('success') && response.data.hasOwnProperty('data')) {
      courses = response.data.data;
    }
    
    // Ensure we have an array
    if (!Array.isArray(courses)) {
      console.warn('[CourseService] Non-array response:', courses);
      return [];
    }
    
    // Validate each course has required fields
    return courses.filter(course => {
      const hasRequired = course.department && 
                         course.number && 
                         course.title && 
                         typeof course.credits === 'number' &&
                         course.instructor;
      
      if (!hasRequired) {
        console.warn('[CourseService] Course missing required fields:', course);
      }
      
      return hasRequired;
    });
  }
  
  // Cache management
  getFromCache(dept) {
    const cached = this.cache.get(dept);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > this.cacheTimeout) {
      this.cache.delete(dept);
      return null;
    }
    
    return cached.data;
  }
  
  setCache(dept, data) {
    this.cache.set(dept, {
      data,
      timestamp: Date.now()
    });
  }
  
  // Mock data fallback
  getMockData(dept) {
    const cleaned = String(dept || '').trim().toUpperCase();
    return mockCourses[cleaned] || [];
  }
  
  // Health check method for backend status
  async checkBackendHealth() {
    try {
      const response = await apiClient.get('/health', {
        timeout: 1000 // Quick timeout for health check
      });
      return {
        healthy: true,
        message: 'Backend is running',
        version: response.data?.version
      };
    } catch (error) {
      return {
        healthy: false,
        message: 'Backend is not accessible',
        error: error.code
      };
    }
  }
}

export default new CourseService();
```

### 3. Component Integration with Error Recovery

```vue
<!-- CourseSearchWithAPI.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import courseService from '@/services/courseService';

// State
const searchQuery = ref('');
const courses = ref([]);
const loading = ref(false);
const error = ref(null);
const backendStatus = ref('unknown');

// Check backend status on mount
onMounted(async () => {
  const health = await courseService.checkBackendHealth();
  backendStatus.value = health.healthy ? 'online' : 'offline';
  
  if (!health.healthy) {
    console.warn('Backend is not available. Using mock data mode.');
  }
});

// Search with full error handling
async function search() {
  error.value = null;
  
  try {
    loading.value = true;
    courses.value = await courseService.searchByDepartment(searchQuery.value);
  } catch (err) {
    error.value = err;
    courses.value = [];
    
    // Log for debugging but show user-friendly message
    console.error('Search error:', err);
  } finally {
    loading.value = false;
  }
}

// User-friendly error messages
function getErrorMessage(err) {
  if (!err) return '';
  
  const errorMessages = {
    'INVALID_DEPARTMENT': 'Please enter a valid department code (2-4 letters)',
    'NETWORK_ERROR': 'Cannot connect to server. Showing offline data.',
    'TIMEOUT': 'Search took too long. Please try again.',
    'INVALID_RESPONSE': 'Received invalid data from server.',
  };
  
  return errorMessages[err.code] || err.message || 'An error occurred';
}
</script>
```

## Backend Communication Requirements

### What Frontend Needs from Backend Team:

1. **API Documentation**
   ```yaml
   endpoint: /api/courses
   method: GET
   params:
     - name: department
       type: string
       required: true
       validation: 2-4 letters, case-insensitive
   response:
     - Must include: id, department, number, title, credits, instructor
     - Optional: description, schedule, enrollment, prerequisites
   errors:
     - 400: Invalid department code
     - 500: Server error
   performance:
     - Must respond within 1.8 seconds (frontend has 2s limit)
   ```

2. **Test Data**
   - At least 3 departments: CS, MATH, ENG
   - At least 2-3 courses per department
   - Mix of enrollment levels (full, almost full, open)

3. **CORS Configuration**
   ```javascript
   // Backend must allow:
   Access-Control-Allow-Origin: http://localhost:8081, http://localhost:8082
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Accept
   ```

4. **Health Check Endpoint**
   ```
   GET /health or /api/health
   Response: { "status": "ok", "version": "1.0.0" }
   ```

## Testing Strategy

### 1. API Contract Tests

```javascript
// tests/api/courseApi.test.js
describe('Course API Contract Tests', () => {
  test('Search returns correct structure', async () => {
    const response = await courseService.searchByDepartment('CS');
    
    expect(Array.isArray(response)).toBe(true);
    
    if (response.length > 0) {
      const course = response[0];
      // Required fields
      expect(course).toHaveProperty('department');
      expect(course).toHaveProperty('number');
      expect(course).toHaveProperty('title');
      expect(course).toHaveProperty('credits');
      expect(course).toHaveProperty('instructor');
    }
  });
  
  test('Invalid department returns error', async () => {
    await expect(courseService.searchByDepartment('X'))
      .rejects.toMatchObject({
        code: 'INVALID_DEPARTMENT'
      });
  });
  
  test('Search completes within 2 seconds', async () => {
    const start = performance.now();
    await courseService.searchByDepartment('CS');
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(2000);
  });
});
```

### 2. Integration Checklist

- [ ] Backend running on correct port
- [ ] CORS properly configured
- [ ] API endpoints match documentation
- [ ] Response format matches contract
- [ ] Error responses are consistent
- [ ] Performance meets requirements
- [ ] Fallback to mock data works
- [ ] Cache prevents excessive API calls

## Communication Protocol

### Daily Sync Points:
1. **Morning**: Confirm API availability
2. **Before Testing**: Verify data consistency
3. **Before Deploy**: Run integration tests

### When Issues Arise:
1. Check backend logs
2. Check frontend console
3. Test with Postman/cURL
4. Compare against API contract
5. Update mock data if needed

## Summary

The key to seamless communication:
1. **Document everything** - No verbal agreements
2. **Test first** - Postman before code
3. **Handle failures** - Network will fail
4. **Monitor performance** - 2 seconds is non-negotiable
5. **Provide fallbacks** - Mock data when backend is down

This ensures the frontend works regardless of backend status while maintaining optimal performance when connected.
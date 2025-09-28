// API Testing Utility - Use this to verify backend communication
// Run in browser console: import('./src/utils/apiTester.js').then(m => m.runTests())

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const TEST_DEPARTMENTS = ['CS', 'MATH', 'ENG', 'INVALID', 'X', '12345', ''];

class APITester {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: []
    };
  }

  async runTests() {
    console.log('🔍 API Integration Tests Starting...\n');
    console.log(`Testing against: ${API_BASE}\n`);

    // Test 1: Backend Health Check
    await this.testHealth();
    
    // Test 2: Valid Department Searches
    await this.testValidSearches();
    
    // Test 3: Invalid Department Handling
    await this.testInvalidSearches();
    
    // Test 4: Performance Requirements
    await this.testPerformance();
    
    // Test 5: Response Structure
    await this.testResponseStructure();
    
    // Summary
    this.printSummary();
    
    return this.results;
  }

  async testHealth() {
    console.log('📡 Test 1: Backend Health Check');
    
    try {
      const response = await axios.get(`${API_BASE}/health`, { timeout: 2000 });
      this.pass('Backend is accessible');
      console.log('✅ Backend responded:', response.data);
    } catch (error) {
      // Try alternate health endpoints
      const alternates = ['/api/health', '/ping', '/'];
      let healthy = false;
      
      for (const endpoint of alternates) {
        try {
          await axios.get(`${API_BASE}${endpoint}`, { timeout: 1000 });
          this.warn(`Health endpoint not at /health, but ${endpoint} responded`);
          healthy = true;
          break;
        } catch (e) {
          // Continue trying
        }
      }
      
      if (!healthy) {
        this.fail('Backend is not accessible. Is it running?');
        console.error('❌ No response from backend at', API_BASE);
      }
    }
    console.log('');
  }

  async testValidSearches() {
    console.log('🔎 Test 2: Valid Department Searches');
    
    for (const dept of ['CS', 'MATH', 'ENG']) {
      try {
        const response = await axios.get(`${API_BASE}/api/courses`, {
          params: { department: dept }
        });
        
        const courses = response.data?.data || response.data || [];
        
        if (Array.isArray(courses)) {
          this.pass(`Search for ${dept} returned ${courses.length} courses`);
          console.log(`✅ ${dept}: Found ${courses.length} courses`);
        } else {
          this.fail(`Search for ${dept} returned non-array: ${typeof courses}`);
          console.error(`❌ ${dept}: Invalid response format`);
        }
      } catch (error) {
        this.fail(`Search for ${dept} failed: ${error.message}`);
        console.error(`❌ ${dept}: ${error.message}`);
      }
    }
    console.log('');
  }

  async testInvalidSearches() {
    console.log('🚫 Test 3: Invalid Department Handling');
    
    const invalidCases = [
      { dept: 'X', reason: 'Too short (1 char)' },
      { dept: 'ABCDE', reason: 'Too long (5 chars)' },
      { dept: '123', reason: 'Numbers only' },
      { dept: 'CS1', reason: 'Mixed letters/numbers' },
      { dept: '', reason: 'Empty string' }
    ];
    
    for (const { dept, reason } of invalidCases) {
      try {
        const response = await axios.get(`${API_BASE}/api/courses`, {
          params: { department: dept }
        });
        
        // If we get here, the backend accepted invalid input
        this.warn(`Backend accepted invalid dept '${dept}' (${reason})`);
        console.warn(`⚠️  '${dept}': Backend should reject this`);
      } catch (error) {
        if (error.response?.status === 400) {
          this.pass(`Correctly rejected '${dept}' (${reason})`);
          console.log(`✅ '${dept}': Properly rejected`);
        } else {
          this.fail(`Unexpected error for '${dept}': ${error.message}`);
          console.error(`❌ '${dept}': Wrong error type`);
        }
      }
    }
    console.log('');
  }

  async testPerformance() {
    console.log('⏱️  Test 4: Performance Requirements (<2 seconds)');
    
    const timings = [];
    
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try {
        await axios.get(`${API_BASE}/api/courses`, {
          params: { department: 'CS' },
          timeout: 2000
        });
        const duration = performance.now() - start;
        timings.push(duration);
      } catch (error) {
        if (error.code === 'ECONNABORTED') {
          this.fail('Request exceeded 2 second timeout');
          console.error('❌ Timeout exceeded');
        }
      }
    }
    
    if (timings.length > 0) {
      const avg = timings.reduce((a, b) => a + b) / timings.length;
      const max = Math.max(...timings);
      
      console.log(`Average: ${avg.toFixed(0)}ms, Max: ${max.toFixed(0)}ms`);
      
      if (max < 2000) {
        this.pass(`All requests completed within 2 seconds`);
        console.log('✅ Performance requirement met');
      } else {
        this.fail(`Max response time ${max.toFixed(0)}ms exceeds 2000ms limit`);
        console.error('❌ Performance requirement NOT met');
      }
      
      if (avg > 1000) {
        this.warn(`Average response time ${avg.toFixed(0)}ms is high`);
        console.warn('⚠️  Consider performance optimization');
      }
    }
    console.log('');
  }

  async testResponseStructure() {
    console.log('📋 Test 5: Response Structure Validation');
    
    try {
      const response = await axios.get(`${API_BASE}/api/courses`, {
        params: { department: 'CS' }
      });
      
      const data = response.data?.data || response.data;
      
      if (!Array.isArray(data) || data.length === 0) {
        this.warn('No courses returned for structure validation');
        console.warn('⚠️  Cannot validate structure without data');
        return;
      }
      
      const course = data[0];
      const requiredFields = ['department', 'number', 'title', 'credits', 'instructor'];
      const missingFields = [];
      
      for (const field of requiredFields) {
        if (!(field in course)) {
          missingFields.push(field);
        }
      }
      
      if (missingFields.length === 0) {
        this.pass('All required fields present in course object');
        console.log('✅ Course structure is valid');
        console.log('   Sample course:', course);
      } else {
        this.fail(`Missing required fields: ${missingFields.join(', ')}`);
        console.error('❌ Missing fields:', missingFields);
        console.log('   Received:', course);
      }
      
      // Check data types
      if (typeof course.credits !== 'number') {
        this.warn(`Credits should be a number, got ${typeof course.credits}`);
      }
      
    } catch (error) {
      this.fail(`Structure test failed: ${error.message}`);
    }
    console.log('');
  }

  pass(message) {
    this.results.passed.push(message);
  }

  fail(message) {
    this.results.failed.push(message);
  }

  warn(message) {
    this.results.warnings.push(message);
  }

  printSummary() {
    console.log('📊 TEST SUMMARY\n' + '='.repeat(50));
    console.log(`✅ Passed: ${this.results.passed.length}`);
    console.log(`❌ Failed: ${this.results.failed.length}`);
    console.log(`⚠️  Warnings: ${this.results.warnings.length}`);
    
    if (this.results.failed.length > 0) {
      console.log('\n❌ FAILURES:');
      this.results.failed.forEach(f => console.log(`  - ${f}`));
    }
    
    if (this.results.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.results.warnings.forEach(w => console.log(`  - ${w}`));
    }
    
    console.log('\n' + '='.repeat(50));
    
    // Action items
    console.log('\n🔧 ACTION ITEMS FOR BACKEND TEAM:');
    if (!this.results.passed.some(p => p.includes('accessible'))) {
      console.log('1. Start backend server on port 8080');
    }
    if (this.results.warnings.some(w => w.includes('accepted invalid'))) {
      console.log('2. Add validation for department codes (2-4 letters only)');
    }
    if (this.results.failed.some(f => f.includes('Missing required fields'))) {
      console.log('3. Ensure all courses include: department, number, title, credits, instructor');
    }
    if (this.results.failed.some(f => f.includes('Performance'))) {
      console.log('4. Optimize queries to respond within 2 seconds');
    }
  }
}

// Export for use
export async function runTests() {
  const tester = new APITester();
  return await tester.runTests();
}

// Also make it available globally for console testing
if (typeof window !== 'undefined') {
  window.apiTester = { runTests };
  console.log('💡 API Tester loaded. Run tests with: apiTester.runTests()');
}
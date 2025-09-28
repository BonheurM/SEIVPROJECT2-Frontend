# AC1 Rigorous Implementation Guide

## Core Principle: Start Minimal, Build Incrementally

### Phase 0: Requirements Analysis (DO NOT SKIP)

**Acceptance Criteria Breakdown:**
1. ✅ Search bar accepts department codes (2-4 characters)
2. ✅ Results show all courses for that department
3. ✅ Display: course number, title, credits, instructor
4. ✅ Results load within 2 seconds
5. ✅ Show "No courses found" for empty results

**What This ACTUALLY Means:**
- Input validation: ONLY 2-4 alphabetic characters (CS, MATH, ENG, etc.)
- Must show EXACTLY: course number, title, credits, instructor (not optional!)
- 2-second requirement is HARD - includes network + rendering
- Empty state is REQUIRED, not nice-to-have

### Phase 1: Absolute Minimum Working Version

**Step 1.1: Static Search (No API, Just Works)**

```vue
<!-- CourseSearchMinimal.vue -->
<template>
  <div>
    <input 
      v-model="dept" 
      @keyup.enter="search"
      placeholder="Enter dept code"
    />
    <button @click="search">Search</button>
    
    <div v-if="searching">Loading...</div>
    
    <div v-else-if="searched && courses.length === 0">
      No courses found for "{{ lastSearch }}"
    </div>
    
    <div v-else-if="courses.length > 0">
      <div v-for="course in courses" :key="course.id">
        {{ course.department }} {{ course.number }} - 
        {{ course.title }} ({{ course.credits }} credits) - 
        {{ course.instructor }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const dept = ref('');
const courses = ref([]);
const searching = ref(false);
const searched = ref(false);
const lastSearch = ref('');

// Hardcoded data to PROVE IT WORKS
const mockData = {
  'CS': [
    { id: 1, department: 'CS', number: '101', title: 'Intro to CS', credits: 3, instructor: 'Dr. Smith' }
  ]
};

function search() {
  // STRICT VALIDATION
  const cleaned = dept.value.trim().toUpperCase();
  if (!/^[A-Z]{2,4}$/.test(cleaned)) {
    alert('Department must be 2-4 letters');
    return;
  }
  
  searching.value = true;
  searched.value = false;
  lastSearch.value = cleaned;
  
  // Simulate API delay
  setTimeout(() => {
    courses.value = mockData[cleaned] || [];
    searching.value = false;
    searched.value = true;
  }, 300);
}
</script>
```

**Verification Checklist:**
- [ ] Can enter "CS" and see results? 
- [ ] Can enter "XYZ" and see "No courses found"?
- [ ] Does validation reject "C" (too short)?
- [ ] Does validation reject "ABCDE" (too long)?
- [ ] Does validation reject "CS1" (has number)?
- [ ] Shows ALL required fields (number, title, credits, instructor)?

### Phase 2: Add Real UI Components (Still No API)

**Step 2.1: Integrate Vuetify Properly**

```vue
<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-text-field
          v-model="dept"
          label="Department Code (e.g., CS, MATH)"
          :rules="[validateDept]"
          :error="showError"
          :error-messages="errorMsg"
          @keyup.enter="search"
          counter="4"
          clearable
        >
          <template v-slot:append-inner>
            <v-btn
              icon="mdi-magnify"
              variant="text"
              :loading="searching"
              @click="search"
            />
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    
    <!-- Results here -->
  </v-container>
</template>
```

**Critical Validation Rules:**
```js
function validateDept(value) {
  if (!value) return 'Required';
  const v = value.trim();
  if (v.length < 2) return 'Too short (min 2 characters)';
  if (v.length > 4) return 'Too long (max 4 characters)';
  if (!/^[A-Za-z]+$/.test(v)) return 'Letters only';
  return true;
}
```

### Phase 3: Performance Requirements

**Step 3.1: Implement 2-Second Timeout**

```js
async function searchWithTimeout(dept) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1900); // 100ms buffer
  
  try {
    const startTime = performance.now();
    const result = await apiClient.get('/courses', {
      params: { department: dept },
      signal: controller.signal
    });
    const elapsed = performance.now() - startTime;
    
    if (elapsed > 2000) {
      console.error(`Search took ${elapsed}ms - FAILED 2s requirement`);
    }
    
    return result.data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Search timeout - must complete within 2 seconds');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

### Phase 4: Robust Error Handling

**Step 4.1: Handle ALL Failure Cases**

```js
const ErrorStates = {
  VALIDATION: 'validation',
  TIMEOUT: 'timeout', 
  NETWORK: 'network',
  SERVER: 'server',
  UNKNOWN: 'unknown'
};

async function robustSearch() {
  try {
    // 1. Validation first
    const dept = validateAndClean(searchInput.value);
    
    // 2. Show loading immediately
    setLoading(true);
    
    // 3. Try API with timeout
    const courses = await searchWithTimeout(dept);
    
    // 4. Validate response format
    if (!Array.isArray(courses)) {
      throw new Error('Invalid response format');
    }
    
    // 5. Update UI
    displayCourses(courses);
    
  } catch (error) {
    // Specific error handling
    if (error instanceof ValidationError) {
      showError(ErrorStates.VALIDATION, error.message);
    } else if (error.message.includes('timeout')) {
      showError(ErrorStates.TIMEOUT, 'Search took too long. Try again.');
    } else if (error.message.includes('Network')) {
      showError(ErrorStates.NETWORK, 'Connection failed. Using offline data.');
      displayCourses(getOfflineData(dept));
    } else {
      showError(ErrorStates.UNKNOWN, 'Something went wrong. Please try again.');
    }
  } finally {
    setLoading(false);
  }
}
```

### Phase 5: Testing Rigorously

**Required Test Scenarios:**

1. **Valid Searches:**
   ```
   - "CS" → Shows CS courses
   - "cs" → Shows CS courses (case insensitive)
   - "  CS  " → Shows CS courses (trims whitespace)
   - "MATH" → Shows MATH courses
   ```

2. **Invalid Inputs:**
   ```
   - "C" → Error: Too short
   - "ABCDE" → Error: Too long  
   - "CS1" → Error: Letters only
   - "12" → Error: Letters only
   - "" → Error: Required
   - "   " → Error: Required
   ```

3. **Performance:**
   ```js
   // Add performance monitoring
   const measurePerformance = () => {
     const observer = new PerformanceObserver((list) => {
       list.getEntries().forEach((entry) => {
         if (entry.duration > 2000) {
           console.error(`PERFORMANCE VIOLATION: ${entry.name} took ${entry.duration}ms`);
         }
       });
     });
     observer.observe({ entryTypes: ['measure'] });
   };
   ```

4. **Edge Cases:**
   ```
   - Rapid searches (debouncing)
   - Search while previous search pending
   - Network failure mid-search
   - API returns non-array
   - API returns courses missing required fields
   ```

### Implementation Checklist

**Before Starting:**
- [ ] Read ALL acceptance criteria twice
- [ ] List what fields are REQUIRED (not optional)
- [ ] Note performance constraints (2 seconds)
- [ ] Identify all error states

**During Implementation:**
- [ ] Start with hardcoded data
- [ ] Add one feature at a time
- [ ] Test each feature before moving on
- [ ] Measure performance at each step
- [ ] Handle errors gracefully

**Before Declaring "Done":**
- [ ] All 5 acceptance criteria met?
- [ ] Tested with real users?
- [ ] Works on slow network?
- [ ] Accessible (keyboard navigation)?
- [ ] Mobile responsive?

### Common Pitfalls to AVOID

1. **"It works on my machine"**
   - Test with throttled network
   - Test with backend down
   - Test on actual mobile device

2. **"Close enough" validation**
   ```js
   // BAD: Accepts "CS123", "C", etc.
   if (dept.length > 0) { search(); }
   
   // GOOD: Exactly 2-4 letters
   if (/^[A-Z]{2,4}$/.test(dept.trim().toUpperCase())) { search(); }
   ```

3. **Missing required fields**
   ```js
   // BAD: "Oh, instructor email would be nice"
   // The requirement says: course number, title, credits, instructor
   // That's EXACTLY what you show. No more, no less.
   ```

4. **Ignoring performance**
   ```js
   // Add timing to EVERY search
   console.time('course-search');
   const result = await search();
   console.timeEnd('course-search');
   ```

### Final Acceptance Test Script

```js
// Run this before saying you're done
async function acceptanceTest() {
  console.log('=== AC1 ACCEPTANCE TEST ===');
  
  // Test 1: Valid search
  await testSearch('CS', shouldShow = true);
  
  // Test 2: Empty result  
  await testSearch('XYZ', shouldShow = false);
  
  // Test 3: Validation
  await testSearch('C', shouldFail = true);
  await testSearch('ABCDE', shouldFail = true);
  
  // Test 4: Performance
  const start = Date.now();
  await testSearch('MATH');
  const elapsed = Date.now() - start;
  assert(elapsed < 2000, `Search took ${elapsed}ms - FAILED 2s requirement`);
  
  // Test 5: Required fields
  const course = document.querySelector('.course-card');
  assert(course.textContent.includes('101')); // number
  assert(course.textContent.includes('Introduction')); // title  
  assert(course.textContent.includes('3')); // credits
  assert(course.textContent.includes('Smith')); // instructor
  
  console.log('✅ ALL TESTS PASSED');
}
```

## Summary

**The Right Way:**
1. Read requirements carefully
2. Build the absolute minimum
3. Test that it works
4. Add complexity gradually
5. Test at each step
6. Measure performance throughout
7. Handle all error cases
8. Test again

**Remember:** 
- "It basically works" is NOT good enough
- Every acceptance criteria is a REQUIREMENT
- If it says "2 seconds", that means 2.0 seconds, not 2.5
- If it says "show X, Y, Z", show EXACTLY X, Y, and Z

This is how you build software that actually works, not just demos well.
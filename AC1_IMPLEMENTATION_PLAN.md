# AC1 Implementation Plan: Basic Course Search

## Overview
This document outlines the implementation plan for User Story 1.1: Basic Course Search. This will set the foundation for transitioning from a tutorial system to a course listing system.

## Current State
- We have a working Vue 3 + Vuetify application
- Currently displays tutorials (will be replaced with courses)
- Backend API is at `http://localhost:8080/tutorial-simple/`
- Existing components use Vuetify with OC custom theme colors

## Acceptance Criteria Breakdown
1. ✅ Search bar accepts department codes (2-4 characters)
2. ✅ Results show all courses for that department
3. ✅ Display: course number, title, credits, instructor
4. ✅ Results load within 2 seconds
5. ✅ Show "No courses found" for empty results

## Implementation Steps

### Phase 1: Setup & Structure (Minimal Changes)
1. **Update Navigation** 
   - Add "Course Search" to MenuBar
   - Keep existing tutorial routes temporarily
   - Add route for `/courses`

2. **Create Service Layer**
   - Create `courseServices.js` similar to existing services
   - Endpoints needed:
     - `GET /courses/search?dept={deptCode}`
     - `GET /courses/{id}`

3. **Create Placeholder Components**
   - `CourseSearch.vue` - Main search page
   - `CourseCard.vue` - Individual course display component

### Phase 2: Core Components

#### CourseSearch.vue Structure
```vue
<template>
  <v-container>
    <!-- Search Section -->
    <v-row>
      <v-col cols="12" md="8" class="mx-auto">
        <v-card class="pa-4">
          <v-text-field
            v-model="searchQuery"
            label="Search by Department Code (e.g., CS, MATH, ENG)"
            append-icon="mdi-magnify"
            @keyup.enter="searchCourses"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Results Section -->
    <v-row class="mt-4">
      <!-- Course cards will go here -->
    </v-row>
  </v-container>
</template>
```

#### CourseCard.vue Structure
```vue
<template>
  <v-card>
    <v-card-title>{{ course.department }} {{ course.number }} - {{ course.title }}</v-card-title>
    <v-card-text>
      <v-chip small>{{ course.credits }} credits</v-chip>
      <p>Instructor: {{ course.instructor }}</p>
    </v-card-text>
  </v-card>
</template>
```

### Phase 3: State Management
- Use Vue 3 Composition API with `ref` and `reactive`
- Local component state for search (no Vuex needed yet)
- Loading states and error handling

### Phase 4: Styling Approach
- Use existing Vuetify theme colors:
  ```js
  primary: "#80162B"    // OC Red
  secondary: "#E1E1E1"  // Light Gray
  accent: "#47121D"     // Dark Red
  ```
- Keep consistent with existing card styles
- Responsive grid layout (works on mobile)

## Technical Tasks Checklist

### Frontend Tasks
- [ ] Update router.js with course search route
- [ ] Add Course Search link to MenuBar.vue
- [ ] Create views/CourseSearch.vue component
- [ ] Create components/CourseCard.vue component
- [ ] Create services/courseServices.js
- [ ] Add search functionality with debouncing
- [ ] Implement loading states
- [ ] Add "No courses found" message
- [ ] Add error handling for API failures

### Backend Coordination Needed
- [ ] Confirm API endpoint structure
- [ ] Define course data model:
  ```json
  {
    "id": 1,
    "department": "CS",
    "number": "101",
    "title": "Introduction to Computer Science",
    "credits": 3,
    "instructor": "Dr. Smith",
    "description": "...",
    "prerequisites": []
  }
  ```

## File Structure After Implementation
```
src/
├── components/
│   ├── MenuBar.vue (updated)
│   └── CourseCard.vue (new)
├── services/
│   ├── courseServices.js (new)
│   └── ... (existing services)
├── views/
│   ├── CourseSearch.vue (new)
│   └── ... (existing views)
└── router.js (updated)
```

## Migration Strategy
1. Add new course features alongside existing tutorial features
2. Test course search thoroughly
3. Once stable, gradually phase out tutorial components
4. Update backend endpoints from `/tutorial-simple/` to `/course-api/`

## Testing Approach
- Manual testing of search functionality
- Test department codes: CS, MATH, ENG, etc.
- Test edge cases: empty results, invalid codes
- Performance testing (must load < 2 seconds)
- Mobile responsiveness testing

## Next Steps for Team
1. Review this plan and provide feedback
2. Backend team: Confirm API structure
3. Frontend team: Start with Phase 1 tasks
4. Set up daily standup to track progress
5. Target completion: 3-5 days

## Notes
- We're keeping the existing Vuetify setup and theme
- Using composition API pattern matching existing code
- Minimal changes to current structure
- Focus on getting basic search working first
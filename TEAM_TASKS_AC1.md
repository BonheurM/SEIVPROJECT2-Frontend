# Team Tasks for AC1: Basic Course Search

## What Has Been Done (Initial Setup)

### 1. Created CourseSearch Component
- **File**: `src/views/CourseSearch.vue`
- **Features Implemented**:
  - Search input field with department code validation (2-4 characters)
  - Basic search functionality with placeholder data
  - Loading states and error handling
  - Empty state message
  - Responsive layout using Vuetify grid

### 2. Updated Navigation
- **File**: `src/components/MenuBar.vue`
- **Changes**:
  - Changed app title to "Course Listing System"
  - Added "Course Search" button as primary action
  - Kept tutorial links temporarily

### 3. Added Course Route
- **File**: `src/router.js`
- **Changes**:
  - Added `/courses` route pointing to CourseSearch component

### 4. Created Service Layer Template
- **File**: `src/services/courseServices.js`
- **Features**:
  - Basic API structure for course endpoints
  - Search by department method
  - Filter methods for future use

## Team Task Assignments

### Team Member 1: Backend API Developer
**Priority**: HIGH - Others depend on this!
**Time Estimate**: 1-2 days

**Tasks**:
1. Create Course API endpoints in backend:
   ```
   GET /courses/search?dept={deptCode}
   GET /courses?page={page}&limit={limit}
   GET /courses/{id}
   ```

2. Course data model should include:
   ```json
   {
     "id": 1,
     "department": "CS",
     "number": "101",
     "title": "Introduction to Computer Science",
     "credits": 3,
     "instructor": "Dr. Smith",
     "instructorEmail": "smith@university.edu",
     "description": "Basic programming concepts...",
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
   ```

3. Add database indexes on department field for performance
4. Create sample data for testing (CS, MATH, ENG departments)
5. Ensure responses are under 2 seconds

**Deliverables**:
- [ ] API documentation
- [ ] Postman collection for testing
- [ ] Sample data script

### Team Member 2: Course Card Component Developer
**Priority**: HIGH
**Time Estimate**: 1 day

**Tasks**:
1. Create `src/components/CourseCard.vue`
   - Display all course information elegantly
   - Use Vuetify card with OC theme colors
   - Show enrollment status (25/30 students)
   - Add hover effects
   - Make it responsive

2. Update CourseSearch.vue to use CourseCard:
   - Replace the inline card in CourseSearch with CourseCard component
   - Pass course data as props

**Code Template to Start With**:
```vue
<template>
  <v-card elevation="2" class="h-100 course-card">
    <v-card-title>
      <span class="text-primary">{{ course.department }} {{ course.number }}</span>
      <v-spacer />
      <v-chip small :color="enrollmentColor">
        {{ course.enrollment.current }}/{{ course.enrollment.capacity }}
      </v-chip>
    </v-card-title>
    <!-- Add more course details -->
  </v-card>
</template>

<script setup>
// Add props and computed properties
</script>
```

**Deliverables**:
- [ ] CourseCard.vue component
- [ ] Updated CourseSearch.vue
- [ ] Screenshot of component

### Team Member 3: Search Enhancement Developer
**Priority**: MEDIUM
**Time Estimate**: 1-2 days

**Tasks**:
1. Enhance search functionality in CourseSearch.vue:
   - Add debouncing (wait 500ms after typing stops)
   - Add search history (last 5 searches)
   - Implement auto-suggestions for department codes
   - Add clear search button
   - Show number of results

2. Connect to real API:
   - Import courseServices
   - Replace placeholder data with actual API calls
   - Handle API errors gracefully

3. Add search analytics:
   - Track popular searches
   - Log search response times

**Deliverables**:
- [ ] Enhanced search with debouncing
- [ ] Connected to real API
- [ ] Error handling implemented

### Team Member 4: Filter Feature Developer
**Priority**: MEDIUM
**Time Estimate**: 2 days

**Tasks**:
1. Create filter sidebar in CourseSearch.vue:
   ```
   - Time filters: Morning/Afternoon/Evening
   - Day filters: MWF/TTH/MW/Online
   - Level filters: 100/200/300/400
   - Credits: 1/2/3/4+
   ```

2. Implementation requirements:
   - Use Vuetify expansion panels or navigation drawer
   - Show count next to each filter option
   - Multiple filters work together (AND logic)
   - Clear all filters button
   - Persist filter state in URL params

3. Update courseServices.js:
   - Use the searchWithFilters method
   - Build query parameters properly

**UI Mockup**:
```
┌─────────────────┐
│ Filters         │
├─────────────────┤
│ ▼ Time          │
│   ☐ Morning (23)│
│   ☐ Afternoon   │
│   ☐ Evening (5) │
├─────────────────┤
│ ▼ Days          │
│   ☐ MWF (45)    │
│   ☐ TTH (38)    │
└─────────────────┘
```

**Deliverables**:
- [ ] Filter UI component
- [ ] Working filter logic
- [ ] URL parameter persistence

### Team Member 5: Testing & Documentation Lead
**Priority**: MEDIUM (Ongoing)
**Time Estimate**: Throughout sprint

**Tasks**:
1. Create test scenarios for course search:
   - Valid department codes
   - Invalid inputs
   - Empty results
   - Network errors
   - Performance testing (<2 second requirement)

2. Write component tests:
   - Unit tests for CourseSearch.vue
   - Unit tests for CourseCard.vue
   - Integration tests for search flow

3. Documentation:
   - Update README with setup instructions
   - Document API endpoints
   - Create user guide for course search
   - Add JSDoc comments to all methods

4. Accessibility testing:
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast verification

**Test Coverage Goals**:
- [ ] 80% code coverage
- [ ] All acceptance criteria tested
- [ ] Performance benchmarks documented

**Deliverables**:
- [ ] Test suite
- [ ] Documentation updates
- [ ] Accessibility report

## Git Workflow & Coordination

### Branch Strategy
```
main
  └── dev
       ├── feature/api-course-endpoints (Member 1)
       ├── feature/course-card-component (Member 2)
       ├── feature/search-enhancements (Member 3)
       ├── feature/course-filters (Member 4)
       └── feature/testing-docs (Member 5)
```

### Daily Workflow
1. **Morning (9 AM)**:
   - Pull latest from dev branch
   - Create/update your feature branch
   - Post status in team chat

2. **Midday (12 PM)**:
   - Quick sync meeting (15 min)
   - Share blockers

3. **End of Day (5 PM)**:
   - Commit and push your changes
   - Create PR if feature is ready
   - Update task status

### Pull Request Requirements
- [ ] Code follows existing style
- [ ] Tests written and passing
- [ ] No console errors
- [ ] Responsive design verified
- [ ] At least one peer review
- [ ] Screenshots included

## Communication Plan

### Slack/Teams Channels
- `#ac1-general` - General discussion
- `#ac1-backend` - API questions
- `#ac1-frontend` - UI/UX discussion
- `#ac1-blockers` - Urgent issues

### Key Contacts
- **Backend API**: Member 1
- **UI Components**: Member 2 & 3
- **Features**: Member 4
- **Quality**: Member 5

## Success Criteria Checklist

### Acceptance Criteria Status
- [ ] Search accepts 2-4 character department codes
- [ ] Results show: course number, title, credits, instructor
- [ ] Results load within 2 seconds
- [ ] "No courses found" message for empty results
- [ ] Responsive on mobile devices

### Additional Goals
- [ ] Clean, intuitive UI
- [ ] Smooth transitions
- [ ] Error resilience
- [ ] Accessible to all users

## Timeline
- **Day 1-2**: Backend API (Member 1) + Course Card (Member 2)
- **Day 2-3**: Search Enhancement (Member 3) + Filters (Member 4)
- **Day 3-4**: Integration + Testing (All members)
- **Day 5**: Polish + Documentation + Demo prep

## Questions for Product Owner
1. Should search be case-sensitive?
2. How many results per page?
3. Should we cache search results?
4. What happens when courses are full?
5. Do we need search analytics?

---

**Remember**: 
- Communicate early and often
- Ask for help when stuck
- Test your changes before PR
- Keep the user experience in mind
- Have fun building this! 🚀
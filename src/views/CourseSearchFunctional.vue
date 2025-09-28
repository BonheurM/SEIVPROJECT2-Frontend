<script setup>
import { ref, computed, onMounted } from "vue";
import CourseCard from "../components/CourseCard.vue";

// Core state for search
const searchQuery = ref("");
const courses = ref([]);
const allCourses = ref([]); // Store all courses for filtering
const loading = ref(false);
const touched = ref(false);

// Schedule state (Story 2.1)
const schedule = ref([]);
const showSchedule = ref(false);
const scheduleDialog = ref(false);

// Filter states (Story 1.2)
const filters = ref({
  time: [], // morning, afternoon, evening
  days: [], // MWF, TTH, MW, Online
  level: [], // 100, 200, 300, 400
});

// Mock data with all required fields
const mockData = {
  CS: [
    {
      id: 1,
      department: "CS",
      number: "101",
      title: "Introduction to Computer Science",
      credits: 3,
      instructor: "Dr. Smith",
      instructorEmail: "smith@university.edu",
      description: "An introduction to computer science and programming fundamentals.",
      level: 100,
      schedule: {
        days: "MWF",
        time: "10:00-11:00",
        timeSlot: "morning",
        location: "Room 101"
      },
      enrollment: { current: 25, capacity: 30 },
      prerequisites: []
    },
    {
      id: 2,
      department: "CS",
      number: "201",
      title: "Data Structures",
      credits: 4,
      instructor: "Dr. Johnson",
      instructorEmail: "johnson@university.edu",
      description: "Study of fundamental data structures and algorithms.",
      level: 200,
      schedule: {
        days: "TTH",
        time: "14:00-15:30",
        timeSlot: "afternoon",
        location: "Lab 203"
      },
      enrollment: { current: 28, capacity: 30 },
      prerequisites: ["CS 101"]
    },
    {
      id: 3,
      department: "CS",
      number: "301",
      title: "Database Systems",
      credits: 3,
      instructor: "Dr. Chen",
      instructorEmail: "chen@university.edu",
      description: "Design and implementation of database systems.",
      level: 300,
      schedule: {
        days: "MW",
        time: "16:00-17:30",
        timeSlot: "afternoon",
        location: "Room 305"
      },
      enrollment: { current: 20, capacity: 25 },
      prerequisites: ["CS 201"]
    },
    {
      id: 4,
      department: "CS",
      number: "401",
      title: "Machine Learning",
      credits: 3,
      instructor: "Dr. Park",
      instructorEmail: "park@university.edu",
      description: "Introduction to machine learning algorithms and applications.",
      level: 400,
      schedule: {
        days: "Online",
        time: "Asynchronous",
        timeSlot: "online",
        location: "Online"
      },
      enrollment: { current: 35, capacity: 50 },
      prerequisites: ["CS 301", "MATH 210"]
    }
  ],
  MATH: [
    {
      id: 5,
      department: "MATH",
      number: "110",
      title: "Calculus I",
      credits: 4,
      instructor: "Dr. Williams",
      instructorEmail: "williams@university.edu",
      description: "Introduction to differential and integral calculus.",
      level: 100,
      schedule: {
        days: "MTWTH",
        time: "09:00-10:00",
        timeSlot: "morning",
        location: "Math Building 101"
      },
      enrollment: { current: 45, capacity: 50 },
      prerequisites: []
    },
    {
      id: 6,
      department: "MATH",
      number: "210",
      title: "Calculus II",
      credits: 4,
      instructor: "Dr. Brown",
      instructorEmail: "brown@university.edu",
      description: "Continuation of Calculus I, integration techniques and series.",
      level: 200,
      schedule: {
        days: "MWF",
        time: "18:00-19:30",
        timeSlot: "evening",
        location: "Math Building 102"
      },
      enrollment: { current: 38, capacity: 40 },
      prerequisites: ["MATH 110"]
    }
  ],
  ENG: [
    {
      id: 7,
      department: "ENG",
      number: "101",
      title: "English Composition I",
      credits: 3,
      instructor: "Prof. Davis",
      instructorEmail: "davis@university.edu",
      description: "Development of critical reading and writing skills.",
      level: 100,
      schedule: {
        days: "TTH",
        time: "10:00-11:30",
        timeSlot: "morning",
        location: "Liberal Arts 201"
      },
      enrollment: { current: 22, capacity: 25 },
      prerequisites: []
    }
  ]
};

// Validation
const validateDept = (v) => /^[A-Za-z]{2,4}$/.test(String(v).trim());

// Search functionality
async function searchCourses() {
  touched.value = true;
  
  if (!validateDept(searchQuery.value)) {
    courses.value = [];
    allCourses.value = [];
    return;
  }
  
  loading.value = true;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const dept = searchQuery.value.trim().toUpperCase();
  const results = mockData[dept] || [];
  
  // Store unfiltered results
  allCourses.value = results;
  
  // Apply filters
  applyFilters();
  
  loading.value = false;
}

// Filter functionality
function applyFilters() {
  let filtered = [...allCourses.value];
  
  // Time filter
  if (filters.value.time.length > 0) {
    filtered = filtered.filter(course => 
      filters.value.time.includes(course.schedule.timeSlot)
    );
  }
  
  // Days filter
  if (filters.value.days.length > 0) {
    filtered = filtered.filter(course => 
      filters.value.days.includes(course.schedule.days)
    );
  }
  
  // Level filter
  if (filters.value.level.length > 0) {
    filtered = filtered.filter(course => 
      filters.value.level.includes(course.level.toString())
    );
  }
  
  courses.value = filtered;
}

// Toggle filter selection
function toggleFilter(category, value) {
  const index = filters.value[category].indexOf(value);
  if (index > -1) {
    filters.value[category].splice(index, 1);
  } else {
    filters.value[category].push(value);
  }
  applyFilters();
}

// Clear all filters
function clearFilters() {
  filters.value = {
    time: [],
    days: [],
    level: []
  };
  applyFilters();
}

// Get count for each filter option
function getFilterCount(category, value) {
  let count = 0;
  for (const course of allCourses.value) {
    if (category === 'time' && course.schedule.timeSlot === value) count++;
    if (category === 'days' && course.schedule.days === value) count++;
    if (category === 'level' && course.level === parseInt(value)) count++;
  }
  return count;
}

// Messages
const searchMessage = computed(() => {
  if (!touched.value) return "";
  
  if (!validateDept(searchQuery.value)) {
    return "Please enter a valid department code (2-4 letters)";
  }
  
  if (loading.value) return "Searching...";
  
  if (allCourses.value.length === 0) {
    return `No courses found for "${searchQuery.value.toUpperCase()}"`;
  }
  
  const filterCount = filters.value.time.length + filters.value.days.length + filters.value.level.length;
  if (filterCount > 0 && courses.value.length !== allCourses.value.length) {
    return `Showing ${courses.value.length} of ${allCourses.value.length} courses (filtered)`;
  }
  
  return `Found ${courses.value.length} course${courses.value.length !== 1 ? 's' : ''} for "${searchQuery.value.toUpperCase()}"`;
});

const hasActiveFilters = computed(() => {
  return filters.value.time.length > 0 || 
         filters.value.days.length > 0 || 
         filters.value.level.length > 0;
});

// Schedule management
const totalCredits = computed(() => {
  return schedule.value.reduce((sum, course) => sum + course.credits, 0);
});

const canAddMoreCredits = computed(() => totalCredits.value < 18);

function addToSchedule(course) {
  // Check if already in schedule
  if (schedule.value.some(c => c.id === course.id)) {
    alert('This course is already in your schedule');
    return;
  }
  
  // Check credit limit
  if (totalCredits.value + course.credits > 18) {
    alert(`Cannot add ${course.credits} credits. Maximum 18 credits allowed. Current: ${totalCredits.value}`);
    return;
  }
  
  // Check for time conflicts
  const conflict = checkTimeConflict(course);
  if (conflict) {
    alert(`Time conflict with ${conflict.department} ${conflict.number} on ${conflict.schedule.days} at ${conflict.schedule.time}`);
    return;
  }
  
  // Add to schedule
  schedule.value.push(course);
  
  // Save to localStorage
  localStorage.setItem('courseSchedule', JSON.stringify(schedule.value));
  
  // Show confirmation
  showSchedule.value = true;
}

function removeFromSchedule(courseId) {
  schedule.value = schedule.value.filter(c => c.id !== courseId);
  localStorage.setItem('courseSchedule', JSON.stringify(schedule.value));
}

function checkTimeConflict(newCourse) {
  // Skip online courses
  if (newCourse.schedule.days === 'Online') return null;
  
  for (const course of schedule.value) {
    // Skip online courses
    if (course.schedule.days === 'Online') continue;
    
    // Check if days overlap
    const daysOverlap = checkDaysOverlap(course.schedule.days, newCourse.schedule.days);
    if (!daysOverlap) continue;
    
    // Check if times overlap
    const timesOverlap = checkTimesOverlap(course.schedule.time, newCourse.schedule.time);
    if (timesOverlap) {
      return course;
    }
  }
  
  return null;
}

function checkDaysOverlap(days1, days2) {
  const dayMap = {
    'M': 'Monday',
    'T': 'Tuesday', 
    'W': 'Wednesday',
    'TH': 'Thursday',
    'F': 'Friday'
  };
  
  // Convert day strings to arrays
  const days1Array = days1.replace('TH', 'H').split('').map(d => d === 'H' ? 'TH' : d);
  const days2Array = days2.replace('TH', 'H').split('').map(d => d === 'H' ? 'TH' : d);
  
  // Check for any common days
  return days1Array.some(day => days2Array.includes(day));
}

function checkTimesOverlap(time1, time2) {
  // Parse times (format: "HH:MM-HH:MM")
  const [start1, end1] = time1.split('-').map(t => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  });
  
  const [start2, end2] = time2.split('-').map(t => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  });
  
  // Check if times overlap
  return !(end1 <= start2 || end2 <= start1);
}

// Load schedule from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('courseSchedule');
  if (saved) {
    schedule.value = JSON.parse(saved);
  }
});
</script>

<template>
  <v-container fluid>
    <v-row>
      <!-- Search Section -->
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5 text-primary">Course Search</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="searchQuery"
                  label="Search by Department Code (e.g., CS, MATH, ENG)"
                  variant="outlined"
                  append-inner-icon="mdi-magnify"
                  :loading="loading"
                  :clearable="!loading"
                  :error="touched && !validateDept(searchQuery)"
                  :error-messages="touched && !validateDept(searchQuery) ? ['Enter 2-4 letters'] : []"
                  @keyup.enter="searchCourses"
                  @click:append-inner="searchCourses"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-btn
                  color="primary"
                  size="large"
                  block
                  :loading="loading"
                  :disabled="loading || !validateDept(searchQuery)"
                  @click="searchCourses"
                >
                  Search Courses
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Area -->
    <v-row v-if="allCourses.length > 0" class="mt-4">
      <!-- Filters Sidebar -->
      <v-col cols="12" md="3">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Filters</span>
            <v-btn
              v-if="hasActiveFilters"
              size="small"
              variant="text"
              @click="clearFilters"
            >
              Clear all
            </v-btn>
          </v-card-title>
          
          <!-- Time Filter -->
          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>
                Time of Day
                <v-chip v-if="filters.time.length" size="x-small" class="ml-2">
                  {{ filters.time.length }}
                </v-chip>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="compact">
                  <v-list-item
                    v-for="time in ['morning', 'afternoon', 'evening']"
                    :key="time"
                    @click="toggleFilter('time', time)"
                  >
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :model-value="filters.time.includes(time)"
                        density="compact"
                      />
                    </template>
                    <v-list-item-title>
                      {{ time.charAt(0).toUpperCase() + time.slice(1) }}
                      <span class="text-grey ml-1">({{ getFilterCount('time', time) }})</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Days Filter -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                Days
                <v-chip v-if="filters.days.length" size="x-small" class="ml-2">
                  {{ filters.days.length }}
                </v-chip>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="compact">
                  <v-list-item
                    v-for="day in ['MWF', 'TTH', 'MW', 'MTWTH', 'Online']"
                    :key="day"
                    @click="toggleFilter('days', day)"
                  >
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :model-value="filters.days.includes(day)"
                        density="compact"
                      />
                    </template>
                    <v-list-item-title>
                      {{ day }}
                      <span class="text-grey ml-1">({{ getFilterCount('days', day) }})</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Level Filter -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                Course Level
                <v-chip v-if="filters.level.length" size="x-small" class="ml-2">
                  {{ filters.level.length }}
                </v-chip>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="compact">
                  <v-list-item
                    v-for="level in ['100', '200', '300', '400']"
                    :key="level"
                    @click="toggleFilter('level', level)"
                  >
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :model-value="filters.level.includes(level)"
                        density="compact"
                      />
                    </template>
                    <v-list-item-title>
                      {{ level }}-level
                      <span class="text-grey ml-1">({{ getFilterCount('level', level) }})</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>

      <!-- Course Results -->
      <v-col cols="12" md="9">
        <p class="text-subtitle-1 mb-2">{{ searchMessage }}</p>
        
        <v-row>
          <v-col
            v-for="course in courses"
            :key="course.id"
            cols="12"
            lg="6"
          >
            <CourseCard 
              :course="course" 
              @add-to-schedule="addToSchedule"
            />
          </v-col>
        </v-row>
        
        <!-- No results after filtering -->
        <v-card 
          v-if="courses.length === 0 && allCourses.length > 0"
          class="pa-8 text-center"
          variant="outlined"
        >
          <v-icon size="48" color="grey">mdi-filter-off</v-icon>
          <p class="text-h6 mt-2">No courses match your filters</p>
          <v-btn @click="clearFilters" color="primary" class="mt-2">
            Clear Filters
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else-if="touched && !loading && allCourses.length === 0" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">
          mdi-magnify
        </v-icon>
        <p class="text-h6 text-grey-darken-1">{{ searchMessage }}</p>
        <p class="text-body-2 text-grey">
          Try searching for CS, MATH, or ENG
        </p>
      </v-col>
    </v-row>
  </v-container>
  
  <!-- Floating Schedule Button -->
  <v-btn
    v-if="schedule.length > 0"
    color="primary"
    icon
    size="large"
    style="position: fixed; bottom: 20px; right: 20px;"
    @click="scheduleDialog = true"
  >
    <v-badge
      :content="schedule.length"
      color="error"
    >
      <v-icon>mdi-calendar-check</v-icon>
    </v-badge>
  </v-btn>
  
  <!-- Schedule Dialog -->
  <v-dialog v-model="scheduleDialog" max-width="800">
    <v-card>
      <v-card-title class="text-h5 bg-primary text-white">
        My Schedule
        <v-spacer></v-spacer>
        <v-chip color="white" text-color="primary">
          {{ totalCredits }}/18 credits
        </v-chip>
      </v-card-title>
      
      <v-card-text class="pa-0">
        <v-list v-if="schedule.length > 0">
          <v-list-item
            v-for="(course, index) in schedule"
            :key="course.id"
            :class="index % 2 === 0 ? 'bg-grey-lighten-4' : ''"
          >
            <v-list-item-title>
              {{ course.department }} {{ course.number }} - {{ course.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ course.schedule.days }} {{ course.schedule.time }} | 
              {{ course.credits }} credits | 
              {{ course.instructor }}
            </v-list-item-subtitle>
            
            <template v-slot:append>
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="error"
                @click="removeFromSchedule(course.id)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
        
        <v-alert
          v-else
          type="info"
          variant="tonal"
          class="ma-4"
        >
          Your schedule is empty. Add courses from the search results.
        </v-alert>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions>
        <v-btn
          variant="text"
          @click="scheduleDialog = false"
        >
          Close
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          variant="flat"
          :disabled="schedule.length === 0"
        >
          <v-icon start>mdi-download</v-icon>
          Export Schedule
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
  <!-- Schedule Added Snackbar -->
  <v-snackbar
    v-model="showSchedule"
    :timeout="3000"
    color="success"
  >
    Course added to schedule!
    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="showSchedule = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
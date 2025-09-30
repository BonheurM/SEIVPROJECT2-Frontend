<script setup>
import { ref, onMounted, computed, watch } from "vue";
import CourseServices from "../services/courseServices";
import CourseCard from "../components/CourseCard.vue";
import AddCourseModal from "../components/AddCourseModal.vue";
const showAddCourse = ref(false);

// Handler for when a new course is created
const handleCourseCreated = async (newCourse) => {
  // Map form fields to backend fields
  const payload = {
    name: newCourse.title,
    courseNumber: newCourse.courseNumber,
    hours: newCourse.credits,
    level: newCourse.level,
    description: newCourse.description
  };
  try {
    await fetch("http://localhost:8080/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    searchCourses(); // Refresh course list
  } catch (e) {
    alert("Failed to add course");
  }
};

const searchQuery = ref("");
const courses = ref([]);
const loading = ref(false);
const selectedDepartment = ref("");
const departments = ref([]);
const selectedLevel = ref("");

const levelOptions = [
  { title: "All Levels", value: "" },
  { title: "Basic (0-99)", value: "0" },
  { title: "Introductory (100-199)", value: "100" },
  { title: "Intermediate (200-299)", value: "200" },
  { title: "Upper Division (300-399)", value: "300" },
  { title: "Graduate (400+)", value: "400" },
];

const searchCourses = async () => {
  loading.value = true;
  try {
    const params = {};
    
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    
    if (selectedDepartment.value) {
      params.dept = selectedDepartment.value;
    }
    
    if (selectedLevel.value) {
      params.minLevel = selectedLevel.value;
      params.maxLevel = selectedLevel.value === "400" ? "999" : String(parseInt(selectedLevel.value) + 99);
    }

    const response = await fetch(
      `http://localhost:8080/api/courses?${new URLSearchParams(params)}`
    );
    const data = await response.json();
    courses.value = data;
  } catch (error) {
    console.error("Error searching courses:", error);
    courses.value = [];
  } finally {
    loading.value = false;
  }
};

// Simple debounce implementation
let searchTimeout = null;
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    searchCourses();
  }, 300);
};

watch([searchQuery, selectedDepartment, selectedLevel], () => {
  debouncedSearch();
});

const loadDepartments = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/courses/departments");
    const data = await response.json();
    departments.value = data.map(dept => ({ title: dept, value: dept }));
    departments.value.unshift({ title: "All Departments", value: "" });
  } catch (error) {
    console.error("Error loading departments:", error);
  }
};

onMounted(() => {
  searchCourses();
  loadDepartments();
});

const clearFilters = () => {
  searchQuery.value = "";
  selectedDepartment.value = "";
  selectedLevel.value = "";
};

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedDepartment.value || selectedLevel.value;
});
</script>

<template>
  <v-container fluid>
    <!-- Header Section -->

    <v-row>
      <v-col cols="12" class="d-flex align-center justify-center position-relative">
        <h1 class="text-h3 text-center text-primary mb-2 flex-grow-1">Course Catalog</h1>
        <v-btn color="primary" class="ml-auto" @click="showAddCourse = true">
          <v-icon left>mdi-plus</v-icon>
          Add Course
        </v-btn>
      </v-col>
      <v-col cols="12">
        <p class="text-center text-subtitle-1 text-grey-darken-1">
          Browse Oklahoma Christian University's complete course offerings
        </p>
      </v-col>
    </v-row>
  <AddCourseModal
    v-model:show="showAddCourse"
    @course-created="handleCourseCreated"
  />

    <!-- Search and Filter Section -->
    <v-row class="my-4">
      <v-col cols="12" lg="10" class="mx-auto">
        <v-card class="pa-4" elevation="2">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchQuery"
                label="Search courses..."
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                clearable
                placeholder="Name, number, or keyword"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedDepartment"
                :items="departments"
                label="Department"
                variant="outlined"
                prepend-inner-icon="mdi-school"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedLevel"
                :items="levelOptions"
                label="Course Level"
                variant="outlined"
                prepend-inner-icon="mdi-stairs"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="2" class="d-flex align-center">
              <v-btn
                block
                color="grey"
                variant="outlined"
                @click="clearFilters"
                :disabled="!hasActiveFilters"
              >
                <v-icon start>mdi-filter-remove</v-icon>
                Clear
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Course Count -->
    <v-row v-if="!loading">
      <v-col cols="12" class="text-center">
        <v-chip color="primary" variant="flat">
          {{ courses.length }} {{ courses.length === 1 ? 'course' : 'courses' }} found
        </v-chip>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="60"
          :width="6"
        />
        <p class="mt-4 text-subtitle-1">Searching courses...</p>
      </v-col>
    </v-row>

    <!-- Course Grid -->
    <v-row v-else-if="courses.length > 0" class="mt-4">
      <v-col
        v-for="course in courses"
        :key="course.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <CourseCard :course="course" />
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else class="mt-8">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">
          mdi-magnify-close
        </v-icon>
        <p class="text-h6 text-grey-darken-1">No courses found</p>
        <p class="text-body-2 text-grey">
          Try adjusting your search criteria
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
:deep(.v-field__prepend-inner) {
  padding-top: 0 !important;
}
</style>
<script setup>
import { ref, onMounted, computed, watch } from "vue";
import CourseServices from "../services/courseServices";
import CourseCard from "../components/CourseCard.vue";
import AddCourseModal from "../components/AddCourseModal.vue";
import EditCourseModal from "../components/EditCourseModal.vue";
const showAddCourse = ref(false);
const showEditCourse = ref(false);
const courseToEdit = ref(null);
const showDeleteConfirm = ref(false);
const courseToDelete = ref(null);

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
    await apiClient.post("/api/courses", payload);
    searchCourses(); // Refresh course list
    showAddCourse.value = false; // Close the modal
  } catch (e) {
    console.error("Failed to add course:", e);
    alert("Failed to add course");
  }
};

// Handler for editing a course
const handleEditCourse = (course) => {
  courseToEdit.value = course;
  showEditCourse.value = true;
};

// Handler for updating a course
const handleCourseUpdated = async (updatedCourse) => {
  try {
    await apiClient.put(`/api/courses/${updatedCourse.id}`, updatedCourse);
    searchCourses(); // Refresh course list
    showEditCourse.value = false;
  } catch (e) {
    console.error("Failed to update course:", e);
    alert("Failed to update course");
  }
};

// Handler for deleting a course
const handleDeleteCourse = (course) => {
  courseToDelete.value = course;
  showDeleteConfirm.value = true;
};

// Confirm delete
const confirmDelete = async () => {
  if (!courseToDelete.value) return;
  
  try {
    await apiClient.delete(`/api/courses/${courseToDelete.value.id}`);
    searchCourses(); // Refresh course list
    showDeleteConfirm.value = false;
    courseToDelete.value = null;
  } catch (e) {
    console.error("Failed to delete course:", e);
    alert("Failed to delete course");
  }
};

import apiClient from "@/services/services";

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

    const response = await apiClient.get("/api/courses", { params });
    courses.value = response.data;
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
    const response = await apiClient.get("/api/courses/departments");
    departments.value = response.data.map(dept => ({ title: dept, value: dept }));
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
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 text-center mb-2">Course Catalog</h1>
        <p class="text-subtitle-1 text-center text-grey-darken-1">
          Browse Oklahoma Christian University's complete course offerings
        </p>
      </v-col>
    </v-row>
  <AddCourseModal
    v-model:show="showAddCourse"
    @course-created="handleCourseCreated"
  />
  
  <EditCourseModal
    v-model:show="showEditCourse"
    :course="courseToEdit"
    @course-updated="handleCourseUpdated"
  />
  
  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="showDeleteConfirm" max-width="500">
    <v-card>
      <v-card-title class="text-h5">Delete Course</v-card-title>
      <v-card-text>
        Are you sure you want to delete this course?
        <div class="mt-3 font-weight-bold" v-if="courseToDelete">
          {{ courseToDelete.dept }} {{ courseToDelete.courseNumber }} - {{ courseToDelete.name }}
        </div>
        <div class="text-error mt-2">This action cannot be undone.</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="showDeleteConfirm = false">Cancel</v-btn>
        <v-btn color="error" @click="confirmDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

    <!-- Add Course Button -->
    <v-row class="mb-4">
      <v-col cols="12" class="text-center">
        <v-btn 
          color="primary" 
          @click="showAddCourse = true"
          class="mb-4"
        >
          <v-icon left>mdi-plus</v-icon>
          Add New Course
        </v-btn>
      </v-col>
    </v-row>

    <!-- Search and Filter Section -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          label="Search courses..."
          variant="outlined"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedDepartment"
          :items="departments"
          label="Department"
          variant="outlined"
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedLevel"
          :items="levelOptions"
          label="Course Level"
          variant="outlined"
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-btn
          block
          variant="outlined"
          @click="clearFilters"
          :disabled="!hasActiveFilters"
        >
          Clear Filters
        </v-btn>
      </v-col>
    </v-row>

    <!-- Course Count -->
    <v-row v-if="!loading">
      <v-col cols="12" class="text-center mb-4">
        <v-chip color="primary">
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
        <CourseCard 
          :course="course" 
          @edit="handleEditCourse"
          @delete="handleDeleteCourse"
        />
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
/* Keep styling minimal and clean */
</style>
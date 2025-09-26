<script setup>
import { ref } from "vue";
// import CourseServices from "../services/courseServices"; // To be implemented

const searchQuery = ref("");
const courses = ref([]);
const loading = ref(false);
const message = ref("");

const searchCourses = async () => {
  if (searchQuery.value.length < 2 || searchQuery.value.length > 4) {
    message.value = "Please enter a department code (2-4 characters)";
    return;
  }

  loading.value = true;
  message.value = "";
  
  try {
    // TODO: Implement actual API call
    // const response = await CourseServices.searchByDepartment(searchQuery.value);
    // courses.value = response.data;
    
    // Placeholder data for now
    courses.value = [
      {
        id: 1,
        department: searchQuery.value.toUpperCase(),
        number: "101",
        title: "Introduction to " + searchQuery.value.toUpperCase(),
        credits: 3,
        instructor: "Dr. Smith"
      }
    ];
    
    if (courses.value.length === 0) {
      message.value = `No courses found for "${searchQuery.value}"`;
    } else {
      message.value = `Showing ${courses.value.length} results for "${searchQuery.value}"`;
    }
  } catch (error) {
    message.value = "Error searching courses. Please try again.";
    console.error("Search error:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-container>
    <!-- Search Section -->
    <v-row>
      <v-col cols="12" md="8" class="mx-auto">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5 text-primary">
            Course Search
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="searchQuery"
              label="Search by Department Code (e.g., CS, MATH, ENG)"
              variant="outlined"
              append-inner-icon="mdi-magnify"
              @keyup.enter="searchCourses"
              @click:append-inner="searchCourses"
              :loading="loading"
              :error-messages="message && !courses.length && !loading ? [message] : []"
              clearable
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Results Section -->
    <v-row v-if="courses.length > 0" class="mt-4">
      <v-col cols="12">
        <p class="text-subtitle-1 text-center">{{ message }}</p>
      </v-col>
      <v-col
        v-for="course in courses"
        :key="course.id"
        cols="12"
        md="6"
        lg="4"
      >
        <!-- Course Card Placeholder -->
        <v-card elevation="2" class="h-100">
          <v-card-title>
            {{ course.department }} {{ course.number }} - {{ course.title }}
          </v-card-title>
          <v-card-text>
            <v-chip small color="primary" class="mr-2">
              {{ course.credits }} credits
            </v-chip>
            <p class="mt-2 mb-0">Instructor: {{ course.instructor }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else-if="message && !loading" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">
          mdi-magnify
        </v-icon>
        <p class="text-h6 text-grey-darken-1">{{ message }}</p>
        <p class="text-body-2 text-grey">
          Try searching for CS, MATH, or ENG
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
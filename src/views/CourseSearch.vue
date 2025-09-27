<script setup>
import { ref } from "vue";
import CourseServices from "../services/courseServices";

const searchQuery = ref("");
const courses = ref([]);
const loading = ref(false);
const message = ref("");
const touched = ref(false);

const validateDept = (v) => /^[A-Za-z]{2,4}$/.test(String(v).trim());

const searchCourses = async () => {
  touched.value = true;

  if (!validateDept(searchQuery.value)) {
    message.value = "Please enter a department code (2–4 letters, e.g., CS, MATH).";
    courses.value = [];
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    const data = await CourseServices.searchByDepartment(searchQuery.value);
    courses.value = Array.isArray(data) ? data : [];

    message.value = courses.value.length
      ? `Showing ${courses.value.length} result${courses.value.length > 1 ? "s" : ""} for "${searchQuery.value.toUpperCase()}"`
      : `No courses found for "${searchQuery.value.toUpperCase()}"`;
  } catch (error) {
    console.error("Search error:", error);
    courses.value = [];
    message.value = error.message || "Error searching courses. Please try again.";
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
          <v-card-title class="text-h5 text-primary">Course Search</v-card-title>

          <v-card-text>
            <v-text-field
              v-model="searchQuery"
              label="Search by Department Code (e.g., CS, MATH, ENG)"
              variant="outlined"
              append-inner-icon="mdi-magnify"
              :loading="loading"
              :clearable="!loading"
              :error="touched && !validateDept(searchQuery)"
              :error-messages="touched && !validateDept(searchQuery) ? ['Please enter a 2–4 letter code'] : []"
              @keyup.enter="searchCourses"
              @click:append-inner="searchCourses"
            />
            <v-btn
              class="mt-2"
              color="primary"
              :loading="loading"
              :disabled="loading"
              @click="searchCourses"
            >
              Search
            </v-btn>
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
        <v-card elevation="2" class="h-100">
          <v-card-title>
            {{ course.department }} {{ course.number }} — {{ course.title }}
          </v-card-title>
          <v-card-text>
            <p>{{ course.description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

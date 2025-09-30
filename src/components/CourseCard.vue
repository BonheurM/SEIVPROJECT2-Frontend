<script setup>
import { computed, ref } from 'vue';
import CourseDetailModal from './CourseDetailModal.vue';

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});

const showDetails = ref(false);

const levelColor = computed(() => {
  if (props.course.level >= 400) return 'error';
  if (props.course.level >= 300) return 'warning';
  if (props.course.level >= 200) return 'info';
  return 'success';
});

const levelText = computed(() => {
  if (props.course.level >= 400) return 'Graduate';
  if (props.course.level >= 300) return 'Upper Division';
  if (props.course.level >= 200) return 'Intermediate';
  if (props.course.level >= 100) return 'Introductory';
  return 'Basic';
});


</script>

<template>
  <v-card 
    elevation="2" 
    class="h-100 course-card" 
    @click="showDetails = true"
    style="cursor: pointer;"
  >
    <v-card-title class="d-flex align-center">
      <span class="text-h6 text-primary">
        {{ course.dept }} {{ course.courseNumber }}
      </span>
      <v-spacer />
      <v-chip
        :color="levelColor"
        size="small"
        class="ml-2"
      >
        {{ levelText }}
      </v-chip>
    </v-card-title>
    
    <v-card-subtitle class="text-primary-darken-1">
      {{ course.name }}
    </v-card-subtitle>

    <v-card-text>
      <p class="mb-2 text-truncate" v-if="course.description">{{ course.description }}</p>
      <p class="mb-2 text-grey" v-else>No description available</p>
      
      <v-row dense class="mt-2">
        <v-col cols="auto">
          <v-chip size="small" color="primary" class="mr-2">
            {{ course.hours }} hours
          </v-chip>
        </v-col>
        <v-col cols="auto">
          <v-chip size="small" color="secondary">
            Level {{ course.level }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  
  <CourseDetailModal
    v-model="showDetails"
    :course="course"
  />
</template>

<style scoped>
.course-card {
  transition: all 0.2s ease-in-out;
  min-height: 200px;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
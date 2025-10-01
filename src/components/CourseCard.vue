<script setup>
import { computed, ref } from 'vue';
import CourseDetailModal from './CourseDetailModal.vue';

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit', 'delete']);

const showDetails = ref(false);
const showMenu = ref(false);

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
    class="h-100" 
    @click="showDetails = true"
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
      <v-menu v-model="showMenu" :close-on-content-click="false">
        <template v-slot:activator="{ props: menuProps }">
          <v-btn
            icon
            variant="text"
            size="small"
            v-bind="menuProps"
            @click.stop
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="emit('edit', course); showMenu = false">
            <v-list-item-title>
              <v-icon size="small" class="mr-2">mdi-pencil</v-icon>
              Edit Course
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="emit('delete', course); showMenu = false" class="text-error">
            <v-list-item-title>
              <v-icon size="small" class="mr-2" color="error">mdi-delete</v-icon>
              Delete Course
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    
    <v-card-subtitle>
      {{ course.name }}
    </v-card-subtitle>

    <v-card-text>
      <div class="mb-2">
        <p v-if="course.description">{{ course.description }}</p>
        <p v-else class="text-grey">No description available</p>
      </div>
      
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
/* Keep styling minimal */
</style>
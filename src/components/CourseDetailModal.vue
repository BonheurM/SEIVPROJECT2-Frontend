<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  course: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const levelColor = computed(() => {
  if (props.course?.level >= 400) return 'error';
  if (props.course?.level >= 300) return 'warning';
  if (props.course?.level >= 200) return 'info';
  return 'success';
});

const levelText = computed(() => {
  if (props.course?.level >= 400) return 'Graduate';
  if (props.course?.level >= 300) return 'Upper Division';
  if (props.course?.level >= 200) return 'Intermediate';
  if (props.course?.level >= 100) return 'Introductory';
  return 'Basic';
});
</script>

<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card v-if="course">
      <v-card-title class="text-h5 d-flex align-center bg-primary text-white">
        <span>{{ course.dept }} {{ course.courseNumber }}</span>
        <v-spacer></v-spacer>
        <v-chip :color="levelColor" size="small" class="text-white">
          {{ levelText }}
        </v-chip>
      </v-card-title>
      
      <v-card-subtitle class="text-h6 mt-3 pb-0">
        {{ course.name }}
      </v-card-subtitle>
      
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <div class="text-subtitle-2 text-grey mb-1">Course Description</div>
              <p v-if="course.description" class="text-body-2">{{ course.description }}</p>
              <p v-else class="text-body-2 text-grey">No description available for this course.</p>
            </v-col>
          </v-row>
          
          <v-divider class="my-4"></v-divider>
          
          <v-row>
            <v-col cols="12" sm="6">
              <v-list density="compact" class="pa-0">
                <v-list-item class="pa-0">
                  <template v-slot:prepend>
                    <v-icon size="small" class="mr-2">mdi-school</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">Department</v-list-item-title>
                  <v-list-item-subtitle>{{ course.dept }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item class="pa-0">
                  <template v-slot:prepend>
                    <v-icon size="small" class="mr-2">mdi-numeric</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">Course Number</v-list-item-title>
                  <v-list-item-subtitle>{{ course.courseNumber }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item class="pa-0">
                  <template v-slot:prepend>
                    <v-icon size="small" class="mr-2">mdi-clock-outline</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">Credit Hours</v-list-item-title>
                  <v-list-item-subtitle>{{ course.hours }} hours</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-list density="compact" class="pa-0">
                <v-list-item class="pa-0">
                  <template v-slot:prepend>
                    <v-icon size="small" class="mr-2">mdi-stairs</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">Course Level</v-list-item-title>
                  <v-list-item-subtitle>{{ course.level }} - {{ levelText }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item class="pa-0">
                  <template v-slot:prepend>
                    <v-icon size="small" class="mr-2">mdi-identifier</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">Course ID</v-list-item-title>
                  <v-list-item-subtitle>#{{ course.id }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          
          <v-alert
            class="mt-4"
            type="info"
            variant="tonal"
            density="compact"
          >
            For enrollment information, prerequisites, and instructor details, please contact the registrar's office.
          </v-alert>
        </v-container>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
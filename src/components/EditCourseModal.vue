<template>
  <v-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" max-width="600px">
    <v-card>
      <v-card-title>Edit Course</v-card-title>
      <v-card-text>
        <v-form v-model="isFormValid">
          <v-text-field 
            v-model="editedCourse.name" 
            label="Course Name" 
            :rules="nameRules" 
            variant="outlined"
            density="compact"
          />
          <v-text-field 
            v-model="editedCourse.courseNumber" 
            label="Course Number" 
            :rules="courseNumberRules" 
            variant="outlined"
            density="compact"
          />
          <v-text-field 
            v-model="editedCourse.dept" 
            label="Department" 
            :rules="deptRules" 
            variant="outlined"
            density="compact"
          />
          <v-text-field 
            v-model.number="editedCourse.hours" 
            label="Credit Hours" 
            type="number" 
            :rules="hoursRules" 
            variant="outlined"
            density="compact"
          />
          <v-text-field 
            v-model.number="editedCourse.level" 
            label="Level" 
            type="number" 
            :rules="levelRules" 
            variant="outlined"
            density="compact"
          />
          <v-textarea 
            v-model="editedCourse.description" 
            label="Description" 
            rows="3"
            variant="outlined"
            density="compact"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="onCancel">Cancel</v-btn>
        <v-btn 
          color="primary" 
          variant="elevated"
          @click="onSave" 
          :disabled="!isFormValid || loading"
          :loading="loading"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  show: Boolean,
  course: Object
});

const emit = defineEmits(['update:show', 'course-updated']);

const isFormValid = ref(true);
const loading = ref(false);
const editedCourse = ref({});

// Validation rules
const nameRules = [
  v => !!v || 'Name is required'
];

const courseNumberRules = [
  v => !!v || 'Course Number is required'
];

const deptRules = [
  v => !!v || 'Department is required'
];

const hoursRules = [
  v => v != null && v !== '' || 'Hours are required',
  v => v > 0 || 'Hours must be positive'
];

const levelRules = [
  v => v != null && v !== '' || 'Level is required',
  v => v >= 0 || 'Level must be non-negative'
];

// Watch for course prop changes
watch(() => props.course, (newCourse) => {
  if (newCourse) {
    editedCourse.value = { ...newCourse };
    // Form should be valid when pre-populated with existing data
    isFormValid.value = true;
  }
}, { immediate: true, deep: true });

const onSave = async () => {
  if (!isFormValid.value) {
    console.error('Form is not valid');
    return;
  }
  
  loading.value = true;
  try {
    emit('course-updated', editedCourse.value);
  } catch (error) {
    console.error('Error saving course:', error);
  } finally {
    loading.value = false;
  }
};

const onCancel = () => {
  emit('update:show', false);
  if (props.course) {
    editedCourse.value = { ...props.course };
  }
};
</script>
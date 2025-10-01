<template>
  <v-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" max-width="600px">
    <v-card>
      <v-card-title>Edit Course</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field 
            v-model="editedCourse.name" 
            label="Course Name" 
            :rules="[v => !!v || 'Name is required']" 
            variant="outlined"
            density="compact"
          />
          <v-text-field 
            v-model="editedCourse.courseNumber" 
            label="Course Number" 
            :rules="[v => !!v || 'Course Number is required']" 
            variant="outlined"
            density="compact"
          />
          <v-text-field 
            v-model="editedCourse.dept" 
            label="Department" 
            :rules="[v => !!v || 'Department is required']" 
            variant="outlined"
            density="compact"
          />
          <v-text-field 
            v-model.number="editedCourse.hours" 
            label="Credit Hours" 
            type="number" 
            :rules="[
              v => v !== null && v !== '' && v !== undefined && !isNaN(v) || 'Hours are required',
              v => Number(v) >= 0 || 'Hours must be non-negative'
            ]" 
            variant="outlined"
            density="compact"
          />
          <v-text-field 
            v-model.number="editedCourse.level" 
            label="Level" 
            type="number" 
            :rules="[
              v => v !== null && v !== '' && v !== undefined && !isNaN(v) || 'Level is required',
              v => Number(v) >= 0 || 'Level must be non-negative'
            ]" 
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
          :loading="loading"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  course: Object
});

const emit = defineEmits(['update:show', 'course-updated']);

const form = ref(null);
const loading = ref(false);
const editedCourse = ref({});

// Watch for course prop changes
watch(() => props.course, (newCourse) => {
  if (newCourse) {
    editedCourse.value = { ...newCourse };
  }
}, { immediate: true, deep: true });

const onSave = async () => {
  // Validate form
  if (form.value) {
    const { valid } = await form.value.validate();
    if (!valid) {
      console.error('Form validation failed');
      return;
    }
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
  // Reset form validation
  if (form.value) {
    form.value.resetValidation();
  }
};
</script>
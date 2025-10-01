<template>
  <v-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" max-width="600px">
    <v-card>
      <v-card-title>Edit Course</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field 
            v-model="editedCourse.name" 
            label="Course Name" 
            :rules="[v => !!v || 'Name is required']" 
            required 
          />
          <v-text-field 
            v-model="editedCourse.courseNumber" 
            label="Course Number" 
            :rules="[v => !!v || 'Course Number is required']" 
            required 
          />
          <v-text-field 
            v-model="editedCourse.dept" 
            label="Department" 
            :rules="[v => !!v || 'Department is required']" 
            required 
          />
          <v-text-field 
            v-model.number="editedCourse.hours" 
            label="Credit Hours" 
            type="number" 
            :rules="[v => !!v || 'Hours are required', v => v > 0 || 'Hours must be positive']" 
            required 
          />
          <v-text-field 
            v-model.number="editedCourse.level" 
            label="Level" 
            type="number" 
            :rules="[v => !!v || 'Level is required', v => v >= 0 || 'Level must be non-negative']" 
            required 
          />
          <v-textarea 
            v-model="editedCourse.description" 
            label="Description" 
            rows="3"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="onCancel">Cancel</v-btn>
        <v-btn 
          color="primary" 
          @click="onSave" 
          :disabled="!valid"
          :loading="loading"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EditCourseModal',
  props: {
    show: Boolean,
    course: Object
  },
  emits: ['update:show', 'course-updated'],
  data() {
    return {
      valid: false,
      loading: false,
      editedCourse: {}
    };
  },
  watch: {
    course: {
      immediate: true,
      handler(newCourse) {
        if (newCourse) {
          this.editedCourse = { ...newCourse };
        }
      }
    }
  },
  methods: {
    async onSave() {
      if (!this.$refs.form.validate()) return;
      
      this.loading = true;
      try {
        this.$emit('course-updated', this.editedCourse);
        this.$emit('update:show', false);
      } finally {
        this.loading = false;
      }
    },
    onCancel() {
      this.$emit('update:show', false);
      this.editedCourse = { ...this.course };
    }
  }
};
</script>
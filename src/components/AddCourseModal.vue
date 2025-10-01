<template>
  <v-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" max-width="600px">
    <v-card>
      <v-card-title>Add New Course</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field v-model="course.name" label="Course Name" :rules="[v => !!v || 'Name is required']" required />
          <v-text-field v-model="course.dept" label="Department" :rules="[v => !!v || 'Department is required']" required />
          <v-text-field v-model="course.courseNumber" label="Course Number" :rules="[v => !!v || 'Course Number is required']" required />
          <v-text-field v-model="course.hours" label="Credit Hours" type="number" :rules="[v => !!v || 'Hours are required']" required />
          <v-text-field v-model="course.level" label="Level" type="number" :rules="[v => !!v || 'Level is required']" required />
          <v-textarea v-model="course.description" label="Description" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="onCreate" :disabled="!valid">Create Course</v-btn>
        <v-btn text @click="onCancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AddCourseModal',
  props: {
    show: Boolean
  },
  emits: ['update:show', 'course-created'],
  data() {
    return {
      valid: false,
      course: {
        name: '',
        dept: '',
        courseNumber: '',
        hours: '',
        level: '',
        description: ''
      }
    };
  },
  watch: {
    show(val) {
      if (!val) {
        this.resetForm();
      }
    }
  },
  methods: {
    onCreate() {
      if (this.$refs.form.validate()) {
        this.$emit('course-created', { ...this.course });
        this.$emit('update:show', false);
      }
    },
    onCancel() {
      this.$emit('update:show', false);
    },
    resetForm() {
      this.valid = false;
      this.course = {
        name: '',
        dept: '',
        courseNumber: '',
        hours: '',
        level: '',
        description: ''
      };
    }
  }
};
</script>

<template>
  <v-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" max-width="600px">
    <v-card>
      <v-card-title>Add New Course</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field v-model="course.title" label="Title" :rules="[v => !!v || 'Title is required']" required />
          <v-text-field v-model="course.courseNumber" label="Course Number" :rules="[v => !!v || 'Course Number is required']" required />
          <v-text-field v-model="course.credits" label="Credits" type="number" :rules="[v => !!v || 'Credits are required']" required />
          <v-text-field v-model="course.level" label="Level" type="number" :rules="[v => !!v || 'Level is required']" required />
          <v-textarea v-model="course.description" label="Description" :rules="[v => !!v || 'Description is required']" required />
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
        title: '',
        courseNumber: '',
        credits: '',
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
        title: '',
        courseNumber: '',
        credits: '',
        level: '',
        description: ''
      };
    }
  }
};
</script>

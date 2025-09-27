&lt;script setup&gt;
import { computed } from 'vue';

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});

const enrollmentColor = computed(() => {
  if (!props.course.enrollment) return 'grey';
  const ratio = props.course.enrollment.current / props.course.enrollment.capacity;
  if (ratio >= 0.9) return 'error';
  if (ratio >= 0.7) return 'warning';
  return 'success';
});
&lt;/script&gt;

&lt;template&gt;
  &lt;v-card elevation="2" class="h-100 course-card"&gt;
    &lt;v-card-title class="d-flex align-center"&gt;
      &lt;span class="text-h6 text-primary"&gt;
        {{ course.department }} {{ course.number }}
      &lt;/span&gt;
      &lt;v-spacer /&gt;
      &lt;v-chip
        v-if="course.enrollment"
        :color="enrollmentColor"
        size="small"
        class="ml-2"
      &gt;
        {{ course.enrollment.current }}/{{ course.enrollment.capacity }}
      &lt;/v-chip&gt;
    &lt;/v-card-title&gt;
    
    &lt;v-card-subtitle class="text-primary-darken-1"&gt;
      {{ course.title }}
    &lt;/v-card-subtitle&gt;

    &lt;v-card-text&gt;
      &lt;p class="mb-2"&gt;{{ course.description }}&lt;/p&gt;
      
      &lt;v-row dense class="mt-2"&gt;
        &lt;v-col cols="12" sm="6"&gt;
          &lt;div class="text-subtitle-2"&gt;Instructor&lt;/div&gt;
          &lt;div&gt;{{ course.instructor }}&lt;/div&gt;
          &lt;div class="text-caption"&gt;
            &lt;a :href="'mailto:' + course.instructorEmail"&gt;{{ course.instructorEmail }}&lt;/a&gt;
          &lt;/div&gt;
        &lt;/v-col&gt;
        
        &lt;v-col cols="12" sm="6"&gt;
          &lt;div class="text-subtitle-2"&gt;Schedule&lt;/div&gt;
          &lt;div v-if="course.schedule"&gt;
            {{ course.schedule.days }} {{ course.schedule.time }}
            &lt;div class="text-caption"&gt;{{ course.schedule.location }}&lt;/div&gt;
          &lt;/div&gt;
        &lt;/v-col&gt;
      &lt;/v-row&gt;

      &lt;v-row dense class="mt-2"&gt;
        &lt;v-col cols="auto"&gt;
          &lt;v-chip size="small" color="primary" class="mr-2"&gt;
            {{ course.credits }} credits
          &lt;/v-chip&gt;
        &lt;/v-col&gt;
        &lt;v-col cols="auto" v-if="course.prerequisites?.length"&gt;
          &lt;v-chip size="small" color="warning"&gt;
            Has prerequisites
          &lt;/v-chip&gt;
        &lt;/v-col&gt;
      &lt;/v-row&gt;
    &lt;/v-card-text&gt;
  &lt;/v-card&gt;
&lt;/template&gt;

&lt;style scoped&gt;
.course-card {
  transition: transform 0.2s ease-in-out;
}

.course-card:hover {
  transform: translateY(-4px);
}
&lt;/style&gt;

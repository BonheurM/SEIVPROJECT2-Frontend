<script setup>
import { ref, onMounted, computed } from 'vue';
import apiClient from '@/services/services';

const status = ref('checking');
const lastChecked = ref(null);
const responseTime = ref(null);
const errorDetails = ref(null);

const statusColor = computed(() => {
  const colors = {
    online: 'success',
    offline: 'error',
    checking: 'warning',
    slow: 'warning'
  };
  return colors[status.value] || 'grey';
});

const statusIcon = computed(() => {
  const icons = {
    online: 'mdi-check-circle',
    offline: 'mdi-alert-circle',
    checking: 'mdi-loading mdi-spin',
    slow: 'mdi-speedometer-slow'
  };
  return icons[status.value] || 'mdi-help-circle';
});

async function checkStatus() {
  status.value = 'checking';
  errorDetails.value = null;
  
  const startTime = performance.now();
  
  try {
    // Try main API endpoint first
    const response = await apiClient.get('/api/courses', {
      params: { department: 'CS' },
      timeout: 2000
    });
    
    const elapsed = performance.now() - startTime;
    responseTime.value = Math.round(elapsed);
    
    // Check if response has expected structure
    const data = response.data?.data || response.data;
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }
    
    // Determine status based on response time
    if (elapsed > 1500) {
      status.value = 'slow';
    } else {
      status.value = 'online';
    }
    
  } catch (error) {
    responseTime.value = null;
    status.value = 'offline';
    
    if (error.code === 'ECONNABORTED') {
      errorDetails.value = 'Request timeout (>2s)';
    } else if (error.message.includes('Network')) {
      errorDetails.value = 'Cannot connect to backend';
    } else {
      errorDetails.value = error.message;
    }
  }
  
  lastChecked.value = new Date();
}

onMounted(() => {
  checkStatus();
  // Check every 30 seconds
  setInterval(checkStatus, 30000);
});
</script>

<template>
  <v-chip
    :color="statusColor"
    size="small"
    @click="checkStatus"
    style="cursor: pointer"
  >
    <v-icon start :icon="statusIcon" />
    Backend: {{ status }}
    <span v-if="responseTime !== null" class="ml-1">
      ({{ responseTime }}ms)
    </span>
    <v-tooltip 
      v-if="errorDetails || lastChecked" 
      activator="parent" 
      location="bottom"
    >
      <div v-if="errorDetails">Error: {{ errorDetails }}</div>
      <div v-if="lastChecked">
        Last checked: {{ lastChecked.toLocaleTimeString() }}
      </div>
      <div>Click to refresh</div>
    </v-tooltip>
  </v-chip>
</template>
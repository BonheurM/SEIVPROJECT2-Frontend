<script setup>
import ocLogo from "/oc-logo-white.png";
import { ref, onMounted } from "vue";
import BackendStatus from "./BackendStatus.vue";

const title = ref("Oklahoma Christian University Course Catalog");

const name = ref("");
const logoURL = ref("");

onMounted(() => {
  logoURL.value = ocLogo;
 
});
</script>

<template>
  <div>
    <v-app-bar app>
      <router-link :to="{ name: 'home' }" class="d-flex align-center text-decoration-none">
        <v-img
          class="mx-3"
          :src="logoURL"
          height="45"
          width="45"
          contain
        ></v-img>
      </router-link>
      <v-toolbar-title class="app-title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <!-- Backend Status Indicator -->
      <BackendStatus class="mr-4" />
      
    </v-app-bar>
  </div>
</template>

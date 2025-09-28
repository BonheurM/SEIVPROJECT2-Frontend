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
      <router-link :to="{ name: 'home' }">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
        ></v-img>
      </router-link>
      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <!-- Backend Status Indicator -->
      <BackendStatus class="mr-4" />
      
      <div>
        <!-- Department filter could go here in the future -->
      </div>

    </v-app-bar>
  </div>
</template>

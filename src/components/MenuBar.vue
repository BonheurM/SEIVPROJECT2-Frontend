<script setup>
import ocLogo from "/oc-logo-white.png";
import { ref, onMounted } from "vue";

const title = ref("Course Listing System");

const name = ref("");
const logoURL = ref("");

onMounted(() => {
  logoURL.value = ocLogo;
 
});
</script>

<template>
  <div>
    <v-app-bar app>
      <router-link :to="{ name: 'tutorials' }">
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
      <div>
        <!-- New Course Search Link -->
        <v-btn class="mx-2" :to="{ name: 'courses' }" color="primary">
          Course Search
        </v-btn>
        <!-- Keep tutorial links temporarily -->
        <v-btn class="mx-2" :to="{ name: 'tutorials' }" text> Tutorials </v-btn>
        <v-btn class="mx-2" :to="{ name: 'add' }" text> Add Tutorial </v-btn>
      </div>

    </v-app-bar>
  </div>
</template>

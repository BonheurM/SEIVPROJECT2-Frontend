<script setup>
import ocLogo from "/oc-logo-white.png";
import { ref, onMounted } from "vue";

const title = ref("Tutorials");

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
      <div >
        <v-btn class="mx-2" :to="{ name: 'tutorials' }"> List </v-btn>
        <v-btn class="mx-2" :to="{ name: 'add' }"> Add Tutorial </v-btn>
      </div>

    </v-app-bar>
  </div>
</template>

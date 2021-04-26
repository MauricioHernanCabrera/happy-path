<template>
  <v-app dark>
    <v-app-bar fixed app color="#1E1E1E" class="elevation-0">
      <v-toolbar-title v-text="title" />

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: "Happy path",
    };
  },
};
</script>

<template>
  <div class="modal_form_header">
    <v-spacer></v-spacer>

    <h4 class="modal_form_header__title">{{ title }}</h4>

    <v-spacer></v-spacer>

    <v-btn icon @click="$emit('click')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils.scss";

.modal_form_header {
  display: flex;
  margin-bottom: 24px;
}

.modal_form_header__title {
  font-size: 20px;
  line-height: 32px;
  font-weight: 600;
}
</style>
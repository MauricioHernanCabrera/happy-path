<template>
  <div class="modal_form_footer">
    <v-spacer></v-spacer>

    <v-btn text depressed @click="$emit('close')" class="mr_2">
      Cancelar
    </v-btn>

    <v-btn
      color="primary"
      depressed
      type="submit"
      :loading="isLoading"
      :disabled="isDisabled || isLoading"
    >
      {{ btnOkText }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    btnOkText: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils.scss";
.modal_form_footer {
  display: flex;
}
</style>
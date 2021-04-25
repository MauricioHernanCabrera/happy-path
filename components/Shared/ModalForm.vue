<template>
  <v-dialog v-model="dialog" width="500" light>
    <form class="modal_form" @submit.prevent="$emit('submit')">
      <ModalFormHeader :title="title" @click="dialog = false" />

      <div class="modal_form__content">
        <slot />
      </div>

      <ModalFormFooter
        @close="dialog = false"
        :btnOkText="btnOkText"
        :isLoading="isLoading"
        :isDisabled="isDisabled"
      />
    </form>
  </v-dialog>
</template>

<script>
import ModalFormHeader from "@/components/Shared/ModalFormHeader";
import ModalFormFooter from "@/components/Shared/ModalFormFooter";

export default {
  components: {
    ModalFormHeader,
    ModalFormFooter,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    btnOkText: {
      type: String,
      default: "Crear",
    },
    value: {
      type: Boolean,
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

  computed: {
    dialog: {
      get: function () {
        return this.value;
      },
      set: function (newValue) {
        this.$emit("input", newValue);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils.scss";

.modal_form {
  background-color: $color_light;
  padding: 32px;
  border-radius: 8px;
  color: $color_dark;
}

.modal_form__content {
  margin-bottom: 32px;
}
</style>
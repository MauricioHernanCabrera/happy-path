<template>
  <ModalForm
    v-model="dialog"
    @submit="submitForm"
    :isLoading="isLoading"
    :isDisabled="$v.$invalid"
    :btnOkText="defineFormText"
    :title="`${defineFormText} comisión`"
  >
    <v-text-field
      autofocus
      label="Nombre"
      v-model="form.name"
      @input="$v.form.name.$touch()"
      @blur="$v.form.name.$touch()"
    ></v-text-field>

    <v-text-field
      label="Valor"
      v-model.number="form.value"
      min="0"
      :error-messages="valueErrors"
      @input="$v.form.value.$touch()"
      @blur="$v.form.value.$touch()"
    ></v-text-field>
  </ModalForm>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import modalFormParentMixin from "@/mixins/modal-form-parent";

export default {
  mixins: [modalFormParentMixin],

  validations: {
    form: {
      name: {},
      value: { required },
    },
  },

  data() {
    return {
      fieldsPick: ["name", "value", "pathIndex", "commissionIndex", "_id"],
    };
  },

  computed: {
    nameErrors() {
      return this.vuelidateErrors(this.$v.form.name);
    },
    valueErrors() {
      return this.vuelidateErrors(this.$v.form.value);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
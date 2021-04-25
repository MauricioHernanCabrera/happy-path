import ModalForm from "@/components/Shared/ModalForm";
import vuelidateErrors from "@/lib/vuelidate-errors";

import { pick } from "lodash";

export default {
  components: {
    ModalForm
  },

  props: {
    active: {
      type: Boolean,
      required: true
    },

    data: {
      type: Object,
      required: true
    },

    isLoading: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      fieldsPick: [],
      form: {}
    };
  },

  computed: {
    isCreationForm() {
      return this.data._id ? false : true;
    },

    defineFormText() {
      return this.isCreationForm ? "Crear" : "Actualizar";
    },

    dialog: {
      get: function() {
        return this.active;
      },
      set: function(newValue) {
        this.$emit("close", newValue);
      }
    }
  },

  watch: {
    active(newValue, oldValue) {
      if (!newValue) {
        this.$v.$reset();
        return;
      }

      this.form = pick(JSON.parse(JSON.stringify(this.data)), this.fieldsPick);
    }
  },

  methods: {
    vuelidateErrors,

    submitForm() {
      this.$emit(
        "submit",
        pick(JSON.parse(JSON.stringify(this.form)), this.fieldsPick)
      );
    }
  }
};

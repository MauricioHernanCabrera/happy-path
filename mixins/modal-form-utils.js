import { findIndex, find } from "lodash";

export default {
  data() {
    return {
      // modal: {
      //   data: {},
      //   active: false,
      //   isLoading: false
      // }
    };
  },

  methods: {
    setModal(modal, { active = true, data = {}, isLoading = false } = {}) {
      modal.active = active;
      modal.isLoading = isLoading;
      modal.data = data;
    },

    closeModal(modal) {
      this.setModal(modal, { active: false, data: {} });
    },

    loadingModal(modal) {
      modal.isLoading = true;
    },

    findIndexById(array, _id) {
      return findIndex(array, ["_id", _id]);
    },

    find(array, _id) {
      return find(array, ["_id", _id]);
    },

    updateItemIsLoadingProp(array, _id, value) {
      this.$set(array[this.findIndexById(array, _id)], "isLoading", value);
    },

    deleteItem(array, _id) {
      const programIndex = findIndex(array, ["_id", _id]);
      array.splice(programIndex, 1);
    },

    updateItem(array, _id, data) {
      const programIndex = findIndex(array, ["_id", _id]);
      array.splice(programIndex, 1, data);
    },

    addItem(array, data) {
      array.push(JSON.parse(JSON.stringify(data)));
    }
  }
};

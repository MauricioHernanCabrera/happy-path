function loadVuelidateErrors(field) {
  const errors = [];

  const { $dirty, required } = field;

  if (!$dirty) return errors;

  !required && errors.push("¡Este campo es requerido!");

  return errors;
}

export default loadVuelidateErrors;

/* eslint-disable no-underscore-dangle */
/*
 * Here, we are iterating each key-value pair of object 'Obj' and
 * checks if typeof value is string then we pass it as custom variable in mouseflow.
 */
const setCustomVariables = (Obj) => {
  Object.entries(Obj).forEach((item) => {
    const [key, value] = item;
    if (typeof value === "string")
      window._mfq.push(["setVariable", key, value]);
  });
};

export default setCustomVariables;

exports.valueRequired = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value.trim() === "" ||
    value === "null" ||
    value === "undefined"
  ) {
    return false;
  } else {
    return true;
  }
};

const validator = require("validator");
const validateSingUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name must not be empty");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Weak Password!");
  }
};

const validateProfileEdit = (req) => {
  const allowedEditFileds = ["firstName", "lastName"];
  const isEditAllowed = Object.keys(req.body).every((filed) =>
    allowedEditFileds.includes(filed)
  );
  return isEditAllowed;
};

module.exports = {
  validateSingUpData,
  validateProfileEdit,
};

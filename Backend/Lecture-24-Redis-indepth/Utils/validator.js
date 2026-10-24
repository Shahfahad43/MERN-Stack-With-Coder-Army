const validator = require("validator");

function validateuser(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid data");
  }

  const mandatoryField = ["firstName", "email", "password"];
  const keys = Object.keys(data);
  const isAllowed = mandatoryField.every((k) => keys.includes(k));

  if (!isAllowed) throw new Error("Field is missing");

  if (typeof data.email !== "string" || !validator.isEmail(data.email)) {
    throw new Error("Invalid email!");
  }

  if (
    typeof data.password !== "string" ||
    !validator.isStrongPassword(data.password)
  ) {
    throw new Error("Weak password!");
  }

  if (
    typeof data.firstName !== "string" ||
    data.firstName.length < 3 ||
    data.firstName.length > 20
  ) {
    throw new Error("First name must be 3–20 characters!");
  }
}

module.exports = validateuser;

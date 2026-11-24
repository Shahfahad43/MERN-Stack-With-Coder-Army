const validator = require("validator");

function validate(data) {
  try {
    const mandatoryFields = ["firstName", "emailId", "password"];

    // these fieds are required inside the data
    const isAllowed = mandatoryFields.every((k) =>
      Object.keys(data).includes(k),
    );

    // if any of the fields is missing, the user must not login
    if (!isAllowed) throw new Error("Mandatory field missing!");

    // validate email
    if (!validator.isEmail(data.emailId)) throw new Error("Invalid email!");

    // validate password
    if (!validator.isStrongPassword(data.password))
      throw new Error("Week password!");
  } catch (error) {
    console.log("Error ", error.message);
  }
}

module.exports = validate;

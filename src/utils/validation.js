const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, emailId, password, age, gender, about, skills } =
    req.body;

  if (
    typeof firstName !== "string" ||
    firstName.length < 4 ||
    firstName.length > 30
  ) {
    throw new Error(
      "first name must be a string and must be between 4 and 30 characters"
    );
  }

  if (lastName && (typeof lastName !== "string" || lastName.length > 30)) {
    throw new Error(
      "last name must be a string  and must be at most 30 characters"
    );
  }

  if (!emailId || typeof emailId !== "string" || !validator.isEmail(emailId)) {
    throw new Error("please enter a valid email Id");
  }

  if (
    !password ||
    typeof password !== "string" ||
    !validator.isStrongPassword(password)
  ) {
    throw new Error("please enter a strong password");
  }

  if (age !== undefined) {
    if (typeof age !== "number" || age < 0 || age > 150) {
      throw new Error("age must be between 0 and 150");
    }
  }

  const validGender = ["male", "female", "others"];

  if (!gender || typeof gender !== "string" || !validGender.includes(gender)) {
    throw new Error("please select valid gender");
  }

  if (about && (typeof about !== "string" || about.length > 200)) {
    throw new Error("about must be atmost 200 characters");
  }

  if (skills) {
    if (!Array.isArray(skills)) {
      throw new Error("skills must be an array");
    }
    if (skills.length > 10) {
      throw new Error("skills must be atmost 10");
    }
    for (let skill of skills) {
      if (typeof skill !== "string" || skill.trim().length === 0) {
        throw new Error("each skill must be a non empty string");
      }
    }
  }
};

module.exports = {validateSignup};

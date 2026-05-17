const bcrypt = require("bcryptjs");

const Scholar = require("../../models/v1/Scholar");
const Member = require("../../models/v1/members");

const login = async ({ email, password }) => {
  let user = null;
  let role = null;

  // =====================
  // Check member/admin
  // =====================

  user = await Member.findOne({
    upMail: email,
  });

  if (user) {
    // member or admin
    role = user.role;
  }

  // =====================
  // Check scholar
  // =====================

  if (!user) {
    user = await Scholar.findOne({
      upMail: email,
    });

    if (user) {
      role = "scholar";
    }
  }

  // =====================
  // No account found
  // =====================

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // =====================
  // Password check
  // =====================

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return {
    user,
    role,
  };
};

module.exports = { login };

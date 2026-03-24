const bcrypt = require("bcryptjs");
const Member = require("../../models/v1/Members");

const loginMember = async ({ email, password }) => {
  const member = await Member.findOne({ email });
  if (!member) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, member.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // Return the actual Mongoose document so the controller has the _id
  return { member };
};

module.exports = { loginMember };

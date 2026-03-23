const bcrypt = require("bcryptjs");
const Member = require("../../models/v1/Members");

const registerMember = async (fullname, contactNo, email, password) => {
  // check if email already exists
  const existing = await Member.findOne({ email });
  if (existing) throw new Error("Email already registered");

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create member
  const member = await Member.create({
    fullname,
    contactNo,
    email,
    password: hashedPassword,
  });

  // return member info (without password)
  return {
    id: member._id,
    fullname: member.fullname,
    contactNo: member.contactNo,
    email: member.email,
    status: member.status,
  };
};

module.exports = { registerMember };

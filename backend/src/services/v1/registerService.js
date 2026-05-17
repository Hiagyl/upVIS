const bcrypt = require("bcryptjs");

const Scholar = require("../../models/v1/Scholar");

const Member = require("../../models/v1/members");

const register = async (fullname, contactNo, email, password, role) => {
  // =====================
  // Scholar Registration
  // =====================
  console.log("ROLE:", role);
  if (role === "scholar") {
    const existingScholar = await Scholar.findOne({
      upMail: email,
    });

    if (existingScholar) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const scholar = await Scholar.create({
      name: fullname,
      contactNo,
      upMail: email,
      password: hashedPassword,
      studentNumber: `STU-${Date.now()}`,
      program: "Undeclared",
      scholarshipStartDate: new Date(),
      role: "scholar",
    });

    return {
      id: scholar._id,
      fullname: scholar.name,
      contactNo: scholar.contactNo,
      email: scholar.upMail,
      status: scholar.status,
      role: scholar.role,
    };
  }

  // =====================
  // Member/Admin
  // =====================

  const existingMember = await Member.findOne({
    upMail: email,
  });

  if (existingMember) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const member = await Member.create({
    fullname,
    contactNo,
    upMail: email,
    password: hashedPassword,
    role: role || "member",
  });

  return {
    id: member._id,
    fullname: member.fullname,
    contactNo: member.contactNo,
    email: member.upMail,
    status: member.status,
    role: member.role,
  };
};

module.exports = {
  register,
};

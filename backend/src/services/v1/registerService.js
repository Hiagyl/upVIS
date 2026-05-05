const bcrypt = require("bcryptjs");
const Scholar = require("../../models/v1/Scholar");

const registerScholar = async (fullname, contactNo, email, password, role) => {
  const existing = await Scholar.findOne({ upMail: email });
  if (existing) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);

  const scholar = await Scholar.create({
    name: fullname,
    contactNo,
    upMail: email,
    password: hashedPassword,
    studentNumber: `STU-${Date.now()}`,
    program: "Undeclared",
    scholarshipStartDate: new Date(),
    role: role || "student",
  });

  return {
    id: scholar._id,
    fullname: scholar.name,
    contactNo: scholar.contactNo,
    email: scholar.upMail,
    status: scholar.status,
    role: scholar.role,
  };
};

module.exports = { registerScholar };
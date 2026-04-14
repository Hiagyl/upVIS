const bcrypt = require("bcryptjs");
const Scholar = require("../../models/v1/Scholar");

const loginScholar = async ({ email, password }) => {
    const scholar = await Scholar.findOne({ upMail: email });
    if (!scholar) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, scholar.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return { scholar };
};

module.exports = { loginScholar };
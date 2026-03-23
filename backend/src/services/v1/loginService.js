const bcrypt = require("bcryptjs");
const Member = require("../../models/v1/Members");
const generateToken = require("../../utilities/generateToken");

const loginMember = async ({ email, password }) => {
    // find member by email
    const member = await Member.findOne({ email });
    if (!member) throw new Error("Invalid credentials");

    // compare password
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // return token + member info
    return {
        token: generateToken(member._id),
        member: {
            id: member._id,
            fullname: member.fullname,
            contactNo: member.contactNo,
            email: member.email,
            status: member.status,
        },
    };
};

module.exports = { loginMember };

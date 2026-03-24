const registerService = require("../../services/v1/registerService");

const register = async (req, res) => {
    try {
        const { fullname, contactNo, email, password } = req.body;
        const member = await registerService.registerMember(
            fullname,
            contactNo,
            email,
            password,
        );
        req.session.memberId = member._id;
        res.status(201).json({ message: "Member registered", member });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { register };

const registerService = require("../../services/v1/registerService");

const register = async (req, res) => {
    try {
        const { fullname, contactNo, email, password,role} = req.body;
        const user = await registerService.register(
            fullname,
            contactNo,
            email,
            password,
            role,
        );
        res.status(201).json({ message: "Scholar registered", scholar });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { register };
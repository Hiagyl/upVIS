const registerService = require("../../services/v1/registerService");

const registerScholar = async (req, res) => {
    try {
        const { fullname, contactNo, email, password } = req.body;
        const scholar = await registerService.registerScholar(
            fullname,
            contactNo,
            email,
            password,
        );
        res.status(201).json({ message: "Scholar registered", scholar });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { registerScholar };
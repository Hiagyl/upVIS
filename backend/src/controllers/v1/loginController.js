const loginService = require("../../services/v1/loginService");

const loginScholar = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { scholar } = await loginService.loginScholar({ email, password });
        req.session.scholarId = scholar._id;
        req.session.email = scholar.upMail;

        res.json({
            message: "Login successful",
            scholar: {
                id: scholar._id,
                fullname: scholar.name,
                email: scholar.upMail,
            },
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const checkStatus = (req, res) => {
    if (req.session.scholarId) {
        return res.json({ authenticated: true, scholarId: req.session.scholarId });
    }
    res.status(401).json({ authenticated: false });
};

const logoutScholar = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Could not log out" });
        res.clearCookie("upvis_sid");
        res.json({ message: "Logged out successfully" });
    });
};

module.exports = { loginScholar, checkStatus, logoutScholar };
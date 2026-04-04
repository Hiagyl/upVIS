const loginService = require("../../services/v1/loginService");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Wrap email and password in an object { } to match the service signature
    const { member } = await loginService.loginMember({ email, password });
    req.session.memberId = member._id;
    req.session.email = member.email;

    res.json({
      message: "Login successful",
      member: {
        id: member._id,
        fullname: member.fullname,
        email: member.email,
      },
    });
  } catch (err) {
    // This sends the "Invalid credentials" error back to React as a 400
    res.status(400).json({ message: err.message });
  }
};
const checkStatus = (req, res) => {
  if (req.session.memberId) {
    return res.json({ authenticated: true, memberId: req.session.memberId });
  }
  res.status(401).json({ authenticated: false });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Could not log out" });
    res.clearCookie("upvis_sid"); // Match the name from express loader
    res.json({ message: "Logged out successfully" });
  });
};

module.exports = { login, checkStatus, logout };

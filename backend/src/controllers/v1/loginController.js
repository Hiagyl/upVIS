const loginService = require("../../services/v1/loginService");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Wrap email and password in an object { } to match the service signature
    const data = await loginService.loginMember({ email, password });

    res.json(data);
  } catch (err) {
    // This sends the "Invalid credentials" error back to React as a 400
    res.status(400).json({ message: err.message });
  }
};

module.exports = { login };

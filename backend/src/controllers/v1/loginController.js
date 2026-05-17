const loginService = require("../../services/v1/loginService");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, role } = await loginService.login({
      email,
      password,
    });

    req.session.userId = user._id;
    req.session.email = user.upMail;
    req.session.role = role;

    res.json({
      message: "Login successful",

      user: {
        id: user._id,
        fullname: user.name,
        email: user.upMail,
        role,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const checkStatus = (req, res) => {
  if (req.session.userId) {
    return res.json({
      authenticated: true,

      user: {
        id: req.session.userId,
        email: req.session.email,
        role: req.session.role,
      },
    });
  }

  res.status(401).json({
    authenticated: false,
  });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Could not log out",
      });
    }

    res.clearCookie("upvis_sid");

    res.json({
      message: "Logged out successfully",
    });
  });
};

module.exports = {
  login,
  checkStatus,
  logout,
};

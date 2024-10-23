const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret =
  process.env.JWT_SECRET || "feaehhwohiwohe7393957wihrhsfskfhsielaocns8yhf";

exports.registerController = async (req, res) => {
  try {
    const { username, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const userDetails = await User.create({
      username,
      password: hashedPassword,
    });

    res.json(userDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
};

exports.loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDetail = await User.findOne({ username });

    if (!userDetail) {
      return res.status(400).json({ message: "User not found" });
    }

    const passOk = bcrypt.compareSync(password, userDetail.password);

    // res.json(passOk);

    if (passOk) {
      //if logged in, respond with json web token
      //instead just response as json text, here should response as json token
      jwt.sign(
        { username, id: userDetail._id },
        secret,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            return res.status(500).json({ message: "Error signing token" });
          }
          res.cookie("token", token, { httpOnly: true }).json({
            id: userDetail._id,
            username,
          });
        }
      );
    } else {
      res.status(400).json({ message: "Wrong credentials." });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.profileController = (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Please log in first." }); // Unauthorized
  }

  jwt.verify(token, secret, (err, info) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    return res.json({ message: "Authenticated", userInfo: info });
  });
};

exports.logoutController = (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  return res.json({ message: "Logged out successfully." });
};

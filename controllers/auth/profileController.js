const User = require("../../models/user");
const jwt = require("jsonwebtoken");

exports.getProfile = async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied, no token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Invalid token"});
  }
};

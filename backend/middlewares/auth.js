const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Log in to access these resources",
      });
    }

    let decodedToken;
    try {
      decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await userModel.findById(decodedToken._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

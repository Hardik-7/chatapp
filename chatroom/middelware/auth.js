const jwt = require("jsonwebtoken");
const User = require('../model/user.model')

const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(403).json({
      success:false,
      message:"A token is required for authentication"
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success:false,
        message:"Invalid Token"
      })
    }
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({
      success:false,
      message:"Invalid Token"
    })
  }
};

module.exports = { checkAuth };
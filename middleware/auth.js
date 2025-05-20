const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const tokenWithoutBearer = token.replace("Bearer ", "");
    const decoded = jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY);

    // console.log(decoded)
    req.user = {
      _id: decoded.id || decoded._id,
      email: decoded.email,
      role: decoded.role,
    };
    // req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(400).json({ message: "Invalid or Expired Token" });
  }
};

const User = require("../models/User");
const Role = require("../models/Role");

exports.checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(403).json({ message: "Access Denied. No user found." });
      }

      // Fetch user along with role and its permissions
      const user = await User.findById(req.user._id).populate({
        path: "role",
        populate: { path: "permissions", select: "name" }, // Populate role permissions only
      });

      if (!user) {
        return res.status(403).json({ message: "Access Denied. User not found." });
      }

      if (!user.role) {
        return res.status(403).json({ message: "Access Denied. No role assigned." });
      }

      // Extract permissions from the role
      const rolePermissions = user.role.permissions
        ? user.role.permissions.map((p) => p.name)
        : [];

      // Merge and check permissions
      if (!rolePermissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "Access Denied. Insufficient Permissions." });
      }

      next();
    } catch (error) {
      console.error("Error in checkPermission:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
};

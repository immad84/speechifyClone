const User = require("../models/User");
const Role = require("../models/Role");
const { Model, Language } = require("../models/Model")

/**
 * Get All Users (Admin Only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Find the Role ID of "superadmin"
    const superAdminRole = await Role.findOne({ name: "superadmin" });

    // Find all users except the ones with the Super Admin role
    const users = await User.find({ role: { $ne: superAdminRole._id } })
      .select("-password") // Exclude password field
      .populate({
        path: "role",
        select: "name", // Populate only role name, excluding permissions
      });

    res.status(200).json({
      data: { users }, // Wrap users in data object
      isSuccess: true,
      statusCode: 200,
      message: "Action performed successfully",
      developerError: ""
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      data: {},
      isSuccess: false,
      statusCode: 500,
      message: "Server Error",
      developerError: process.env.NODE_ENV === "development" ? error.message : ""
    });
  }
};

/**
 * assign Role Any User (Super Admin only)
 */
exports.assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body; // userId and role from request body

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find role by name
    const roleData = await Role.findOne({ name: role });
    if (!roleData)
      return res.status(400).json({ message: "Invalid role provided" });

    // Assign role
    user.role = roleData._id;
    user.permissions = roleData.permissions; // Assign associated permissions

    await user.save();

    res.status(200).json({
      message: "Role updated successfully",
      user: {
        id: user._id,
        role: roleData.name,
        permissions: roleData.permissions,
      },
    });
  } catch (error) {
    console.error("Error in role assignment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Delete Any User (Super Admin only)
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Super Admin cannot delete themselves." });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.addModel = async (req, res) => {
  try {
    const { modelName, languages } = req.body; // userId and role from request body

    let model = await Model.findOne({ name: modelName });
    if (model) {
      return res.status(409).json({ message: "Model already exists." });
    }
    
    const languageDocs = await Promise.all(
      languages.map(async (lang) => {
        let languageDoc = await Language.findOne({ name: lang });
        if (!languageDoc) {
          languageDoc = await Language.create({ name: lang, models: [] });
        }
        return languageDoc;
      })
    );

    model = await Model.create({
      name: modelName,
      languages: languageDocs.map((langDoc) => langDoc._id),
    });

    await Promise.all(
      languageDocs.map(async (langDoc) => {
        if (!langDoc.models.includes(model._id)) {
          langDoc.models.push(model._id);
          await langDoc.save();
        }
      })
    );

    res.status(201).json({
      message: "Model saved successfully",
      model: {
        name: model.name,
        languages: languageDocs.map((lang) => lang.name),
      },
    });

  } catch (error) {
    console.error("Error in saving:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

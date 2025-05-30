const User = require("../models/User");
const Role = require("../models/Role");
const { Model, Language } = require("../models/Model");

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
      developerError: "",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      data: {},
      isSuccess: false,
      statusCode: 500,
      message: "Server Error",
      developerError:
        process.env.NODE_ENV === "development" ? error.message : "",
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

exports.addLanguage = async (req, res) => {
  try {
    if (!req.body || !req.body.name || !req.body.code) {
      res.status(400).json({
        success: false,
        message: `Missing Required fields name and code`,
      });
    }
    const { name } = req.body;
    let language = await Language.findOne({ name });
    if (language) {
      res
        .status(403)
        .json({ success: false, message: "Language Already Added. " });
    } else {
      const langname = req.body["name"];
      const langcode = req.body["code"];
      language = new Language({ name: langname, code: langcode, models: [] });
      await language.save();
      const { id, name, code } = language;
      res.status(201).json({
        success: true,
        message: "Language Added Successfully..",
        data: { id, name, code },
      });
    }
  } catch (error) {
    const { message } = error;
    res.status(500).json({
      success: false,
      message: "Something Went Wrong..",
      error: message,
    });
  }
};

exports.getAllLanguages = async (req, res) => {
  try {
    const options = { limit: 5 };
    const languages = await Language.find({}, null, options);
    if (languages) {
      let data = [];
      languages.forEach((language) => {
        const { _id, name, code } = language;
        data.push({ id: _id, name, code });
      });
      res
        .status(200)
        .json({ status: true, message: "Languages fetched..", data });
    } else {
      res
        .status(404)
        .json({ status: false, message: "No languages found. ", data: {} });
    }
  } catch (error) {
    const { message } = error;
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: message,
    });
  }
};

exports.getLanguage = async (req, res) => {
  try {
    const { name } = req.params;
    const language = await Language.findOne({ name });
    if (language) {
      const { _id, name, code } = language;
      res.json({ message: "Language fetched.", data: { id: _id, name, code } });
    } else {
      res.json({ message: "Language Not Found ..." });
    }
  } catch (error) {
    res.json({ message: "error", error: error });
  }
};

exports.deleteLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const language = await Language.findByIdAndDelete(id);
    if (language) {
      const { name, code } = language;
      res.json({ message: "Language Deleted...", data: { name, code } });
    } else {
      res.json({ message: "language does not exist. " });
    }
    //   Language.findByIdAndDelete(id, function(err, document) {
    //     if (err) {
    //       res.json({message: "Error deleting language", error: err});
    //    } else {
    //     res.json({message: 'Langauge deleted.', data: document})
    //    }
    //  });
  } catch (error) {
    res.json({ message: "Error", error: error });
  }
};

exports.updateLanguage = async (req, res) => {
  try {
    const update = req.body;
    const options = { returnDocument: "after" };
    const updated_lang = await Language.findByIdAndUpdate(
      update.id,
      update,
      options
    );
    if (updated_lang) {
      const { _id, name, code } = updated_lang;
      res.json({
        message: "language updated..",
        updated_lang: { id: _id, name, code },
      });
    } else {
      res.json({ message: "Language Not Found..", data: update });
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "something went wrong while updating the language..",
      error: error,
    });
  }
};

exports.patchLanguage = async (req, res) => {
  try {
    const update = req.body;
    const options = { returnDocument: "after" };
    const updated_lang = await Language.findByIdAndUpdate(
      update.id,
      update,
      options
    );
    if (updated_lang) {
      const { _id, name, code } = updated_lang;
      res.json({
        message: "language updated.",
        updated_lang: { id: _id, name, code },
      });
    } else {
      res.json({ message: "Language Not Found..", data: update });
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "something went wrong while updating the language..",
      error: error,
    });
  }
};

exports.addModel = async (req, res) => {
  try {
    // Get data from request Body
    const { type, languages, name, datasets } = req.body;

    // Check model already exists or not
    let model = await Model.findOne({ name });
    if (model) {
      return res.status(409).json({ message: "Model already exists." });
    }

    // Create Language Documents
    const languageDocs = await Promise.all(
      languages.map(async ([name, code]) => {
        let langDoc = await Language.findOne({ name: name });
        if (!langDoc) {
          langDoc = await Language.create({
            name: name,
            code: code,
            models: [],
          });
        }
        return langDoc;
      })
    );

    model = await Model.create({
      type: type,
      languages: languageDocs.map((langDoc) => langDoc._id),
      name: name,
      // datasets: datasets.map((ds) => ds)
      datasets: datasets,
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
        type: type,
        languages: languageDocs.map((lang) => lang.name),
        name: model.name,
        datasets: datasets,
      },
    });
  } catch (error) {
    console.error("Error in saving:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

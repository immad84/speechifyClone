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


exports.addLanguage = async (req, res) => {
  try {
    const {name, code} = req.body
    let language = await Language.findOne({name})
    if (language) {
      res.json({message: 'Language Already Added. '})
    } else {
      language = new Language({name, code, models: [ ]})
      await language.save()
      res.json({message: language})
    }
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}


exports.getAllLanguages = async (req, res) => {
  try {
    const languages =await Language.find()
    if (languages) {
      let data = [ ]
      languages.forEach((language) => {
        const {_id, name, code} = language
        data.push({id: _id, name, code})
      })
      res.json({message: "Languages fetched..", data})
    } else {
      res.json({message: "No languages found. "})
    }
  } catch (error) {
    res.json({message: "There is an error", error: error})
  }
}


exports.getLanguage = async (req, res) => {
  try {
    const {name} = req.params
    const language = await Language.findOne({name})
    if(language) {
      const {_id, name, code} = language
      res.json({message: "Language fetched.", data: {id: _id, name, code}})
    } else {
      res.json({message: "Language Not Found ..."})
    }
  } catch (error) {
    res.json({message: "error", error: error})
  }
}


exports.deleteLanguage = async (req, res) => {
  try {
    const {id} = req.params
    Model.findByIdAndDelete(id, function(err, document) {
      if (err) {
        res.json({message: "Error deleting language", error: err});
     } else {
      res.json({message: 'Langauge deleted.', data: document})
     }
   });
  } catch (error) {
    res.json({message: "Error", error: error})
  }
}

exports.updateLanguage = async (req, res) => {
  res.json({message: "inside update Language Controller. "})
}

exports.patchLanguage = async (req, res) => {
  res.json({message: "inside patch Languages Controller. "})
}



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
        let langDoc = await Language.findOne({name: name})
        if(!langDoc) {
          langDoc = await Language.create({name: name, code: code, models: [ ]})
        } 
        return langDoc
      })
    );

    model = await Model.create({
      type: type,
      languages: languageDocs.map((langDoc) => langDoc._id), 
      name: name,
      // datasets: datasets.map((ds) => ds)
      datasets: datasets
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
         datasets: datasets
      },
    });

  } catch (error) {
    console.error("Error in saving:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

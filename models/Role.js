const mongoose = require("mongoose");
const PermissionSchema = require("./Permission");
const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission", // Reference to Role Model
      required: true,
    },
  ],
});

module.exports = mongoose.model("Role", roleSchema);


require('dotenv').config();
const mongoose = require("mongoose");

const Role = require("./models/Role");
const Permission = require("./models/Permission");

mongoose.connect(process.env.MONGO_URI);

const rolesData = [
  { name: "user", permissions: ["read_posts", "comment", "edit_own_profile"] },
  {
    name: "writer",
    permissions: [  
      "read_posts",
      "comment",
      "edit_own_profile",
      "create_posts",
      "edit_own_posts",
    ],
  },
  {
    name: "admin",
    permissions: [
      "read_posts",
      "comment",
      "edit_own_profile",
      "create_posts",
      "edit_all_posts",
      "delete_posts",
      "manage_users",
    ],
  },
  {
    name: "superadmin",
    permissions: [
      "read_posts",
      "comment",
      "edit_own_profile",
      "create_posts",
      "edit_all_posts",
      "delete_posts",
      "manage_users",
      "manage_roles",
      "access_system_settings",
      "view_users", 
      "delete_users",
      "add_tts_model"
    ],
  },
];



const permissionsData = [
  "read_posts",
  "comment",
  "edit_own_profile",
  "create_posts",
  "edit_all_posts",
  "delete_posts",
  "manage_users",
  "manage_roles",
  "access_system_settings",
  "view_users", 
  "delete_users", 
  "add_tts_model"
];



const seedDB = async () => {
  try {
    console.log("Seeding Database...");

    // Delete existing roles and permissions
    await Role.deleteMany({});
    await Permission.deleteMany({});

    // Insert permissions and get the inserted documents
    const insertedPermissions = await Permission.insertMany(
      permissionsData.map((perm) => ({ name: perm }))
    );

    // Convert permissions array into an object for easy lookup
    const permissionMap = insertedPermissions.reduce((acc, perm) => {
      acc[perm.name] = perm._id;
      return acc;
    }, {});

    // Prepare roles with proper permission IDs
    const rolesToInsert = rolesData.map((role) => ({
      name: role.name,
      permissions: role.permissions
        .map((perm) => permissionMap[perm])
        .filter((permId) => permId !== undefined), 
    }));

    // Insert roles
    await Role.insertMany(rolesToInsert);

    console.log("Database Seeded Successfully!");
  } catch (error) {
    console.error("Error Seeding Database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();

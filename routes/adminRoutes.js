const express = require("express");
const { checkPermission } = require("../middleware/permissions");
const {authMiddleware}=require("../middleware/auth")
const { assignRole, deleteUser,getAllUsers, addModel } = require("../controllers/adminController");
const router = express.Router();


/**
 * @swagger
 * /admin/view_users:
 *   get:
 *     summary: Get all users (Super Admin only)
 *     tags: [AdminRoutes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       403:
 *         description: Forbidden - Only admins can access
 *       401:
 *         description: Unauthorized - Token missing or invalid
 */
router.get("/view_users", authMiddleware, checkPermission("view_users"), getAllUsers);


/**
 * @swagger
 * /admin/assign-role:
 *   put:
 *     summary: Assign role to a user (Super Admin only)
 *     tags: [AdminRoutes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "65a7d12b9e3f5a0012d34abc"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       403:
 *         description: Forbidden - Only super admin can assign roles
 *       400:
 *         description: Bad request - Invalid data
 *       401:
 *         description: Unauthorized - Token missing or invalid
 */
router.put("/assign-role", authMiddleware, checkPermission("manage_roles"), assignRole);


/**
 * @swagger
 * /admin/delete-user/{id}:
 *   delete:
 *     summary: Delete any user (Super Admin only)
 *     tags: [AdminRoutes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden - Only super admin can delete users
 *       404:
 *         description: Not Found - User does not exist
 *       401:
 *         description: Unauthorized - Token missing or invalid
 */
router.delete("/delete-user/:id",authMiddleware, checkPermission("delete_users"), deleteUser);



/**
 * @swagger
 * /admin/add-model:
 *   post:
 *     summary: Add a TTS Model (Super Admin only)
 *     tags: [AdminRoutes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "tts_models or vocoder_models"
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [["English","en"], ["French", "fr"]]
 *               name:
 *                 type: string
 *                 example: "tacotron2"
 *               datasets:
 *                 type: array
 *                 items: 
 *                    type: string
 *                 example: ["cv", "ljspeech"]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       201:
 *         description: Model saved successfully
 *       403:
 *         description: Forbidden - Only super admin can assign roles
 *       400:
 *         description: Bad request - Invalid data
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       409:
 *         description: Model - Already Exist.
 *       500:
 *         description: Error
 */
router.post("/add-model", authMiddleware, checkPermission("manage_roles"), addModel);


module.exports = router;

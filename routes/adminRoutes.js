const express = require("express");
const { checkPermission } = require("../middleware/permissions");
const {authMiddleware}=require("../middleware/auth")
const {   assignRole, 
                deleteUser,getAllUsers, 
                addLanguage,  
                getAllLanguages, 
                getLanguage, 
                deleteLanguage, 
                updateLanguage, 
                patchLanguage, 
                addModel
             } = require("../controllers/adminController");

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
 * /admin/add-language:
 *   post:
 *     summary: Add a Language (Admin only)
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
 *               name:
 *                 type: string
 *                 example: "English"
 *               code:
 *                 type: string
 *                 example: "en"
 *     responses:
 *       200:
 *         description: Language added successfully
 */
router.post("/add-language", authMiddleware, checkPermission("manage_roles"), addLanguage);


/**
 * @swagger
 * /admin/view-languages:
 *   get:
 *     summary: Get All Languages (Admin only)
 *     tags: [AdminRoutes]
 *     security:
 *       - BearerAuth: [ ]
 *     responses:
 *       200:
 *         description: Language fetched successfully
 */
router.get("/view-languages", authMiddleware, checkPermission("manage_roles"), getAllLanguages);



/**
 * @swagger
 * /admin/view-language/{name}:
 *   get:
 *     summary: Get A Language with name (Super Admin only)
 *     tags: [AdminRoutes]
 *     security:
 *       - BearerAuth: [ ]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: name of the language to fetch
 *     responses:
 *       200:
 *         description: Language fetched successfully
 */
router.get("/view-language/:name",authMiddleware, checkPermission("add_tts_model"), getLanguage);


/**
 * @swagger
 * /admin/delete-language/{id}:
 *   delete:
 *     summary: Delete any language (Admin only)
 *     tags: [AdminRoutes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the language to delete
 *     responses:
 *       200:
 *         description: Language deleted successfully
 *      
 */

router.delete("/delete-language/:id", authMiddleware, checkPermission("add_tts_model"), deleteLanguage)


/**
 * @swagger
 * /users/update-language:
 *   put:
 *     summary: Update Language (Super Admin)
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
 *               name:
 *                 type: string
 *                 example: "Urdu"
 *               code:
 *                 type: string
 *                 example: "ur"
 *     responses:
 *       200:
 *         description: language updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: language updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */

router.put("/update-language", authMiddleware, checkPermission("add_tts_model"), updateLanguage);


/**
 * @swagger
 * /admin/patch-language:
 *   patch:
 *     summary: patch the language (Super Admin only)
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
 *               Id:
 *                 type: string
 *                 format: uuid
 *                 example: "65a7d12b9e3f5a0012d34abc"
 *     responses:
 *       200:
 *         description: updated successfully
 */

router.patch("/patch-language", authMiddleware, checkPermission("add_tts_models"), patchLanguage)


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

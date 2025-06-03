const express = require("express");

const { checkPermission } = require("../middleware/permissions");
const { authMiddleware } = require("../middleware/auth");

const {
  addLanguage,
  addLanguages,
  getAllLanguages,
  getLanguage,
  deleteLanguage,
  updateLanguage,
  patchLanguage,
} = require("../controllers/languageController");

const router = express.Router();

/**
 * @swagger
 * /language/add-language:
 *   post:
 *     summary: Add a Language (Admin only)
 *     tags: [Language]
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
router.post(
  "/add-language",
  authMiddleware,
  checkPermission("add_tts_model"),
  addLanguage
);

/**
 * @swagger
 * /language/add-languages:
 *   post:
 *     summary: Add Languages (Admin only)
 *     tags: [Language]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               modelID:
 *                 type: string
 *                 format: uuid
 *                 example: "65a7d12b9e3f5a0012d34abc"
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
router.post(
  "/add-languages",
  authMiddleware,
  checkPermission("add_tts_model"),
  addLanguages
);

/**
 * @swagger
 * /language/view-languages:
 *   get:
 *     summary: Get All Languages (Admin only)
 *     tags: [Language]
 *     security:
 *       - BearerAuth: [ ]
 *     responses:
 *       200:
 *         description: Language fetched successfully
 */
router.get(
  "/view-languages",
  authMiddleware,
  checkPermission("add_tts_model"),
  getAllLanguages
);

/**
 * @swagger
 * /language/view-language/{name}:
 *   get:
 *     summary: Get A Language with name (Super Admin only)
 *     tags: [Language]
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
router.get(
  "/view-language/:name",
  authMiddleware,
  checkPermission("add_tts_model"),
  getLanguage
);

/**
 * @swagger
 * /language/delete-language/{id}:
 *   delete:
 *     summary: Delete any language (Admin only)
 *     tags: [Language]
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
router.delete(
  "/delete-language/:id",
  authMiddleware,
  checkPermission("add_tts_model"),
  deleteLanguage
);

/**
 * @swagger
 * /language/update-language:
 *   put:
 *     summary: Update Language (Super Admin)
 *     tags: [Language]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "65a7d12b9e3f5a0012d34abc"
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
 */
router.put(
  "/update-language",
  authMiddleware,
  checkPermission("add_tts_model"),
  updateLanguage
);

/**
 * @swagger
 * /language/patch-language:
 *   patch:
 *     summary: patch the language (Super Admin only)
 *     tags: [Language]
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
router.patch(
  "/patch-language",
  authMiddleware,
  checkPermission("add_tts_model"),
  patchLanguage
);

module.exports = router;

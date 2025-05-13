const express = require("express");
const { authMiddleware } = require("../middleware/auth");
// const { checkPermission, assignRole } = require("../middleware/permissions");
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/imageController');


/**
 * @swagger
 * /img/upload-image:
 *   post:
 *     summary: Upload a user's profile image
 *     tags:
 *       - img
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImg:
 *                 type: string
 *                 format: binary
 *                 description: The profile image to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: No file uploaded or file is invalid
 */

// router.post('/upload-image', upload.single('profileImg'), uploadImage);
router.post('/upload-image', upload.single('profileImg'), uploadImage);

module.exports = router;
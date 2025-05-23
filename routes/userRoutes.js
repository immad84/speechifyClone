const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const router = express.Router();
const { getProfile, updateProfile, textToSpeech, getStatus, getTTSModles, getTTSModle } = require('../controllers/userController');
const upload = require('../middleware/upload');


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         role:
 *           type: string
 *           example: 507f1f77bcf86cd799439012
 *         profilePicture:
 *           type: string
 *           example: https://example.com/profile.jpg
 *         isVerified:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - username
 *         - email
 *         - role
 */



/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get list of all TTS models with supported languages
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of TTS models retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: Array
 *               items: 
 *                 type: object
 *                 properties: 
 *                   _id: 
 *                   type: string
 *                   example: "6638d230a35b1b2f3898d193"
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.get('/profile', authMiddleware, getProfile);



/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile (using pre-uploaded image URL)
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@gmail.com
 *               profileImg:
 *                 type: string
 *                 format: uri
 *                 example: "https://yourdomain.com/uploads/12345-profile.jpg"
 *                 description: URL of the profile image (uploaded separately via /api/upload)
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: Profile updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (validation error or existing email)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.put('/profile', authMiddleware, updateProfile);


/**
 * @swagger
 * /users/get-tts-models:
 *   get:
 *     summary: Get all TTS models with supported languages
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of TTS models
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: tts_models/en/ek1/tacotron2
 *                       languages:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 664b9dba2f2d44383bd7e40e
 *                             name:
 *                               type: string
 *                               example: English
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */


router.get('/get-tts-models', authMiddleware, getTTSModles)



/**
 * @swagger
 * /users/get-tts-model/{name}:
 *   get:
 *     summary: Get a specific TTS model by name
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of The Model.
 *     responses:
 *       200:
 *         description: List of TTS models
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: tts_models/en/ek1/tacotron2
 *                       languages:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 664b9dba2f2d44383bd7e40e
 *                             name:
 *                               type: string
 *                               example: English
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */


router.get('/get-tts-model/:name', authMiddleware, getTTSModle)


/**
 * @swagger
 * /users/synthesis-text-to-speech:
 *   post:
 *     summary: Convert text to speech and stream audio
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     description: Accepts text and returns generated speech audio as a WAV stream.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Hello, welcome to our platform."
 *     responses:
 *       200:
 *         description: Successfully streamed the audio.
 *         content:
 *           audio/wav:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid input text
 *       500:
 *         description: Server error while fetching or streaming the audio.
 */

router.post('/synthesis-text-to-speech', authMiddleware, textToSpeech)



/**
 * @swagger
 * /users/get-status/{taskId}:
 *   get:
 *     summary: Check the status of a TTS task
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     description: Returns the status of a text-to-speech generation task.
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the TTS task to check.
 *     responses:
 *       200:
 *         description: Task status returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: completed
 *                 file:
 *                   type: string
 *                   example: output.wav
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Server error while checking task status.
 */

router.get('/get-status/:taskId', authMiddleware, getStatus)



// /**
//  * @swagger
//  * /users/get-audio:
//  *   get:
//  *     summary: Stream generated TTS audio
//  *     tags: [User]
//  *     security:
//  *       - BearerAuth: []
//  *     description: Returns the latest generated speech audio as a WAV stream.
//  *     responses:
//  *       200:
//  *         description: Successfully streamed the audio.
//  *         content:
//  *           audio/wav: 
//  *             schema:
//  *               type: string
//  *               format: binary
//  *       500:
//  *         description: Server error while fetching or streaming the audio.
//  */

// router.get('/get-audio', authMiddleware, getSpeech)



module.exports = router;



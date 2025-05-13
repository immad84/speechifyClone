const express = require("express");
const { register,verifyEmail, login,resendOtp, forgotPassword, verifyOtp, resetPassword } = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               username:
 *                 type: string
 *                 example: "JohnDoe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: "user"
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.post("/register", register);


/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify user's email with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@gmail.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid OTP
 *       500:
 *         description: Internal Server Error
 */
router.post("/verify-email", verifyEmail);


/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend verification email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@gmail.com"
 *     responses:
 *       200:
 *         description: Verification email resent successfully
 *       400:
 *         description: Email is already verified
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/resend-otp", resendOtp);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Wrong credentials
 *       403:
 *         description: Email not verified
 *       500:
 *         description: Internal Server Error
 */
router.post("/login", login);


/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@gmail.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid email or email not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@gmail.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Internal Server Error
 */
router.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using a verified OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@gmail.com"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid OTP or email
 *       500:
 *         description: Internal Server Error
 */
router.post("/reset-password", resetPassword);




module.exports = router;

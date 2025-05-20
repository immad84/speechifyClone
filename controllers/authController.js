const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");
const sendEmail = require("../config/emailConfig");
require("dotenv").config();
const crypto = require("crypto");


exports.register = async (req, res) => {
  try {
    // console.log("Registration request received:", req.body);
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      role = "user",
    } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({
        data: {},
        isSuccess: false,
        statusCode: 400,
        message: "All fields are required",
        developerError: "Missing required fields"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const trimmedUsername = username.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        data: {},
        isSuccess: false,
        statusCode: 400,
        message: "Invalid email format",
        developerError: "Email validation failed"
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: trimmedUsername }]
    });

    if (existingUser) {
      const conflictField = existingUser.email === normalizedEmail ? 'email' : 'username';
      return res.status(409).json({
        data: {},
        isSuccess: false,
        statusCode: 409,
        message: `${conflictField} already exists`,
        developerError: `${conflictField} conflict`
      });
    }

    const roleData = await Role.findOne({ name: role }).populate("permissions");
    if (!roleData) {
      return res.status(400).json({
        data: {},
        isSuccess: false,
        statusCode: 400,
        message: "Invalid role provided",
        developerError: "Role not found"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: trimmedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      role: roleData._id,
      permissions: roleData.permissions.map(perm => perm._id),
      isVerified: false,
      verificationToken,
      profilePicture: "https://example.com/default-profile.jpg"
    });

    // Save user and OTP without transaction
    await newUser.save();

    try {
      // await Otp.create({
      //   email: normalizedEmail,
      //   otp: verificationToken,
      //   createdAt: new Date()
      // });
      const otpDoc = new Otp({ email: normalizedEmail, otp: verificationToken, createdAt: new Date() });
      await otpDoc.save();
      console.log('OTP Saved in MONGO_DB Successfully. ')
    } catch(err){
      console.log(err)
    }

    await sendEmail(
      normalizedEmail,
      "Verify Your Email",
      `Your verification code is: ${verificationToken}\n\nThis code will expire in 10 minutes.`
    );

    const userResponse = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      email: newUser.email,
      role: roleData.name,
      profilePicture: newUser.profilePicture
    };

    return res.status(201).json({
      data: userResponse,
      isSuccess: true,
      statusCode: 201,
      message: "Registration successful. Please check your email for verification.",
      developerError: ""
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      data: {},
      isSuccess: false,
      statusCode: 500,
      message: "Registration failed",
      developerError: process.env.NODE_ENV === 'development' ? error.message : ""
    });
  }
};


 
// email verification controller
exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedOtp = otp.trim();

  try {
    // 1. Check OTP record
    const otpRecord = await Otp.findOne({ 
      email: normalizedEmail,
      otp: normalizedOtp
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // 2. Check OTP expiration (10 minutes)
    const now = new Date();
    const otpAge = (now - otpRecord.createdAt) / (1000 * 60);  // (1000 * 60) = 60000 Miliseconds in a minute
    if (otpAge > 10) {
      await Otp.deleteMany({ email: normalizedEmail });
      return res.status(400).json({ error: "OTP has expired" });
    }

    // 3. Verify user
    const user = await User.findOne({ email: normalizedEmail })
      .populate({
        path: "role",
        populate: { path: "permissions" }
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.verificationToken !== normalizedOtp) {
      return res.status(400).json({ error: "Verification failed" });
    }

    // 4. Mark as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // 5. Clean up OTP records
    await Otp.deleteMany({ email: normalizedEmail });

    // 6. Generate JWT token
    // const token = jwt.sign( 
    //   { 
    //     id: user._id, 
    //     role: user.role,
    //     email: user.email 
    //   },
    //   process.env.SECRET_KEY,
    //   { expiresIn: "7d" }
    // );

    // 7. Return success response with token
    res.status(200).json({
      message: "Email verified successfully!",
      // token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role.name,
        isVerified: true
      }
    });

  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ 
      error: "Email verification failed",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// resend verification Email
exports.resendOtp = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // 1. Find the user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // 3. Delete all previous OTPs for this email
    await Otp.deleteMany({ email: normalizedEmail });

    // 4. Generate new verification token
    const newVerificationToken = crypto.randomInt(100000, 999999).toString();

    // 5. Update user record with new token
    user.verificationToken = newVerificationToken;
    await user.save();

    // 6. Store new OTP in database
    await Otp.create({
      email: normalizedEmail,
      otp: newVerificationToken,
      createdAt: new Date()
    });

    // 7. Send new verification email
    await sendEmail(
      normalizedEmail,
      "Your New Verification Code",
      `Your new verification code is: ${newVerificationToken}\n\nThis code will expire in 5 minutes.`
    );

    res.status(200).json({ 
      message: "New verification email sent successfully!",
      // In development, you might want to return the OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp: newVerificationToken })
    });

  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ 
      error: "Error resending verification email",
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
};



//  login  controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .populate({
        path: "role",
        populate: { path: "permissions" },
      });
    
    if (!user) {
      return res.status(400).json({
        data: {},
        isSuccess: false,
        statusCode: 400,
        message: "Invalid credentials",
        developerError: process.env.NODE_ENV === 'development' ? "User not found with provided email" : ""
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        data: {},
        isSuccess: false,
        statusCode: 400,
        message: "Invalid credentials",
        developerError: process.env.NODE_ENV === 'development' ? "Password does not match" : ""
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        data: {},
        isSuccess: false,
        statusCode: 403,
        message: "Email not verified. Please check your email for verification instructions.",
        developerError: process.env.NODE_ENV === 'development' ? "User email not verified" : ""
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, 
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          role: user.role.name,
          isVerified: user.isVerified,
        }
      },
      isSuccess: true,
      statusCode: 200,
      message: "Login successful",
      developerError: ""
    });
    
  } catch (error) {
    res.status(500).json({
      data: {},
      isSuccess: false,
      statusCode: 500,
      message: "Server error",
      developerError: process.env.NODE_ENV === 'development' ? error.message : ""
    });
  }
};



// Step 1: Send OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    // console.log("Generated OTP:", otpCode);

    // Store OTP in database
    await Otp.create({ email, otp: otpCode });

    // Send email
    await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otpCode}`);

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error sending OTP" });
  }
};

// Step 2: Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ error: "Invalid OTP" });

    // OTP verified successfully
    await Otp.deleteMany({ email }); // Delete OTP after verification
    res
      .status(200)
      .json({ message: "OTP verified. Proceed to reset password." });
  } catch (error) {
    res.status(500).json({ error: "Error verifying OTP" });
  }
};

// Step 3: Reset Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting password" });
  }
};


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");
const { v4: uuidv4 } = require("uuid")
const Redis = require("ioredis")
const path = require("path")

const axios = require('axios');
const redis = new Redis()

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id; 

    // const user = await User.findById(userId) 
    //   .select("-password -verificationToken -__v")
    //   .populate("role", "name permissions");

    const user = await User.findById(userId)
  .select("-password -verificationToken -__v -role"); // Exclude role entirely

    if (!user) {
      return res.status(404).json({
        data: {},
        isSuccess: false,
        statusCode: 404,
        message: "User not found",
        developerError: "",
      });
    }

    return res.status(200).json({
      data: user,
      isSuccess: true,
      statusCode: 200,
      message: "Profile retrieved successfully",
      developerError: "",
    });
  } catch (error) {
    console.error("Error in getProfile:", error.message); // Log the error message
    return res.status(500).json({
      data: {},
      isSuccess: false,
      statusCode: 500,
      message: "Failed to retrieve profile",
      developerError:
        process.env.NODE_ENV === "development" ? error.message : "",
    });
  }
};


// update Profile Controller
exports.updateProfile = async (req, res) => {
  try {
      const userId = req.user._id;
      const { firstName, lastName, email, profileImg } = req.body; // profileImg is now a URL

      // Validate user exists
      const existingUser = await User.findById(userId);
      if (!existingUser) {
          return res.status(404).json({
              data: {},
              isSuccess: false,
              statusCode: 404,
              message: "User not found",
              developerError: "User ID not found in database",
          });
      }

      // Check if any data was provided to update
      if (!firstName && !lastName && !email && !profileImg) {
          return res.status(400).json({
              data: {},
              isSuccess: false,
              statusCode: 400,
              message: "No data provided for update",
              developerError: "Request body is empty",
          });
      }

      // Validate email format if provided
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return res.status(400).json({
              data: {},
              isSuccess: false,
              statusCode: 400,
              message: "Invalid email format",
              developerError: "Email validation failed",
          });
      }

      // Check for existing email (only if email is being changed)
      if (email && email.toLowerCase().trim() !== existingUser.email.toLowerCase()) {
          const emailExists = await User.findOne({
              _id: { $ne: userId },
              email: email.toLowerCase().trim(),
          });

          if (emailExists) {
              return res.status(409).json({
                  data: {},
                  isSuccess: false,
                  statusCode: 409,
                  message: "Email already exists",
                  developerError: "Email conflict",
              });
          }
      }

      // Prepare update data
      const updateData = {};
      if (firstName) updateData.firstName = firstName.trim();
      if (lastName) updateData.lastName = lastName.trim();
      if (profileImg) updateData.profilePicture = profileImg; // Store the URL
      
      // Handle email update (with verification status reset if changed)
      if (email) {
          const newEmail = email.toLowerCase().trim();
          if (newEmail !== existingUser.email.toLowerCase()) {
              updateData.email = newEmail;
              updateData.isVerified = false;
              // Send verification email if needed
          }
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
          userId, 
          updateData, 
          {
              new: true,
              runValidators: true,
          }
      ).select("-password -verificationToken -__v -resetPasswordToken -resetPasswordExpires");

      return res.status(200).json({
          data: updatedUser,
          isSuccess: true,
          statusCode: 200,
          message: "Profile updated successfully",
          developerError: "",
      });
  } catch (error) {
      console.error("Profile Update Error:", error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
          const errors = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({
              data: {},
              isSuccess: false,
              statusCode: 400,
              message: "Validation error",
              developerError: errors.join(', '),
              errors: errors
          }); 
      }

      return res.status(500).json({
          data: {},
          isSuccess: false,
          statusCode: 500,
          message: "Failed to update profile",
          developerError: process.env.NODE_ENV === "development" ? error.message : "",
      });
  }
};


// text to speech Controller
exports.textToSpeech = async (req, res) => {
    const { text } = req.body;
    const taskId = uuidv4()

    await redis.xadd('tts_stream', '*', 'task_id', taskId, 'text', text)
    await redis.hset('tts_status:${taskId}', 'status', 'queued')

    res.json({taskId})
};



exports.getStatus = async (req, res) => {
  const taskId = req.params.taskId;
  const status = await redis.hgetall(`tts_status:${taskId}`);

  if (!status.status) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const response = {
    taskId,
    status: status.status,
  };exports.getStatus = async (req, res) => {
    const taskId = req.params.taskId
    const status = await redis.hgetall('tts_status:${taskId}')
  
    if (!status.status)
      return res.status(404).send({error: 'Task Not Found'})
  
    const response = {
      taskId,
      status: status.status
    }
  
    if(status.status === 'done' && status.file){
      response.fileUrl = `${req.protocol}://${req.get('host')}${status.file}`;
    }
    res.json(response)
  }

  if (status.status === 'done' && status.file) {
    response.fileUrl = `${req.protocol}://${req.get('host')}${status.file}`;
  }

  res.json(response);
};


// exports.getSpeech = async (req, res) => {
//     try {
//       const response = await axios({
//         url: 'http://localhost:5005/audio',
//         method: 'GET',
//         responseType: 'stream'
//       });
  
//       res.setHeader('Content-Type', 'audio/wav');
//       response.data.pipe(res);
//     } catch (error) {
//       console.error('Audio fetch error:', error.message);
//       res.status(500).send('Could not fetch audio');
//     }
//   };
  
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const setupSwagger = require("./config/swagger");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();
const imageRoutes = require("./routes/imageRoutes");
const morgan = require('morgan');
const moment = require('moment-timezone');


port = process.env.PORT
const app = express();

connectDB();
setupSwagger(app);

// app.use(cors({ origin: "*" }));
// app.use(cors());
app.use(morgan("tiny"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use('/audio', express.static(path.join(__dirname, 'public/audio')));


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/img", require("./routes/imageRoutes")); 
app.use("/api/admin", require("./routes/adminRoutes")); 

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});


// app.use(cors({
//   origin: 'https://87d9-203-128-20-62.ngrok-free.app'
//   // origin: 'https://localhost'
// }));



// Start Server
app.listen(port,() => {
  // console.log(`Server is running on port ${port}`);
  console.log(`✅ [INFO] Server started and listening on port ${port}............`);
});

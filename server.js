const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const setupSwagger = require("./config/swagger");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();
const imageRoutes = require("./routes/imageRoutes");


const app = express();
const port = process.env.PORT || 4000;
// Connect to Database
connectDB();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use(cors());

// Setup Swagger
setupSwagger(app);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/img", require("./routes/imageRoutes")); 
app.use("/api/admin", require("./routes/adminRoutes")); 

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});


app.use(cors({
  origin: 'https://3c61-203-128-20-169.ngrok-free.app'
}));


// Start Server
app.listen(port,() => {
  console.log(`Server is running on port ${port}`);
});

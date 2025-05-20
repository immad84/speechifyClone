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


const app = express();
const port = process.env.PORT || 4000;


// Connect to Database
connectDB();


morgan.token('timestamp', () => {
  return moment().tz('Asia/Karachi').format('HH:mm:ss.SSS z');
});
morgan.token('user', (req) => {
  return req.user?.email || 'Guest';
});
const alignedLogger = (tokens, req, res) => {
  const timestamp = tokens.timestamp(req, res).padEnd(20);
  const method = tokens.method(req, res).padEnd(10);
  const url = tokens.url(req, res).padEnd(46);
  const statusCode = tokens.status(req, res);
  const status = `${statusCode} ${statusCode < 400 ? 'OK ' : 'Bad'}`.padEnd(8);
  const user = tokens.user(req, res);

  return `${timestamp}${method}${url}${status}${user}`;
};
const customFormat = ':timestamp :method :url :status';
app.use(morgan(alignedLogger));


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
  origin: 'https://f8b7-203-128-20-34.ngrok-free.app'
}));



// Start Server
app.listen(port,() => {
  // console.log(`Server is running on port ${port}`);
  console.log(`✅ [INFO] Server started and listening on port ${port}............`);
});

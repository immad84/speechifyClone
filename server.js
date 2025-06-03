const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/db");
const setupSwagger = require("./config/swagger");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const imageRoutes = require("./routes/imageRoutes");
const languageRoutes = require("./routes/languageRoutes");
const modelRoutes = require("./routes/modelRoutes");

const port = process.env.PORT;
const app = express();
connectDB();
setupSwagger(app);

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/img", imageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/language", languageRoutes);
app.use("/api/model", modelRoutes);

app.use((err, req, res, next) => {
  console.error(err.message);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.redirect("http://localhost:3000/api-docs/");
});

app.listen(port, () => {
  console.log(
    `✅ [INFO] Server started and listening on port ${port}............`
  );
});

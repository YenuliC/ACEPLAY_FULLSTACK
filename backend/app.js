require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes   = require("./routes/authRoutes");
const casinoRoutes = require("./routes/casinoRoutes");
const logRoutes    = require("./routes/logRoutes");
const publicRoutes = require("./routes/public");
const adminRoutes  = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

app.use("/api/auth",    authRoutes);
app.use("/api/casinos", casinoRoutes);
app.use("/api/logs",    logRoutes);
app.use("/api/public",  publicRoutes);
app.use("/api/admin",   adminRoutes);

app.get("/", (req, res) => res.json({ status: "ACEPlay Backend Running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

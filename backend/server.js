require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const communityRoutes = require("./routes/communityRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // Allow non-browser requests
        const allowedOrigins = process.env.FRONTEND_URL?.split(",").map(url => url.trim());
        if (allowedOrigins && allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads/", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/comments", commentRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

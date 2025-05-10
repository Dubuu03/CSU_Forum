const express = require("express");
const router = express.Router();
const communityController = require("../controllers/communityController");
const multer = require("multer");
const path = require("path");


// Create a new community (Requires approval)
router.post("/", communityController.createCommunity);

// Get all approved communities
router.get("/", communityController.getCommunities);

// Fetch all pending communities
router.get("/pending", communityController.getPendingCommunities);

// Get a specific community by ID
router.get("/:id", communityController.getCommunityById);

// Approve a community (Admin Only)
router.put("/:id/approve", communityController.approveCommunity);

// Delete a community
router.delete("/:id", communityController.deleteCommunity);

// Get all communities a student is a member of
router.get("/user/:studentId", communityController.getUserCommunities);

// Get all approved communities the user has NOT joined
router.get("/unjoined/:studentId", communityController.getUnjoinedCommunities);

// Join a community
router.post("/join", communityController.joinCommunity);

// Leave a community
router.post("/leave", communityController.leaveCommunity);


// Set storage location and filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Upload to /uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });

// Handle image upload
router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    res.status(200).json({ filename: req.file.filename });
});


module.exports = router;

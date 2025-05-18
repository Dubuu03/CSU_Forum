const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");
const discussionController = require('../controllers/discussionController');

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/discussions");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = file.originalname.split(".")[0].replace(/\s/g, "-");
        cb(null, `${name}-${Date.now()}${ext}`);
    },
});

const upload = multer({ storage });

// Create a new discussion with optional image
router.post('/', upload.single("image"), discussionController.createDiscussion);

// Get all discussions
router.get('/', discussionController.getAllDiscussions);

// Get discussions by community
router.get('/community/:communityId', discussionController.getDiscussionsByCommunity);

// Get a specific discussion by ID
router.get('/:discussionId', discussionController.getDiscussionById);

// Update a specific discussion by ID
router.put('/:discussionId', discussionController.updateDiscussion);

// Delete a specific discussion by ID
router.delete('/:discussionId', discussionController.deleteDiscussion);

// Upvote a discussion
router.post('/:discussionId/upvote', discussionController.upvoteDiscussion);

// Downvote a discussion
router.post('/:discussionId/downvote', discussionController.downvoteDiscussion);

// Add a comment to a discussion
router.post('/:discussionId/comment', discussionController.addCommentToDiscussion);

module.exports = router;

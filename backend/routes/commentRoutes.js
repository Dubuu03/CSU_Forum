const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Create a new comment (top-level or reply)
router.post('/', commentController.createComment);

// Get comments for a discussion
router.get('/discussion/:discussionId', commentController.getCommentsByDiscussionId);

// Get a specific comment with its replies
router.get('/:commentId', commentController.getCommentById);

// Update a comment
router.put('/:commentId', commentController.updateComment);

// Delete a comment
router.delete('/:commentId', commentController.deleteComment);

// Upvote a comment
router.post('/:commentId/upvote', commentController.upvoteComment);

// Downvote a comment
router.post('/:commentId/downvote', commentController.downvoteComment);

// Get replies for a comment
router.get('/:commentId/replies', commentController.getCommentReplies);

// Add a reply to a comment
router.post('/:commentId/reply', commentController.addReplyToComment);

module.exports = router;
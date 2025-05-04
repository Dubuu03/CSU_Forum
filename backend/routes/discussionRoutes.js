const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');

// Create a new discussion
router.post('/', discussionController.createDiscussion);

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

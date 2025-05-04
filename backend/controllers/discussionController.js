const Discussion = require('../models/Discussion');
const Comment = require('../models/Comment');

// Create a new discussion
const createDiscussion = async (req, res) => {
    try {
        const { title, content, image, authorId, authorName, community, tags } = req.body;
        const newDiscussion = new Discussion({
            title,
            content,
            image,
            authorId,
            authorName,
            community,
            tags
        });
        await newDiscussion.save();
        res.status(201).json(newDiscussion);
    } catch (err) {
        console.error("Error creating discussion:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all discussions
const getAllDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.find().populate('community').populate('comments');
        res.status(200).json(discussions);
    } catch (err) {
        console.error("Error fetching discussions:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get discussions for a specific community
const getDiscussionsByCommunity = async (req, res) => {
    const { communityId } = req.params;
    try {
        const discussions = await Discussion.find({ community: communityId }).populate('community').populate('comments');
        res.status(200).json(discussions);
    } catch (err) {
        console.error("Error fetching discussions for community:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get a specific discussion by ID
const getDiscussionById = async (req, res) => {
    const { discussionId } = req.params;
    try {
        const discussion = await Discussion.findById(discussionId).populate('community').populate('comments');
        if (!discussion) return res.status(404).json({ error: "Discussion not found" });
        res.status(200).json(discussion);
    } catch (err) {
        console.error("Error fetching discussion:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update a discussion by ID
const updateDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    const { title, content, image, tags } = req.body;
    try {
        const updatedDiscussion = await Discussion.findByIdAndUpdate(
            discussionId,
            { title, content, image, tags },
            { new: true }
        );
        if (!updatedDiscussion) return res.status(404).json({ error: "Discussion not found" });
        res.status(200).json(updatedDiscussion);
    } catch (err) {
        console.error("Error updating discussion:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Delete a discussion by ID
const deleteDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    try {
        const deletedDiscussion = await Discussion.findByIdAndDelete(discussionId);
        if (!deletedDiscussion) return res.status(404).json({ error: "Discussion not found" });
        res.status(200).json({ message: "Discussion deleted successfully" });
    } catch (err) {
        console.error("Error deleting discussion:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Upvote a discussion
const upvoteDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    try {
        const discussion = await Discussion.findById(discussionId);
        if (!discussion) return res.status(404).json({ error: "Discussion not found" });

        discussion.upvotes += 1;
        await discussion.save();
        res.status(200).json(discussion);
    } catch (err) {
        console.error("Error upvoting discussion:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Downvote a discussion
const downvoteDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    try {
        const discussion = await Discussion.findById(discussionId);
        if (!discussion) return res.status(404).json({ error: "Discussion not found" });

        discussion.downvotes += 1;
        await discussion.save();
        res.status(200).json(discussion);
    } catch (err) {
        console.error("Error downvoting discussion:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Add a comment to a discussion
const addCommentToDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    const { content, authorId, authorName } = req.body;
    try {
        const discussion = await Discussion.findById(discussionId);
        if (!discussion) return res.status(404).json({ error: "Discussion not found" });

        const newComment = new Comment({ content, authorId, authorName });
        await newComment.save();

        discussion.comments.push(newComment._id);
        await discussion.save();
        res.status(201).json(newComment);
    } catch (err) {
        console.error("Error adding comment:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    createDiscussion,
    getAllDiscussions,
    getDiscussionsByCommunity,
    getDiscussionById,
    updateDiscussion,
    deleteDiscussion,
    upvoteDiscussion,
    downvoteDiscussion,
    addCommentToDiscussion
};

const Discussion = require('../models/Discussion');
const Comment = require('../models/Comment');

const createDiscussion = async (req, res) => {
    try {
        const {
            title,
            content,
            authorId,
            authorName,
            authorImage,
            community,
            tags
        } = req.body;

        // Fallback: handle missing required fields early
        if (!title || !content || !authorId || !authorName || !community) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let image = null;

        // Handle image from multer (file upload)
        if (req.file) {
            image = req.file.filename;
        }

        // Handle optional base64 or direct URL image
        if (req.body.image && !req.file) {
            image = req.body.image;
        }

        // Normalize tags to array
        const tagArray =
            typeof tags === "string"
                ? tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
                : Array.isArray(tags)
                    ? tags
                    : [];

        const newDiscussion = new Discussion({
            title,
            content,
            image,
            authorId,
            authorName,
            authorImage,
            community,
            tags: tagArray,
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
    const { userId } = req.body; // Get the user ID from the request

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const discussion = await Discussion.findById(discussionId);
        if (!discussion) return res.status(404).json({ error: "Discussion not found" });

        // Check if user already upvoted this discussion
        if (discussion.upvoters.includes(userId)) {
            // User already upvoted, remove the upvote (toggle behavior)
            discussion.upvoters = discussion.upvoters.filter(id => id !== userId);
            discussion.upvotes = Math.max(0, discussion.upvotes - 1);
        } else {
            // User hasn't upvoted, add upvote
            discussion.upvoters.push(userId);
            discussion.upvotes += 1;

            // If user previously downvoted, remove the downvote
            if (discussion.downvoters.includes(userId)) {
                discussion.downvoters = discussion.downvoters.filter(id => id !== userId);
                discussion.downvotes = Math.max(0, discussion.downvotes - 1);
            }
        }

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
    const { userId } = req.body; // Get the user ID from the request

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const discussion = await Discussion.findById(discussionId);
        if (!discussion) return res.status(404).json({ error: "Discussion not found" });

        // Check if user already downvoted this discussion
        if (discussion.downvoters.includes(userId)) {
            // User already downvoted, remove the downvote (toggle behavior)
            discussion.downvoters = discussion.downvoters.filter(id => id !== userId);
            discussion.downvotes = Math.max(0, discussion.downvotes - 1);
        } else {
            // User hasn't downvoted, add downvote
            discussion.downvoters.push(userId);
            discussion.downvotes += 1;

            // If user previously upvoted, remove the upvote
            if (discussion.upvoters.includes(userId)) {
                discussion.upvoters = discussion.upvoters.filter(id => id !== userId);
                discussion.upvotes = Math.max(0, discussion.upvotes - 1);
            }
        }

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

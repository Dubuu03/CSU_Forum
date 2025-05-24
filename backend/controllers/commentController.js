const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Discussion = require('../models/Discussion');

// Create a new comment
exports.createComment = async (req, res) => {
    const { content, authorId, authorName, authorImage, parentId, isReply, replyToCommentId } = req.body;

    // Validate parentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ message: "Invalid parentId (discussion or comment ID)" });
    }
    if (isReply && replyToCommentId && !mongoose.Types.ObjectId.isValid(replyToCommentId)) {
        return res.status(400).json({ message: "Invalid replyToCommentId" });
    }

    try {
        const newComment = new Comment({
            content,
            authorId,
            authorName,
            authorImage, // save image
            parentId, // This is the discussion ID for top-level comments, or the parent comment ID for replies
            isReply: isReply || false
        });

        await newComment.save();

        // Add comment to discussion if it's a top-level comment
        if (!isReply) {
            await Discussion.findByIdAndUpdate(parentId, {
                $push: { comments: newComment._id }
            });
        }
        // Add comment as reply to another comment
        else if (isReply && replyToCommentId) {
            await Comment.findByIdAndUpdate(replyToCommentId, {
                $push: { replies: newComment._id }
            });
        }

        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get comments by discussion ID (only top-level)
exports.getCommentsByDiscussionId = async (req, res) => {
    const { discussionId } = req.params;

    try {
        const comments = await Comment.find({ parentId: discussionId, isReply: { $ne: true } })
            .populate({
                path: 'replies',
                populate: {
                    path: 'replies', // Recursively populate nested replies
                    options: { sort: { createdAt: 1 } }
                },
                options: { sort: { createdAt: 1 } }
            })
            .sort({ createdAt: -1 }) // Sort by newest first
            .exec();

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a specific comment by ID with all nested replies
exports.getCommentById = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId)
            .populate({
                path: 'replies',
                populate: {
                    path: 'replies', // Recursive population of nested replies
                    options: { sort: { createdAt: 1 } }
                },
                options: { sort: { createdAt: 1 } }
            });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json(comment);
    } catch (error) {
        console.error("Error fetching comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update a comment
exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { content, authorId } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Verify the user is the author (assuming authorId matches the user ID)
        if (comment.authorId !== authorId) {
            return res.status(403).json({ message: "You can only edit your own comments" });
        }

        comment.content = content;
        comment.isEdited = true;
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Verify the user is the author or an admin
        if (comment.authorId !== req.body.authorId && req.body.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized to delete this comment" });
        }

        // Handle replies before deleting the comment
        if (comment.replies && comment.replies.length > 0) {
            // Delete all replies (recursive deletion)
            for (const replyId of comment.replies) {
                await Comment.findByIdAndDelete(replyId);
            }
        }

        // Remove this comment from its parent's replies array if it's a reply
        if (comment.isReply) {
            await Comment.findByIdAndUpdate(comment.parentId, {
                $pull: { replies: commentId }
            });
        }
        // If it's a top-level comment, remove from the discussion
        else {
            await Discussion.findByIdAndUpdate(comment.parentId, {
                $pull: { comments: commentId }
            });
        }

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Upvote a comment
exports.upvoteComment = async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Check if user already upvoted
        if (comment.upvoters.includes(userId)) {
            return res.status(400).json({ message: "You've already upvoted this comment" });
        }

        // Remove from downvoters if they previously downvoted
        if (comment.downvoters.includes(userId)) {
            comment.downvoters = comment.downvoters.filter(id => id !== userId);
            if (comment.downvotes > 0) comment.downvotes -= 1;
        }

        // Add upvote
        comment.upvotes += 1;
        comment.upvoters.push(userId);
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        console.error("Error upvoting comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Downvote a comment
exports.downvoteComment = async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Check if user already downvoted
        if (comment.downvoters.includes(userId)) {
            return res.status(400).json({ message: "You've already downvoted this comment" });
        }

        // Remove from upvoters if they previously upvoted
        if (comment.upvoters.includes(userId)) {
            comment.upvoters = comment.upvoters.filter(id => id !== userId);
            if (comment.upvotes > 0) comment.upvotes -= 1;
        }

        // Add downvote
        comment.downvotes += 1;
        comment.downvoters.push(userId);
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        console.error("Error downvoting comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all replies for a comment
exports.getCommentReplies = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId).populate({
            path: 'replies',
            options: { sort: { createdAt: 1 } }
        });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json(comment.replies);
    } catch (error) {
        console.error("Error fetching comment replies:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add a reply to a comment
exports.addReplyToComment = async (req, res) => {
    const { commentId } = req.params;
    const { content, authorId, authorName, authorImage } = req.body;

    try {
        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            return res.status(404).json({ message: "Parent comment not found" });
        }

        // Create the new reply comment
        const replyComment = new Comment({
            content,
            authorId,
            authorName,
            authorImage, // save image
            parentId: commentId, // Set the parent as the comment being replied to
            isReply: true
        });

        await replyComment.save();

        // Add this reply to the parent comment's replies array
        parentComment.replies.push(replyComment._id);
        await parentComment.save();

        res.status(201).json(replyComment);
    } catch (error) {
        console.error("Error adding reply:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
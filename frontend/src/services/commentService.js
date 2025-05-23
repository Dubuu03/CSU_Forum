import axios from 'axios';

const API_URL = '/api/comments';

// Create a new comment (top-level or reply)
const createComment = async (commentData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL, commentData, config);
    return response.data;
};

// Get all comments for a discussion
const getCommentsByDiscussionId = async (discussionId) => {
    const response = await axios.get(`${API_URL}/discussion/${discussionId}`);
    return response.data;
};

// Get a specific comment with all its replies
const getCommentById = async (commentId) => {
    const response = await axios.get(`${API_URL}/${commentId}`);
    return response.data;
};

// Update a comment
const updateComment = async (commentId, content, authorId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(
        `${API_URL}/${commentId}`,
        { content, authorId },
        config
    );
    return response.data;
};

// Delete a comment
const deleteComment = async (commentId, authorId, role, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: { authorId, role } // Pass data in the request body for DELETE
    };

    const response = await axios.delete(`${API_URL}/${commentId}`, config);
    return response.data;
};

// Upvote a comment
const upvoteComment = async (commentId, userId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(
        `${API_URL}/${commentId}/upvote`,
        { userId },
        config
    );
    return response.data;
};

// Downvote a comment
const downvoteComment = async (commentId, userId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(
        `${API_URL}/${commentId}/downvote`,
        { userId },
        config
    );
    return response.data;
};

// Get all replies for a comment
const getCommentReplies = async (commentId) => {
    const response = await axios.get(`${API_URL}/${commentId}/replies`);
    return response.data;
};

// Add a reply to a comment
const addReplyToComment = async (commentId, replyData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(
        `${API_URL}/${commentId}/reply`,
        replyData,
        config
    );
    return response.data;
};

const commentService = {
    createComment,
    getCommentsByDiscussionId,
    getCommentById,
    updateComment,
    deleteComment,
    upvoteComment,
    downvoteComment,
    getCommentReplies,
    addReplyToComment
};

export default commentService;
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBigUp, ArrowBigDown, MessageCircle, ArrowLeft, Send, Reply } from "lucide-react";
import { fetchDiscussionById, upvoteDiscussion, downvoteDiscussion, fetchDiscussionComments } from "../services/discussionService";
import { createComment, addReplyToComment, upvoteComment, downvoteComment } from "../services/commentService";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import Navbar from "../components/NavBar";
import { Snackbar, Alert, Button, TextField, Avatar, IconButton, Divider, CircularProgress } from "@mui/material";
import styles from "../styles/Community/DiscussionDetail.module.css";

const DiscussionDetailPage = () => {
    const { discussionId } = useParams();
    const accessToken = useAuthRedirect();
    const { profile } = useStudentProfile(accessToken);
    const navigate = useNavigate();
    const commentInputRef = useRef(null);

    const [discussion, setDiscussion] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [voteLoading, setVoteLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [commentVoteLoading, setCommentVoteLoading] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info"
    });

    // Format date helper function
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Helper for title case
    const toTitleCase = (str) => {
        if (!str) return '';
        return str.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    };

    useEffect(() => {
        const loadDiscussion = async () => {
            if (!accessToken || !discussionId) return;

            try {
                setLoading(true);
                const [discussionData, commentsData] = await Promise.all([
                    fetchDiscussionById(discussionId, accessToken),
                    fetchDiscussionComments(discussionId, accessToken)
                ]);

                setDiscussion(discussionData);
                setComments(commentsData || []);
            } catch (err) {
                console.error("Error loading discussion:", err);
                setError("Failed to load discussion. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadDiscussion();
    }, [discussionId, accessToken]);

    useEffect(() => {
        // When replyTo changes and is not null, focus on the comment input
        if (replyTo && commentInputRef.current) {
            const inputElement = commentInputRef.current.querySelector('textarea');
            if (inputElement) {
                inputElement.focus();
            }
            // Scroll to comment form
            commentInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [replyTo]);// Calculate vote status inside a useMemo to update when dependencies change
    const voteStatus = React.useMemo(() => {
        return {
            isUpvoted: discussion?.upvoters?.includes(profile?.IDNumber) || false,
            isDownvoted: discussion?.downvoters?.includes(profile?.IDNumber) || false
        };
    }, [discussion, profile?.IDNumber]);

    const { isUpvoted, isDownvoted } = voteStatus; const handleSnackbarClose = (event, reason) => {
        // Skip closing if the user pressed escape key
        if (reason === 'escapeKeyDown') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    }; const handleUpvote = async () => {
        if (voteLoading || !accessToken || !discussionId || !profile?.IDNumber) return;

        try {
            setVoteLoading(true);
            const updatedDiscussion = await upvoteDiscussion(discussionId, profile.IDNumber, accessToken);
            setDiscussion(updatedDiscussion);

            // Show feedback alert based on whether the user is upvoting or removing upvote
            const wasUpvoted = discussion.upvoters?.includes(profile.IDNumber);
            const isNowUpvoted = updatedDiscussion.upvoters?.includes(profile.IDNumber);

            setSnackbar({
                open: true,
                message: isNowUpvoted ? "Discussion upvoted!" : "Upvote removed",
                severity: "success"
            });
        } catch (err) {
            console.error("Error upvoting:", err);
            setSnackbar({
                open: true,
                message: "Failed to upvote. Please try again.",
                severity: "error"
            });
        } finally {
            setVoteLoading(false);
        }
    }; const handleDownvote = async () => {
        if (voteLoading || !accessToken || !discussionId || !profile?.IDNumber) return;

        try {
            setVoteLoading(true);
            const updatedDiscussion = await downvoteDiscussion(discussionId, profile.IDNumber, accessToken);
            setDiscussion(updatedDiscussion);

            // Show feedback alert based on whether the user is downvoting or removing downvote
            const wasDownvoted = discussion.downvoters?.includes(profile.IDNumber);
            const isNowDownvoted = updatedDiscussion.downvoters?.includes(profile.IDNumber);

            setSnackbar({
                open: true,
                message: isNowDownvoted ? "Discussion downvoted" : "Downvote removed",
                severity: "success"
            });
        } catch (err) {
            console.error("Error downvoting:", err);
            setSnackbar({
                open: true,
                message: "Failed to downvote. Please try again.",
                severity: "error"
            });
        } finally {
            setVoteLoading(false);
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    const handleCommentSubmit = async () => {
        if (!commentText.trim() || !profile?.IDNumber || commentLoading) return;

        setCommentLoading(true);

        try {
            const isReply = !!replyTo;
            const commentData = {
                content: commentText.trim(),
                authorId: profile.IDNumber,
                authorName: profile.firstName + " " + profile.lastName,
                parentId: isReply ? replyTo.commentId : discussionId,
                isReply,
                replyToCommentId: isReply ? replyTo.commentId : null
            };

            const newComment = await createComment(commentData, accessToken);

            if (isReply) {
                // Insert reply into the correct comment's replies array
                const insertReply = (commentsList) => commentsList.map(c => {
                    if (c._id === replyTo.commentId) {
                        return { ...c, replies: [...(c.replies || []), newComment] };
                    } else if (c.replies && c.replies.length > 0) {
                        return { ...c, replies: insertReply(c.replies) };
                    }
                    return c;
                });
                setComments(prev => insertReply(prev));
            } else {
                setComments(prev => [newComment, ...prev]);
            }

            // Reset the form
            setCommentText("");
            setReplyTo(null);

            // Show success message
            setSnackbar({
                open: true,
                message: isReply ? "Reply added successfully" : "Comment added successfully",
                severity: "success"
            });

        } catch (err) {
            console.error("Error adding comment:", err);
            setSnackbar({
                open: true,
                message: "Failed to add comment. Please try again.",
                severity: "error"
            });
        } finally {
            setCommentLoading(false);
        }
    };

    const handleReplyClick = (commentId, authorName) => {
        // Set the comment we're replying to
        setReplyTo({
            commentId,
            parentId: commentId, // The parent of the reply is the comment we're replying to
            authorName
        });
    };

    const handleCommentUpvote = async (commentId) => {
        if (commentVoteLoading[commentId] || !accessToken || !profile?.IDNumber) return;

        setCommentVoteLoading(prev => ({ ...prev, [commentId]: true }));

        try {
            const updatedComment = await upvoteComment(commentId, profile.IDNumber, accessToken);

            // Update comment in the state
            const updateComment = (commentsList) => {
                return commentsList.map(comment => {
                    if (comment._id === commentId) {
                        return updatedComment;
                    } else if (comment.replies && comment.replies.length > 0) {
                        return {
                            ...comment,
                            replies: updateComment(comment.replies)
                        };
                    }
                    return comment;
                });
            };

            setComments(updateComment(comments));

            // Show feedback
            const isUpvoted = updatedComment.upvoters?.includes(profile.IDNumber);
            setSnackbar({
                open: true,
                message: isUpvoted ? "Comment upvoted!" : "Comment upvote removed",
                severity: "success"
            });

        } catch (err) {
            console.error("Error upvoting comment:", err);
            setSnackbar({
                open: true,
                message: "Failed to update vote. Please try again.",
                severity: "error"
            });
        } finally {
            setCommentVoteLoading(prev => ({ ...prev, [commentId]: false }));
        }
    };

    const handleCommentDownvote = async (commentId) => {
        if (commentVoteLoading[commentId] || !accessToken || !profile?.IDNumber) return;

        setCommentVoteLoading(prev => ({ ...prev, [commentId]: true }));

        try {
            const updatedComment = await downvoteComment(commentId, profile.IDNumber, accessToken);

            // Update comment in the state
            const updateComment = (commentsList) => {
                return commentsList.map(comment => {
                    if (comment._id === commentId) {
                        return updatedComment;
                    } else if (comment.replies && comment.replies.length > 0) {
                        return {
                            ...comment,
                            replies: updateComment(comment.replies)
                        };
                    }
                    return comment;
                });
            };

            setComments(updateComment(comments));

            // Show feedback
            const isDownvoted = updatedComment.downvoters?.includes(profile.IDNumber);
            setSnackbar({
                open: true,
                message: isDownvoted ? "Comment downvoted!" : "Comment downvote removed",
                severity: "success"
            });

        } catch (err) {
            console.error("Error downvoting comment:", err);
            setSnackbar({
                open: true,
                message: "Failed to update vote. Please try again.",
                severity: "error"
            });
        } finally {
            setCommentVoteLoading(prev => ({ ...prev, [commentId]: false }));
        }
    };

    if (loading) {
        return <div className={styles.loadingContainer}>Loading discussion...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>{error}</div>;
    }

    if (!discussion) {
        return <div className={styles.errorContainer}>Discussion not found.</div>;
    }

    // Process tags into an array
    const tagArray = discussion.tags
        ? Array.isArray(discussion.tags)
            ? discussion.tags.flatMap(tag => tag.split(",").map(t => t.trim())).filter(t => t)
            : typeof discussion.tags === "string"
                ? discussion.tags.split(",").map(t => t.trim()).filter(t => t)
                : [] : []; return (
                    <div className={styles.pageContainer}>
                        <div className={styles.backButton} onClick={goBack}>
                            <ArrowLeft size={20} /> Back
                        </div>

                        <div className={styles.discussionDetail}>
                            <div className={styles.userAvatar}>
                                {discussion.authorImage && (
                                    <img
                                        src={
                                            discussion.authorImage.startsWith("data:image") || discussion.authorImage.startsWith("http")
                                                ? discussion.authorImage
                                                : "/src/assets/default-profile.png"
                                        }
                                        alt="User"
                                        className={styles.avatarImage}
                                    />
                                )}
                            </div>

                            <div className={styles.detailContent}>
                                <div className={styles.userInfo}>
                                    {toTitleCase(discussion.authorName)} • {formatDate(discussion.createdAt)}
                                </div>

                                <h2 className={styles.detailTitle}>{discussion.title}</h2>

                                {tagArray.length > 0 && (
                                    <div className={styles.tags}>
                                        {tagArray.map((tag, index) => (
                                            <span key={index} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>
                                )}

                                <p className={styles.detailContent}>{discussion.content}</p>

                                {discussion.image && (
                                    <div className={styles.detailImage}>
                                        <img
                                            src={
                                                discussion.image.startsWith("http") || discussion.image.startsWith("data:image")
                                                    ? discussion.image
                                                    : `http://localhost:5000/uploads/discussions/${discussion.image}`
                                            }
                                            alt="Discussion"
                                        />
                                    </div>)}                    <div className={styles.interactionButtons}>
                                    <div className={styles.voteButtons}>                                <button
                                        className={`${styles.voteButton} ${voteLoading ? styles.disabled : ''} ${isUpvoted ? styles.active : ''}`}
                                        onClick={handleUpvote}
                                        disabled={voteLoading}
                                    >
                                        <ArrowBigUp size={20} stroke="currentColor" fill={isUpvoted ? "currentColor" : "none"} /> {discussion.upvotes || 0}
                                    </button>
                                        <button
                                            className={`${styles.voteButton} ${voteLoading ? styles.disabled : ''} ${isDownvoted ? styles.active : ''}`}
                                            onClick={handleDownvote}
                                            disabled={voteLoading}
                                        >
                                            <ArrowBigDown size={20} stroke="currentColor" fill={isDownvoted ? "currentColor" : "none"} /> {discussion.downvotes || 0}
                                        </button>
                                    </div>
                                    <div className={styles.commentCount}>
                                        <MessageCircle size={20} /> {comments.length || 0} Comments
                                    </div>
                                </div>
                            </div>
                        </div>                        <div className={styles.commentsSection}>
                            <div className={styles.commentForm} ref={commentInputRef}>
                                <div className={styles.commentInputWrapper}>
                                    <Avatar src={profile?.profilePicture || "/src/assets/default-profile.png"} sx={{ width: 40, height: 40 }} />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder={replyTo ? `Replying to ${replyTo.authorName}` : "Post your comment"}
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleCommentSubmit(); } }}
                                        multiline
                                        minRows={1}
                                        maxRows={4}
                                        sx={{
                                            background: "#f7f9fc",
                                            borderRadius: 24,
                                            '& .MuiOutlinedInput-root': { borderRadius: 24, paddingRight: 6 },
                                            '& fieldset': { border: 'none' },
                                            fontSize: 16
                                        }}
                                        disabled={commentLoading}
                                    />
                                    <IconButton
                                        color="primary"
                                        onClick={handleCommentSubmit}
                                        disabled={!commentText.trim() || commentLoading}
                                        sx={{ ml: 1 }}
                                    >
                                        {commentLoading ? <CircularProgress size={20} /> : <Send />}
                                    </IconButton>
                                </div>
                                {replyTo && (
                                    <div className={styles.replyingTo}>
                                        <span>Replying to <strong>{replyTo.authorName}</strong></span>
                                        <Button size="small" onClick={() => setReplyTo(null)}>Cancel</Button>
                                    </div>
                                )}
                            </div>

                            {comments.length === 0 ? (
                                <div className={styles.noComments}>No comments yet. Be the first to comment!</div>
                            ) : (
                                <div className={styles.commentsList}>
                                    {comments.map((comment) => (
                                        <CommentThread
                                            key={comment._id}
                                            comment={comment}
                                            profile={profile}
                                            formatDate={formatDate}
                                            toTitleCase={toTitleCase}
                                            onReply={handleReplyClick}
                                            onUpvote={handleCommentUpvote}
                                            onDownvote={handleCommentDownvote}
                                            commentVoteLoading={commentVoteLoading}
                                            replyTo={replyTo}
                                        />
                                    ))}
                                </div>
                            )}
                        </div><Snackbar
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            open={snackbar.open}
                            autoHideDuration={3000}
                            onClose={handleSnackbarClose}
                            sx={{ mb: "64px" }} // Add margin bottom to appear above navbar
                        >
                            <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
                                {snackbar.message}
                            </Alert>
                        </Snackbar>

                        <Navbar />
                    </div>
                );
};

export default DiscussionDetailPage;

// Helper component for threaded comments
function CommentThread({ comment, profile, formatDate, toTitleCase, onReply, onUpvote, onDownvote, commentVoteLoading, replyTo, level = 0 }) {
    return (
        <div style={{ marginLeft: level > 0 ? 32 : 0, marginTop: level > 0 ? 8 : 0 }}>
            <div className={styles.comment} style={{ background: level > 0 ? '#f0f2f5' : '#f7f9fc', borderRadius: 16, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar src={"/src/assets/default-profile.png"} sx={{ width: 32, height: 32 }} />
                    <div style={{ fontWeight: 600 }}>{toTitleCase(comment.authorName)}</div>
                    <span style={{ color: '#888', fontSize: 13, marginLeft: 6 }}>{formatDate(comment.createdAt)}</span>
                </div>
                <div style={{ margin: '8px 0 0 40px', fontSize: 15 }}>{comment.content}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 40, marginTop: 4 }}>
                    <IconButton size="small" onClick={() => onUpvote(comment._id)} disabled={commentVoteLoading[comment._id]}>
                        <ArrowBigUp size={18} stroke="currentColor" fill={comment.upvoters?.includes(profile?.IDNumber) ? "currentColor" : "none"} />
                    </IconButton>
                    <span style={{ fontSize: 14 }}>{comment.upvotes || 0}</span>
                    <IconButton size="small" onClick={() => onDownvote(comment._id)} disabled={commentVoteLoading[comment._id]}>
                        <ArrowBigDown size={18} stroke="currentColor" fill={comment.downvoters?.includes(profile?.IDNumber) ? "currentColor" : "none"} />
                    </IconButton>
                    <span style={{ fontSize: 14 }}>{comment.downvotes || 0}</span>
                    <Button size="small" startIcon={<Reply size={16} />} onClick={() => onReply(comment._id, comment.authorName)} style={{ textTransform: 'none', fontWeight: 500, fontSize: 14, color: '#1976d2', marginLeft: 8 }}>
                        Reply
                    </Button>
                </div>
                {/* Show reply input if this is the comment being replied to */}
                {replyTo && replyTo.commentId === comment._id && (
                    <div style={{ marginLeft: 40, marginTop: 8, color: '#1976d2', fontSize: 13 }}>Replying to {comment.authorName}...</div>
                )}
            </div>
            {/* Render replies recursively */}
            {comment.replies && comment.replies.length > 0 && (
                <div className={styles.repliesList}>
                    {comment.replies.map(reply => (
                        <CommentThread
                            key={reply._id}
                            comment={reply}
                            profile={profile}
                            formatDate={formatDate}
                            toTitleCase={toTitleCase}
                            onReply={onReply}
                            onUpvote={onUpvote}
                            onDownvote={onDownvote}
                            commentVoteLoading={commentVoteLoading}
                            replyTo={replyTo}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

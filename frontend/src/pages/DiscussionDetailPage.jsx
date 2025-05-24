import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBigUp, ArrowBigDown, MessageCircle, ArrowLeft, Send, Reply, Heart } from "lucide-react";
import { fetchDiscussionById, upvoteDiscussion, downvoteDiscussion, fetchDiscussionComments } from "../services/discussionService";
import { createComment, addReplyToComment, upvoteComment, downvoteComment } from "../services/commentService";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import useStudentPictures from "../hooks/Profile/useStudentPictures";
import Navbar from "../components/NavBar";
import { Snackbar, Alert, Button, TextField, Avatar, IconButton, Divider, CircularProgress } from "@mui/material";
import styles from "../styles/Community/DiscussionDetail.module.css";

const DiscussionDetailPage = () => {
    const { discussionId } = useParams();
    const accessToken = useAuthRedirect();
    const { profile } = useStudentProfile(accessToken);
    const { pictures: userPictures } = useStudentPictures(accessToken);
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

    // State to show a UI similar to the image for demo purposes
    const [showDemoUI, setShowDemoUI] = useState(true);

    // Format date helper function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
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

                // Disable demo UI if we have real data
                if (discussionData && commentsData && commentsData.length > 0) {
                    setShowDemoUI(false);
                }
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
    }, [replyTo]);

    // Calculate vote status inside a useMemo to update when dependencies change
    const voteStatus = React.useMemo(() => {
        return {
            isUpvoted: discussion?.upvoters?.includes(profile?.IDNumber) || false,
            isDownvoted: discussion?.downvoters?.includes(profile?.IDNumber) || false
        };
    }, [discussion, profile?.IDNumber]);

    const { isUpvoted, isDownvoted } = voteStatus;

    const handleSnackbarClose = (event, reason) => {
        // Skip closing if the user pressed escape key
        if (reason === 'escapeKeyDown') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleUpvote = async () => {
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
    };

    const handleDownvote = async () => {
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

            // Get profile picture URL from the pictures data
            const profilePicUrl = userPictures?.profpic || "";

            if (showDemoUI) {
                setShowDemoUI(false);
            }

            if (isReply) {
                // Create a reply using the helper function that includes authorImage
                const replyData = {
                    content: commentText.trim(),
                    authorId: profile.IDNumber,
                    authorName: profile.firstName + " " + profile.lastName,
                    authorImage: profilePicUrl, // Use the profile picture URL from the hook
                    parentId: replyTo.commentId,
                    isReply: true,
                    replyToCommentId: replyTo.commentId
                };

                // Use the handleAddReply helper function
                await handleAddReply(replyTo.commentId, replyData);
            } else {
                // Regular comment creation (not a reply)
                const commentData = {
                    content: commentText.trim(),
                    authorId: profile.IDNumber,
                    authorName: profile.firstName + " " + profile.lastName,
                    authorImage: profilePicUrl, // Use the profile picture URL from the hook
                    parentId: discussionId,
                    isReply: false
                };

                const newComment = await createComment(commentData, accessToken);
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

    // Add helper function to handle replies with authorImage
    const handleAddReply = async (commentId, replyData) => {
        try {
            // Ensure authorImage is included in the reply
            const replyWithImage = {
                ...replyData,
                authorImage: replyData.authorImage || userPictures?.profpic || "" // Use the provided image or fallback to profile picture
            };

            const newReply = await addReplyToComment(commentId, replyWithImage, accessToken);

            // Update the comments state with the new reply
            const updatedComments = comments.map(comment => {
                if (comment._id === commentId) {
                    return {
                        ...comment,
                        replies: [...(comment.replies || []), newReply]
                    };
                }
                return comment;
            });

            setComments(updatedComments);

            return newReply;
        } catch (error) {
            console.error("Error adding reply:", error);
            throw error;
        }
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
                : [] : [];

    // Helper to get profile image with fallback
    const getProfileImage = (imageUrl) => {
        // Check if the image URL is valid
        if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
            // For base64 encoded images or URLs
            if (imageUrl.startsWith('data:image') || imageUrl.startsWith('http')) {
                return imageUrl;
            }
        }
        return "/src/assets/default-profile.png";
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.backButton} onClick={goBack}>
                <ArrowLeft size={20} /> Back
            </div>

            {showDemoUI ? (
                // Static UI matching the image
                <div className={styles.discussionDetail}>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                            <img
                                src="/src/assets/default-profile.png"
                                alt="Sam Brown"
                                className={styles.avatarImage}
                            />
                        </div>
                        <span className={styles.authorName}>Sam Brown</span>
                        <span>•</span>
                        <span>7 June 2025</span>
                    </div>

                    <h2 className={styles.detailTitle}>Art Club Exhibition</h2>

                    <div className={styles.tags}>
                        <span className={styles.tag}>CLUB</span>
                    </div>

                    <p className={styles.detailContent}>
                        Join us for a showcase of student art they wanted us to grow professionally with a sense of social responsibility...
                    </p>

                    <div className={styles.interactionButtons}>
                        <div className={styles.voteButtons}>
                            <button className={`${styles.voteButton} ${styles.active}`}>
                                <Heart size={20} /> 213
                            </button>
                        </div>
                        <div className={styles.commentCount}>
                            <MessageCircle size={20} /> 213 Comments
                        </div>
                    </div>
                </div>
            ) : (
                // Dynamic UI with real data
                <div className={styles.discussionDetail}>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                            <img
                                src={getProfileImage(discussion.authorImage)}
                                alt={discussion.authorName}
                                className={styles.avatarImage}
                            />
                        </div>
                        <span className={styles.authorName}>{toTitleCase(discussion.authorName)}</span>
                        <span>•</span>
                        <span>{formatDate(discussion.createdAt)}</span>
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
                        </div>
                    )}

                    <div className={styles.interactionButtons}>
                        <div className={styles.voteButtons}>
                            <button
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
            )}

            <div className={styles.commentsSection}>
                <div className={styles.commentForm} ref={commentInputRef}>
                    <div className={styles.commentInputWrapper}>
                        <Avatar
                            src={userPictures?.profpic || "/src/assets/default-profile.png"}
                            sx={{ width: 40, height: 40 }}
                            alt={profile?.firstName || "User"}
                        />
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

                {showDemoUI ? (
                    // Demo UI comments
                    <div className={styles.commentsList}>
                        {[1, 2, 3, 4].map((index) => (
                            <DemoComment key={index} />
                        ))}
                    </div>
                ) : (
                    // Real comments
                    <>
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
                    </>
                )}
            </div>

            <Snackbar
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

// Demo comment component to match the image
const DemoComment = () => {
    return (
        <div style={{
            backgroundColor: '#f8f8f8',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '8px',
            border: '1px solid #eee'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <img
                    src="/src/assets/default-profile.png"
                    alt="Profile"
                    style={{ width: 24, height: 24, borderRadius: '50%' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 500 }}>r/oireali</span>
                <span style={{ fontSize: '12px', color: '#888', marginLeft: '4px' }}>• 7 June 2025</span>
            </div>
            <div style={{ fontSize: '14px', lineHeight: 1.4, marginBottom: '8px', paddingLeft: '8px' }}>
                Galing mo bes! Galing mo bes! Galing mo bes!
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    border: 'none',
                    background: 'transparent',
                    color: '#777'
                }}>
                    <Heart size={12} />
                    <span>213</span>
                </button>
                <button style={{
                    fontSize: '12px',
                    border: 'none',
                    background: 'transparent',
                    color: '#777'
                }}>
                    Reply
                </button>
            </div>
            {Math.random() > 0.5 && (
                <div style={{
                    fontSize: '12px',
                    color: '#888',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <MessageCircle size={12} /> 59 more replies
                </div>
            )}
        </div>
    );
};

// Helper component for threaded comments
function CommentThread({ comment, profile, formatDate, toTitleCase, onReply, onUpvote, onDownvote, commentVoteLoading, replyTo, level = 0 }) {
    // Helper to get profile image with fallback
    const getProfileImage = (imageUrl) => {
        // Check if the image URL is valid
        if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
            // For base64 encoded images or URLs
            if (imageUrl.startsWith('data:image') || imageUrl.startsWith('http')) {
                return imageUrl;
            }
        }
        return "/src/assets/default-profile.png";
    };

    return (
        <div style={{ marginLeft: level > 0 ? 32 : 0, marginTop: level > 0 ? 8 : 0 }}>
            <div style={{
                backgroundColor: level > 0 ? '#f0f2f5' : '#f8f8f8',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '8px',
                border: '1px solid #eee'
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar
                        src={getProfileImage(comment.authorImage)}
                        sx={{ width: 24, height: 24 }}
                        alt={comment.authorName || "User"}
                    />
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{toTitleCase(comment.authorName)}</div>
                    <span style={{ color: '#888', fontSize: 13, marginLeft: 6 }}>{formatDate(comment.createdAt)}</span>
                </div>
                <div style={{ margin: '8px 0 0 32px', fontSize: 14 }}>{comment.content}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 32, marginTop: 4 }}>
                    <IconButton size="small" onClick={() => onUpvote(comment._id)} disabled={commentVoteLoading[comment._id]}>
                        <Heart size={16} stroke="currentColor" fill={comment.upvoters?.includes(profile?.IDNumber) ? "currentColor" : "none"} />
                    </IconButton>
                    <span style={{ fontSize: 13 }}>{comment.upvotes || 0}</span>
                    <Button size="small" onClick={() => onReply(comment._id, comment.authorName)} style={{ textTransform: 'none', fontWeight: 500, fontSize: 13, color: '#777', marginLeft: 8 }}>
                        Reply
                    </Button>
                </div>
                {/* Show reply input if this is the comment being replied to */}
                {replyTo && replyTo.commentId === comment._id && (
                    <div style={{ marginLeft: 32, marginTop: 8, color: '#1976d2', fontSize: 13 }}>Replying to {comment.authorName}...</div>
                )}
            </div>
            {/* Render replies recursively */}
            {comment.replies && comment.replies.length > 0 && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginTop: '4px',
                    marginLeft: '16px',
                    paddingLeft: '16px',
                    borderLeft: '2px solid #e0e0e0'
                }}>
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

export default DiscussionDetailPage;

// src/components/Comments/CommentItem.jsx
import React, { useState } from "react";
import CommentInput from "./CommentInput";
import styles from "../../styles/Discussion/CommentItem.module.css";
import { Dot, ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import useAuthRedirect from "../../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../../hooks/Profile/useStudentProfile";
import { upvoteComment, downvoteComment } from "../../services/commentService";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} variant="filled" ref={ref} {...props} />;
});

const CommentItem = ({ comment, level = 0, onAddReply, userImage, isTopLevel, totalSiblings }) => {
  const accessToken = useAuthRedirect();
  const { profile } = useStudentProfile(accessToken);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  // Each comment manages its own dropdown state for replies
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [likes, setLikes] = useState(comment.likes || comment.upvotes || 0);
  const [upvoters, setUpvoters] = useState(comment.upvoters || []);
  const [downvoters, setDownvoters] = useState(comment.downvoters || []);

  // Sync upvoters/downvoters with comment prop when it changes (for initial render and navigation)
  React.useEffect(() => {
    setLikes(comment.likes || comment.upvotes || 0);
    setUpvoters(comment.upvoters || []);
    setDownvoters(comment.downvoters || []);
  }, [comment.likes, comment.upvotes, comment.upvoters, comment.downvoters]);

  // Use useMemo for vote status, like in DiscussionPost
  const voteStatus = React.useMemo(() => {
    return {
      isUpvoted: upvoters.includes(profile?.IDNumber),
      isDownvoted: downvoters.includes(profile?.IDNumber)
    };
  }, [upvoters, downvoters, profile?.IDNumber]);
  const { isUpvoted, isDownvoted } = voteStatus;

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    event.stopPropagation();
    setSnackbar({ ...snackbar, open: false });
  };

  const handleUpvote = async (e) => {
    e.stopPropagation();
    if (voteLoading || !comment.id || !profile?.IDNumber) return;
    try {
      setVoteLoading(true);
      const updated = await upvoteComment(comment.id, profile.IDNumber, accessToken);
      setLikes(updated.upvotes || 0);
      setUpvoters(updated.upvoters || []);
      setDownvoters(updated.downvoters || []);
      const isNowUpvoted = updated.upvoters?.includes(profile.IDNumber);
      setSnackbar({
        open: true,
        message: isNowUpvoted ? "Comment upvoted!" : "Upvote removed",
        severity: "success"
      });
    } catch (err) {
      setSnackbar({ open: true, message: "Error upvoting. Please try again.", severity: "error" });
    } finally {
      setVoteLoading(false);
    }
  };

  const handleDownvote = async (e) => {
    e.stopPropagation();
    if (voteLoading || !comment.id || !profile?.IDNumber) return;
    try {
      setVoteLoading(true);
      const updated = await downvoteComment(comment.id, profile.IDNumber, accessToken);
      setLikes(updated.upvotes || 0);
      setUpvoters(updated.upvoters || []);
      setDownvoters(updated.downvoters || []);
      const isNowDownvoted = updated.downvoters?.includes(profile.IDNumber);
      setSnackbar({
        open: true,
        message: isNowDownvoted ? "Comment downvoted!" : "Downvote removed",
        severity: "success"
      });
    } catch (err) {
      setSnackbar({ open: true, message: "Error downvoting. Please try again.", severity: "error" });
    } finally {
      setVoteLoading(false);
    }
  };

  React.useEffect(() => {
    setReplies(comment.replies || []);
  }, [comment.replies]);

  // Handle adding a reply (calls parent handler to persist)
  const handleAddReply = async (replyContent) => {
    if (onAddReply) {
      await onAddReply(replyContent, comment.id);
      setShowReplyInput(false);
      setShowAllReplies(true); // Automatically show replies after adding
    }
  };

  // Only show first 3 top-level comments unless expanded
  const [showAllTopLevel, setShowAllTopLevel] = useState(false);
  // Only show first 3 replies unless expanded, per comment instance
  const visibleReplies = showAllReplies ? replies : replies.slice(0, 3);
  const hasMoreReplies = replies.length > 3;

  // For top-level comments, only show first 3 unless expanded
  if (isTopLevel && !showAllTopLevel && totalSiblings > 3 && comment.index >= 3) {
    return null;
  }

  return (
    <div className={styles.commentItem}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <div className={styles.comment}>
        <div className={styles.avatar}>
          {comment.profile && (
            <img src={comment.profile} alt="User" className={styles.avatarImage} />
          )}
        </div>
        <div className={styles.commentContent} >
          <div className={styles.infos}>
            <div className={styles.commentMeta}>
              <span>{comment.author}</span>
              <Dot size={20}></Dot>
              {comment.date}
            </div>
            <div className={styles.commentText}>{comment.text}</div>
          </div>
          <div className={styles.interactionButtons}>
            <div className={styles.voteButtons}>
              <button
                className={`${styles.voteButton} ${voteLoading ? styles.disabled : ""} ${isUpvoted ? styles.active : ""}`}
                onClick={handleUpvote}
                disabled={voteLoading}
              >
                <ArrowBigUp size={20} stroke="currentColor" fill={isUpvoted ? "currentColor" : "none"} /> {likes}
              </button>
              <button
                className={`${styles.voteButton} ${voteLoading ? styles.disabled : ""} ${isDownvoted ? styles.active : ""}`}
                onClick={handleDownvote}
                disabled={voteLoading}
              >
                <ArrowBigDown size={20} stroke="currentColor" fill={isDownvoted ? "currentColor" : "none"} />
              </button>
            </div>
            <button
              className={styles.commentButton}
              onClick={() => setShowReplyInput(!showReplyInput)}
              disabled={level >= 2}
            >
              <MessageCircle size={20} />
              Reply
            </button>
          </div>
        </div>
      </div>
      {showReplyInput && (
        <CommentInput onAddComment={handleAddReply} parentId={comment.id} userImage={userImage} />
      )}
      {replies.length > 0 && (
        <div className={styles.replies}>
          {showAllReplies && replies.map((reply, idx) => (
            <CommentItem key={reply.id} comment={reply} level={level + 1} onAddReply={onAddReply} userImage={userImage} />
          ))}
          {level !== 2 && (
  showAllReplies
    ? (
      // Only show "Hide replies" if level is NOT 1
      level !== 1 && replies.length > 0 ? (
        <button
          className={styles.viewMoreRepliesBtn}
          onClick={() => setShowAllReplies(false)}
        >
          Hide replies
        </button>
      ) : null
    )
    : (
      <button
        className={styles.viewMoreRepliesBtn}
        onClick={() => setShowAllReplies(true)}
      >
        {`View ${replies.length} repl${replies.length === 1 ? "y" : "ies"}`}
      </button>
    )
)}

        </div>
      )}
      {isTopLevel && totalSiblings > 3 && comment.index === 2 && !showAllTopLevel && (
        <button
          className={styles.viewMoreRepliesBtn}
          onClick={() => setShowAllTopLevel(true)}
        >
          {`View more comments (${totalSiblings - 3})`}
        </button>
      )}
      {isTopLevel && totalSiblings > 3 && showAllTopLevel && comment.index === totalSiblings - 1 && (
        <button
          className={styles.viewMoreRepliesBtn}
          onClick={() => setShowAllTopLevel(false)}
        >
          Hide comments
        </button>
      )}
    </div>
  );
};

export default CommentItem;

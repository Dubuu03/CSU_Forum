// src/components/Comments/CommentSection.jsx
import React from "react";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import styles from "../../styles/Discussion/CommentSection.module.css";

const CommentSection = ({ comments, userImage, onAddComment, onAddReply, commentLoading }) => {
  // Map backend comments to frontend shape
  const mapComment = (c) => ({
    id: c._id || c.id,
    author: c.authorName || c.author,
    profile: c.authorImage || c.profile,
    date: c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : c.date,
    text: c.content || c.text,
    likes: c.upvotes || c.likes || 0,
    replies: Array.isArray(c.replies) ? c.replies.map(mapComment) : [],
  });
  const mappedComments = Array.isArray(comments) ? comments.map(mapComment) : [];

  return (
    <div className={styles.commentSection}>
      <CommentInput onAddComment={onAddComment} userImage={userImage} loading={commentLoading} />
      <CommentList comments={mappedComments} onAddReply={onAddReply} userImage={userImage} />
    </div>
  );
};

export default CommentSection;

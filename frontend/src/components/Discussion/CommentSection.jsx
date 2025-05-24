// src/components/Comments/CommentSection.jsx
import React, { useState } from "react";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import styles from "../../styles/Discussion/CommentSection.module.css";

const CommentSection = ({ comments, userImage }) => {
  const [commentList, setCommentList] = useState(comments);

  const handleAddComment = (newComment) => {
    setCommentList([...commentList, newComment]);
  };

  return (
    <div className={styles.commentSection}>
      <CommentInput onAddComment={handleAddComment} userImage={userImage} />
      <CommentList comments={commentList} />
    </div>
  );
};

export default CommentSection;

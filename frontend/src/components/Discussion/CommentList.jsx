// src/components/Comments/CommentList.jsx
import React from "react";
import CommentItem from "./CommentItem";
import styles from "../../styles/Discussion/CommentList.module.css";

const CommentList = ({ comments }) => {
  return (
    <div className={styles.commentList}>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;

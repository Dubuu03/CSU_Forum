// src/components/Comments/CommentList.jsx
import React from "react";
import CommentItem from "./CommentItem";
import styles from "../../styles/Discussion/CommentList.module.css";

const CommentList = ({ comments, onAddReply, userImage }) => {
  return (
    <div className={styles.commentList}>
      {comments.map((comment, idx) => (
        <CommentItem
          key={comment.id}
          comment={{ ...comment, index: idx }}
          onAddReply={onAddReply}
          userImage={userImage}
          isTopLevel={true}
          totalSiblings={comments.length}
        />
      ))}
    </div>
  );
};

export default CommentList;

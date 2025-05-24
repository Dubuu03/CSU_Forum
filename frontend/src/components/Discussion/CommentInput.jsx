// src/components/Comments/CommentInput.jsx
import React, { useState } from "react";
import styles from "../../styles/Discussion/CommentInput.module.css";
import { SendHorizontal } from "lucide-react";

const CommentInput = ({ onAddComment, parentId = null, userImage }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() === "") return;
    onAddComment(comment); // Only send the comment text
    setComment("");
  };

  return (
    <form className={styles.commentForm} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <div className={styles.imageContainer}>
                  {userImage && (
          <img src={userImage} alt="User" className={styles.userAvatar} />
        )}
        </div>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Post your comment"
          className={styles.commentInput}
        />
      </div>
      <button type="submit" className={styles.submitBtn}>
        <SendHorizontal size={24} />
      </button>
    </form>
  );
};

export default CommentInput;

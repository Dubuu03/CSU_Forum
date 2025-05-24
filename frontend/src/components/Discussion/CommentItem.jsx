// src/components/Comments/CommentItem.jsx
import React, { useState } from "react";
import CommentInput from "./CommentInput";
import styles from "../../styles/Discussion/CommentItem.module.css";
import { Dot, ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";
const CommentItem = ({ comment, level = 0 }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);

  const handleAddReply = (reply) => {
    setReplies([...replies, reply]);
    setShowReplyInput(false);
  };

  return (
    <div className={styles.commentItem}>
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
              <button className={styles.voteButton}>
                <ArrowBigUp size={20} stroke="currentColor" /> {comment.likes}
              </button>
              <button className={styles.voteButton}>
                <ArrowBigDown size={20} stroke="currentColor" />
              </button>
            </div>
            <button
              className={styles.commentButton}
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              <MessageCircle size={20} />
              Reply
            </button>
          </div>

        </div>

      </div>
      {showReplyInput && (
        <CommentInput onAddComment={handleAddReply} parentId={comment.id} />
      )}

      {replies.length > 0 && (
        <div className={styles.replies}>
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;

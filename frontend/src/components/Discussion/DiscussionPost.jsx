import React from "react";
import styles from "../../styles/Community/Discussion.module.css";
import { Dot, ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";

const DiscussionPost = ({ post, noBorder }) => {
  // Extract tags safely
  const tagArray = Array.isArray(post.tags)
    ? post.tags.flatMap(tag => tag.split(",").map(t => t.trim())).filter(t => t)
    : typeof post.tags === "string"
      ? post.tags.split(",").map(t => t.trim()).filter(t => t)
      : [];

  return (
    <div className={noBorder ? `${styles.post} ${styles.noBorder}` : styles.post}>
      <div className={styles.userAvatar}>
        {post.imageSrc && (
          <img src={post.imageSrc} alt="User" className={styles.avatarImage} />
        )}
      </div>

      <div className={styles.postInfo}>
        <div className={styles.userInfo}>
          {post.author} <Dot size={26} /> {post.date}
        </div>

        <span className={styles.postTitle}>{post.title}</span>

        {tagArray.length > 0 && (
          <div className={styles.tags}>
            {tagArray.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className={styles.content}>{post.content}</p>

        {post.postSrc && post.postSrc.trim() !== "" && (
          <div className={styles.postImage}>
            <img src={post.postSrc} alt="Post image" />
          </div>
        )}

        <div className={styles.interactionButtons}>
          <div className={styles.voteButtons}>
            <button className={styles.voteButton}>
              <ArrowBigUp size={20} stroke="currentColor" /> {post.likes}
            </button>
            <button className={styles.voteButton}>
              <ArrowBigDown size={20} stroke="currentColor" />
            </button>
          </div>
          <button className={styles.commentButton}>
            <MessageCircle size={20} /> {post.comments}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionPost;

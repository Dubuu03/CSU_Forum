import React from "react";
import styles from "../../styles/Community/Discussion.module.css";
import { Dot, ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";

const DiscussionPost = ({ post }) => {
  const tagArray =
    typeof post.tags === "string"
      ? post.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
      : Array.isArray(post.tags)
        ? post.tags.filter(tag => tag.trim() !== "")
        : [];

  return (
    <div className={styles.post}>
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
              <span key={index} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        <p className={styles.content}>{post.content}</p>

        {}
        {post.postSrc && post.postSrc.trim() !== "" && (
          <div className={styles.postImage}>
            <img src={post.postSrc} alt="Post image" />
          </div>
        )}

        <div className={styles.interactionButtons}>
          <div className={styles.voteButtons}>
            <button className={styles.voteButton}>
              <ArrowBigUp size={20} /> {post.likes}
            </button>
            <button className={styles.voteButton}>
              <ArrowBigDown size={20} />
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

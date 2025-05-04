import React from "react";
import styles from "../../styles/Community/Discussion.module.css";
import { Dot, ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";

const DiscussionPost = ({ post }) => {
  return (
    <div className={styles.post}>
      <div className={styles.userAvatar}>
        {post.imageSrc && <img src={post.imageSrc} alt="Post" className={styles.user} />}
      </div>
      <div className={styles.postInfo}>
        <div className={styles.userInfo}>{post.author} <Dot size={26} /> {post.date}</div>
        <span className={styles.postTitle}>{post.title}</span>
        <div className={styles.tags}>
          {post.tags.map((tag, index) => <span key={index} className={styles.tag}>{tag}</span>)}
        </div>
        <p className={styles.content}>{post.content}</p>
        <div className={styles.postImage}>
          {post.postSrc && <img src={post.postSrc} alt="Post" />}
        </div>
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

import React from "react";
import DiscussionPageHeader from "../components/Discussion/DiscussionPageHeader";
import DiscussionPost from "../components/Discussion/DiscussionPost";
import CommentSection from "../components/Discussion/CommentSection";
import styles from "../styles/Discussion/DiscussionPage.module.css";
import profilePic from "../assets/default-profile.png"; // Sample profile picture

const DiscussionPage = () => {
  // Sample discussion post data
  const postData = {
    title: "Best Painting Techniques",
    author: "Sophia Lee",
    date: "12 April 2025",
    content:
      "What are some of the best techniques you use for acrylic painting?",
    tags: ["Acrylic", "Painting"],
    imageSrc: profilePic,
    likes: 120,
    comments: 15,
  };

  // Sample initial comments data (each comment can have nested replies)
  const initialComments = [
    {
      id: 1,
      author: "Carl Angelo",
      profile: profilePic,
      date: "24 May 2025",
      text: "I love the way this discussion is shaping up!",
      likes: 10,
      replies: [
        {
          id: 11,
          author: "Emma",
          profile: profilePic,
          date: "25 May 2025",
          text: "I agree with Carl!",
          likes: 10,
          replies: []
        }
      ],
    },
    {
      id: 2,
      author: "Victoria",
      profile: profilePic,
      date: "24 May 2025",
      text: "Great insights, thanks for sharing.",
      likes: 10,
      replies: [],
    },
  ];

  return (
    <div className={styles.mainContainer}>

      <DiscussionPageHeader
        communityName="Art Club Exhibition"
        onBack={() => window.history.back()}
        onSearch={() => console.log("Search clicked")}
      />
      <div className={styles.discussionSection}>
        <DiscussionPost post={postData} noBorder />
      </div>
      <div className={styles.commentSection}>
        <CommentSection comments={initialComments} userImage={profilePic} />
      </div>
    </div>
  );
};

export default DiscussionPage;

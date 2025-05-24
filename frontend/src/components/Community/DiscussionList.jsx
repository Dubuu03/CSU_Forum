import React, { useState } from "react";
import styles from "../../styles/Community/Discussion.module.css";
import DiscussionPost from "./DiscussionPost";

const DiscussionList = ({ discussions: initialDiscussions }) => {
  const [discussions, setDiscussions] = useState(initialDiscussions);
  // This function updates a single discussion in the list after a vote
  const handleVoteUpdate = (discussionId, updatedDiscussion) => {
    setDiscussions(prevDiscussions =>
      prevDiscussions.map(post => {
        if (post._id === discussionId) {
          // Update likes count, upvoters and downvoters arrays from the server response
          return {
            ...post,
            likes: updatedDiscussion.upvotes || 0,
            upvoters: updatedDiscussion.upvoters || [],
            downvoters: updatedDiscussion.downvoters || []
          };
        }
        return post;
      })
    );
  };

  if (!discussions || discussions.length === 0) {
    return (
      <div className={styles.noDiscussions}>
        No discussions yet.
      </div>
    );
  }

  return (
    <div className={styles.discussionContainer}>
      {discussions.map((post, index) => (
        <DiscussionPost
          key={post._id || index}
          post={post}
          onVoteUpdate={handleVoteUpdate}
        />
      ))}
    </div>
  );
};

export default DiscussionList;

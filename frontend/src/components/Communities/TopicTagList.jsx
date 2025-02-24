import React from "react";
import TopicTag from "./TopicTag"; // Import the TopicTag component
import styles from "../../styles/TopicTag.module.css"; // Import styles

const TopicTagList = ({ topics }) => {
    return (
        <div className={styles.container}>
            <span>
                Explore communities by topic
            </span> 
            <div className={styles.topicList}>
            {topics.map((topic, index) => (
                <TopicTag key={index} topic={topic} />
            ))}
            </div>
        </div>
    );
};

export default TopicTagList;

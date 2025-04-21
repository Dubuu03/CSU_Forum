import React from "react";
import TopicTag from "./TopicTag"; // Import the TopicTag component
import styles from "../../styles/TopicTag.module.css"; // Import styles
import { motion } from "framer-motion";

const TopicTagList = ({ topics }) => {
    return (
        <div className={styles.container}>
            <span>
                Explore communities by topic
            </span> 
            <motion.div 
                className={styles.topicList}
                drag="x"
                dragConstraints={{ left: -120, right: 0 }} // Adjust constraints
            >
                {topics.map((topic, index) => (
                    <TopicTag key={index} topic={topic} />
                ))}
            </motion.div>
        </div>
    );
};

export default TopicTagList;

import React from "react";
import TopicTag from "./TopicTag";
import styles from "../../styles/Communities/TopicTag.module.css";
import { motion } from "framer-motion";

const TopicTagList = ({ topics, onSelectTag, selectedTag }) => {
    return (
        <div className={styles.container}>
            <span>Explore communities by topic</span>
            <motion.div
                className={styles.topicList}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                drag="x"
                dragConstraints={{ left: -120, right: 0 }}
            >
                {topics.map((topic, index) => (
                    <button
                        key={index}
                        className={
                            `${styles.topicButton} ${selectedTag === topic ? styles.selected : ""}`
                        }
                        onClick={() => onSelectTag(selectedTag === topic ? null : topic)}
                    >
                        <div className={`${styles.topicTag} ${selectedTag === topic ? styles.selected : ""}`}>
                            {topic}
                        </div>
                    </button>
                ))}
            </motion.div>
        </div>
    );
};

export default TopicTagList;

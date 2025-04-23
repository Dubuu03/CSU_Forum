import React from "react";
import styles from "../../styles/Communities/TopicTag.module.css";

const TopicTag = ({ topic }) => {
  return <div className={styles.topicTag}>{topic}</div>;
};

export default TopicTag;

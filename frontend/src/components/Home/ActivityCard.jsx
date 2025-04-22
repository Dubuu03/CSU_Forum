import React from "react";
import styles from "../../styles/Home/ClubActivities.module.css";
import { Dot } from "lucide-react";

const ActivityCard = ({ title, imageSrc, author, date, description, tag, profileSrc }) => {
    return (
        <div className={styles.activityCard}>
            <div className={styles.activityContent}>
                <div className={styles.profile}>
                    <div className={styles.profileContainer}>
                        <img src={profileSrc} alt="Profile" className={styles.profileImage} />
                    </div>
                    <div className={styles.profileInfo}>
                        <p className={styles.author}>{author}</p>
                        <Dot size={24} color="#000"  />
                        <p className={styles.date}>{date}</p>
                    </div>
                </div>
                <p className={styles.title}>{title}</p>
                <p className={styles.description}>{description}</p>
                <div className={styles.tag}>{tag}</div>
            </div>
            <div className={styles.imageContainer}>
                <img src={imageSrc} alt={title} className={styles.activityImage} />
            </div>
        </div>
    );
};

export default ActivityCard;

import React from "react";
import styles from "../../styles/CommunityCard.module.css";

const CommunityCard = ({ image, name, members, description, isTopList }) => {
    return (
        <div className={`${styles.communityCard} ${isTopList ? styles.topList : ""}`}>
            <div className={styles.communityInfo}>
                <img src={image} alt={name} className={styles.avatar} />
                <div className={styles.communityDetails}>
                    <span>{name}</span>
                    <p className={styles.members}>{members} members</p>
                </div>
                <button className={styles.joinBtn}>Join</button>
            </div>
            {description && <p className={styles.desc}>{description}</p>}
        </div>
    );
};

export default CommunityCard;

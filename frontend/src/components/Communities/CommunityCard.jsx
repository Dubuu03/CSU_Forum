import React from "react";
import styles from "../../styles/Communities/CommunityCard.module.css";

const CommunityCard = ({
    image,
    name,
    members,
    description,
    isTopList,
    communityId,
    onJoin,
    joined,
}) => {
    const handleJoinClick = () => {
        if (communityId) {
            onJoin(communityId);
        } else {
            console.warn("Missing communityId");
        }
    };

    return (
        <div className={`${styles.communityCard} ${isTopList ? styles.topList : ""}`}>
            <div className={styles.communityInfo}>
                <img
                    src={image || "/src/assets/default-profile.png"}
                    alt={name}
                    className={styles.avatar}
                />
                <div className={styles.communityDetails}>
                    <span>{name}</span>
                    <p className={styles.members}>{members} members</p>
                </div>
                <button
                    className={`${styles.joinBtn} ${joined ? styles.joinedBtn : ""}`}
                    onClick={handleJoinClick}
                    disabled={joined}
                >
                    {joined ? "Joined" : "Join"}
                </button>


            </div>
            {description && <p className={styles.desc}>{description}</p>}
        </div>
    );
};

export default CommunityCard;

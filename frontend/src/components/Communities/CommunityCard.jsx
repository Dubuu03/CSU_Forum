import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import styles from "../../styles/Communities/CommunityCard.module.css";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

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
    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

    const showAlert = (message, severity = "info") => {
        setAlert({ open: true, message, severity });
    };

    const handleAlertClose = () => {
        setAlert({ ...alert, open: false });
    };

    const handleJoinClick = () => {
        if (communityId) {
            onJoin(communityId);
        } else {
            console.warn("Missing communityId");
            showAlert("Community ID is missing. Please try again later.", "warning");
        }
    };

    return (
        <div className={`${styles.communityCard} ${isTopList ? styles.topList : ""}`}>
            <div className={styles.communityInfo}>
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className={styles.avatar}
                    />
                ) : (
                    <div className={`${styles.avatar} ${styles.fallbackAvatar}`}>
                        {name?.charAt(0).toUpperCase()}
                    </div>
                )}
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

            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={alert.open}
                autoHideDuration={3000}
                onClose={handleAlertClose}
            >
                <Alert onClose={handleAlertClose} severity={alert.severity} sx={{ width: "100%" }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CommunityCard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import styles from "../../styles/Communities/CommunityCard.module.css";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

    const showAlert = (message, severity = "info") => {
        setAlert({ open: true, message, severity });
    };

    const handleAlertClose = (_, reason) => {
        if (reason === "clickaway") return;
        setAlert({ ...alert, open: false });
    };

    const handleJoinClick = async (e) => {
        e.stopPropagation();
        if (!communityId) {
            showAlert("Community ID is missing. Please try again later.", "error");
            return;
        }

        try {
            await onJoin(communityId);
        } catch (error) {
            showAlert("Failed to join community. Please try again.", "error");
        }
    };

    const handleCardClick = () => {
        if (communityId) {
            navigate(`/communities/${communityId}`);
        }
    };

    return (
        <div
            className={`${styles.communityCard} ${isTopList ? styles.topList : ""}`}
            onClick={handleCardClick}
            style={{ cursor: "pointer", opacity: 1 }}
        >
            <div className={styles.communityInfo}>
                {image ? (
                    <div className={styles.imageContainer}>
                        <img src={image} alt={name} className={styles.avatar} />
                    </div>
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

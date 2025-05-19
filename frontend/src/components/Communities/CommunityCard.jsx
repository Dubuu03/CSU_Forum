import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Spinner from "../Spinner"; // Make sure this renders full-screen properly
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
    const [loading, setLoading] = useState(false);

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
            setLoading(true);
            await onJoin(communityId);
        } catch (error) {
            showAlert("Failed to join community. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = () => {
        if (communityId) {
            setLoading(true);
            setTimeout(() => navigate(`/communities/${communityId}`), 300);
        }
    };

    return (
        <>
            {loading && (
                <div className={styles.spinnerOverlay}>
                    <Spinner size={40} />
                </div>
            )}

            <div
                className={`${styles.communityCard} ${isTopList ? styles.topList : ""}`}
                onClick={!loading ? handleCardClick : undefined}
                style={{ cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}
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
                        disabled={joined || loading}
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
                    <Alert
                        onClose={handleAlertClose}
                        severity={alert.severity}
                        sx={{ width: "100%" }}
                    >
                        {alert.message}
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
};

export default CommunityCard;

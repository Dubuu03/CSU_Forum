import React, { useEffect, useState } from "react";
import styles from "../../styles/Community/CommunityPage.module.css";
import Header from "./Header";
import { Dot } from "lucide-react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import useStudentProfile from "../../hooks/Profile/useStudentProfile";
import useAuthRedirect from "../../hooks/Auth/useAuthRedirect";
import { joinCommunity, leaveCommunity, fetchUserCommunities } from "../../services/communityService";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const CommunityHeader = ({ name, organizer, date, members, posts, tags, onOpenProfileSidebar, communityId }) => {
  const accessToken = useAuthRedirect();
  const { profile } = useStudentProfile(accessToken);
  const navigate = useNavigate();

  const [isMember, setIsMember] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  useEffect(() => {
    const checkMembership = async () => {
      if (!profile?.IDNumber || !communityId) return;

      try {
        const communities = await fetchUserCommunities(profile.IDNumber);
        const isJoined = communities.some((c) => c._id === communityId);
        setIsMember(isJoined);
        setIsCreator(communities.find(c => c._id === communityId)?.creatorId === profile.IDNumber);
      } catch (error) {
        console.error("Error checking membership:", error);
      }
    };

    checkMembership();
  }, [profile, communityId]);

  const handleJoin = async () => {
    try {
      await joinCommunity(accessToken, profile.IDNumber, communityId);
      setIsMember(true);
      showAlert("Successfully joined the community!", "success");
    } catch (err) {
      console.error("Join failed", err);
      showAlert("Failed to join the community.", "error");
    }
  };

  const handleLeave = () => {
    setConfirmOpen(true);
  };

  const confirmLeave = async () => {
    try {
      await leaveCommunity(accessToken, profile.IDNumber, communityId);
      showAlert("Successfully left the community.", "success");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      console.error("Leave failed", err);
      const message = err.message || "Failed to leave the community.";
      showAlert(message, "error");
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <div className={styles.header}>
      <Header onOpenProfileSidebar={onOpenProfileSidebar} />
      <div className={styles.communityInfo}>
        {isCreator ? (
          <button className={styles.joinBtn} disabled>Creator</button>
        ) : isMember ? (
          <button className={styles.joinBtn} onClick={handleLeave}>Leave</button>
        ) : (
          <button className={styles.joinBtn} onClick={handleJoin}>Join</button>
        )}

        <span className={styles.communityName}>{name}</span>
        <div className={styles.organizers}>{organizer} <Dot size={26} /> {date}</div>
        {Array.isArray(tags) && tags.filter(tag => tag.trim() !== "").length > 0 && (
          <div className={styles.tags}>
            {tags.filter(tag => tag.trim() !== "").map((tag, index) => (
              <span key={index} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
        <div className={styles.stats}>
          <div className={styles.info}><span>{members}</span> Members</div>
          <div className={styles.info}><span>{posts}</span> Posts</div>
        </div>
      </div>

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

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}>Confirm Leave</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "0.95rem", textAlign: "center" }}>
            Are you sure you want to leave this community? You will be redirected to the home page after leaving.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: "1rem" }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={confirmLeave} variant="contained" color="error">
            Leave Community
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CommunityHeader;

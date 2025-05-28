import React, { useState, useEffect } from "react";
import CommunityCard from "./CommunityCard";
import { motion } from "framer-motion";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import styles from "../../styles/Communities/TopCommunities.module.css";
import { joinCommunity, fetchUnjoinedCommunities } from "../../services/communityService";
import useStudentProfile from "../../hooks/Profile/useStudentProfile";
import useAuthRedirect from "../../hooks/Auth/useAuthRedirect";
import avatar from "../../assets/default-profile.png";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const TopCommunities = ({ setTopCommunityIds }) => {
  const accessToken = useAuthRedirect();
  const { profile } = useStudentProfile(accessToken);
  const [topCommunities, setTopCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

  const IMAGE_BASE_URL = "/community/";

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  useEffect(() => {
    const loadTopCommunities = async () => {
      if (!profile?.IDNumber) return;

      try {
        const studentId = profile.IDNumber;
        const data = await fetchUnjoinedCommunities(studentId);

        const formatted = data.map((community) => {
          const validMembers = (community.memberIds || []).filter(
            (id) => typeof id === "string" && !id.includes(".") && id.length < 30
          );

          return {
            communityId: community._id,
            name: community.name,
            description: community.description,
            members: validMembers.length,
            membersID: validMembers,
            image: community.image
              ? `${IMAGE_BASE_URL}${community.image}`
              : avatar,
          };
        });

        const sorted = [...formatted].sort(
          (a, b) => b.membersID.length - a.membersID.length
        );

        const topIds = sorted.slice(0, 4).map(c => c.communityId);
        setTopCommunityIds(topIds);
        setTopCommunities(sorted.slice(0, 4));
      } catch (err) {
        console.error("Failed to load top communities:", err);
        showAlert("Failed to load top communities.", "error");
      }
    };

    loadTopCommunities();
  }, [profile, setTopCommunityIds]);

  const handleJoin = async (communityId) => {
    if (!profile) {
      showAlert("You must be logged in to join a community.", "warning");
      return;
    }

    try {
      await joinCommunity(accessToken, profile.IDNumber, communityId);
      setJoinedCommunities((prev) => [...prev, communityId]);
      showAlert("Successfully joined the community!", "success");
    } catch (err) {
      showAlert("Failed to join the community.", "error");
    }
  };

  return (
    <div className={styles.topCommunitiesSection}>
      <span>Top Communities</span>
      {topCommunities.length === 0 ? (
        <p className={styles.noCommunitiesText}>No communities found</p>
      ) : (
        <motion.div
          className={styles.communityList}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          drag="x"
          dragConstraints={{ left: -250, right: 0 }}
        >
          {topCommunities.map((community) => (
            <CommunityCard
              key={community.communityId}
              communityId={community.communityId}
              name={community.name}
              image={community.image}
              members={community.members}
              description={community.description}
              isTopList={true}
              joined={joinedCommunities.includes(community.communityId)}
              onJoin={handleJoin}
            />
          ))}
        </motion.div>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        sx={{ mb: "64px" }}
      >
        <Alert onClose={handleAlertClose} severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default TopCommunities;

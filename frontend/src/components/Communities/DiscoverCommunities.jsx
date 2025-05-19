import React, { useState, useEffect, useMemo } from "react";
import CommunityCard from "./CommunityCard";
import { motion } from "framer-motion";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import styles from "../../styles/Communities/CommunityCard.module.css";
import { joinCommunity, fetchUnjoinedCommunities } from "../../services/communityService";
import useStudentProfile from "../../hooks/Profile/useStudentProfile";
import useAuthRedirect from "../../hooks/Auth/useAuthRedirect";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

// Fisher-Yates shuffle helper
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const DiscoverCommunities = ({ selectedTag, topCommunityIds = [] }) => {
  const accessToken = useAuthRedirect();
  const { profile } = useStudentProfile(accessToken);
  const [communities, setCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

  const IMAGE_BASE_URL = "http://localhost:5000/uploads/community/";

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  useEffect(() => {
    const loadCommunities = async () => {
      if (!profile?.IDNumber) return;
      try {
        const unjoined = await fetchUnjoinedCommunities(profile.IDNumber);
        setCommunities(unjoined);
      } catch (err) {
        console.error("Failed to fetch unjoined communities", err);
        showAlert("Failed to load communities.", "error");
      }
    };

    loadCommunities();
  }, [profile]);

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

  // Filter communities by selected tag
  const filteredByTag = selectedTag
    ? communities.filter(
      (c) =>
        Array.isArray(c.tags) &&
        c.tags.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase())
    )
    : communities;

  // Sort by member count descending
  const sortedByMembers = [...filteredByTag].sort(
    (a, b) => (b.memberIds?.length || 0) - (a.memberIds?.length || 0)
  );

  // Filter out top communities if no tag selected
  const filteredCommunities = selectedTag
    ? sortedByMembers
    : sortedByMembers.filter((c) => !topCommunityIds.includes(c._id));

  // Shuffle and slice the communities once per render using useMemo
  const randomizedCommunities = useMemo(() => {
    return shuffleArray(filteredCommunities).slice(0, 10);
  }, [filteredCommunities]);

  const isTagSelected = Boolean(selectedTag);

  return (
    <div className={styles.discoverSection}>
      <span>Discover Communities</span>
      {randomizedCommunities.length === 0 ? (
        <p className={styles.noCommunitiesText}>No communities found</p>
      ) : (
        <motion.div
          className={selectedTag ? styles.communityListGridTwoColumns : styles.communityList}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          drag="x"
          dragConstraints={selectedTag ? { left: -250, right: 0 } : { left: -1100, right: 0 }}
        >

          {randomizedCommunities.map((community) => (
            <CommunityCard
              key={community._id}
              communityId={community._id}
              name={community.name}
              image={
                community.image
                  ? `${IMAGE_BASE_URL}${community.image}`
                  : "/src/assets/default-profile.png"
              }
              members={community.memberIds?.length || 0}
              description={community.description}
              isTopList={false}
              onJoin={handleJoin}
              joined={joinedCommunities.includes(community._id)}
              isTagSelected={isTagSelected} // pass flag to card if needed
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

export default DiscoverCommunities;

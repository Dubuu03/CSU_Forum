import React, { useState, useEffect, useMemo } from "react";
import CommunityCard from "./CommunityCard";
import { motion } from "framer-motion";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Spinner from "../Spinner";

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

const DiscoverCommunities = ({ selectedTag, topCommunityIds = [], keyword = "" }) => {
  const accessToken = useAuthRedirect();
  const { profile } = useStudentProfile(accessToken);
  const [communities, setCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      try {
        const unjoined = await fetchUnjoinedCommunities(profile.IDNumber);
        setCommunities(unjoined);
      } catch (err) {
        console.error("Failed to fetch unjoined communities", err);
        showAlert("Failed to load communities.", "error");
      } finally {
        setLoading(false);
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

  // Double filtering: filter by tag and keyword if both are present
  let filtered = communities;
  if (selectedTag && keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = communities.filter(
      (c) =>
        Array.isArray(c.tags) &&
        c.tags.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase()) &&
        ((c.name && c.name.toLowerCase().includes(lowerKeyword)) ||
          (c.description && c.description.toLowerCase().includes(lowerKeyword)))
    );
  } else if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = communities.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(lowerKeyword)) ||
        (c.description && c.description.toLowerCase().includes(lowerKeyword))
    );
  } else if (selectedTag) {
    filtered = communities.filter(
      (c) =>
        Array.isArray(c.tags) &&
        c.tags.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase())
    );
  }
  // Sort by member count descending
  const sortedByMembers = [...filtered].sort(
    (a, b) => (b.memberIds?.length || 0) - (a.memberIds?.length || 0)
  );
  // Filter out top communities if no tag or search
  const filteredCommunities = (selectedTag || keyword)
    ? sortedByMembers
    : sortedByMembers.filter((c) => !topCommunityIds.includes(c._id));
  // Shuffle and slice the communities once per render using useMemo
  const randomizedCommunities = useMemo(() => {
    return shuffleArray(filteredCommunities).slice(0, 8);
  }, [filteredCommunities]);
  const isTagOrSearch = Boolean(selectedTag) || Boolean(keyword);

  return (
    <div className={styles.discoverSection}>
      <span>Discover Communities</span>

      {(loading && (selectedTag || keyword)) ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
          <Spinner size={20} />
        </div>
      ) : randomizedCommunities.length === 0 ? (
        <p className={styles.noCommunitiesText}>No communities found</p>
      ) : (
        <motion.div
          className={isTagOrSearch ? styles.communityListGridTwoColumns : styles.communityList}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          drag="x"
          dragConstraints={isTagOrSearch ? { left: -250, right: 0 } : { left: -1100, right: 0 }}
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
              isTagSelected={isTagOrSearch}
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

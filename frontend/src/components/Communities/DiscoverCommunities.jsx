import React, { useState, useEffect } from "react";
import CommunityCard from "./CommunityCard";
import { motion } from "framer-motion";
import styles from "../../styles/Communities/CommunityCard.module.css";
import { joinCommunity, fetchUnjoinedCommunities } from "../../services/communityService";
import useStudentProfile from "../../hooks/Profile/useStudentProfile";
import useAuthRedirect from "../../hooks/Auth/useAuthRedirect";

const DiscoverCommunities = () => {
  const accessToken = useAuthRedirect();
  const { profile } = useStudentProfile(accessToken);
  const [communities, setCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);

  useEffect(() => {
    const loadCommunities = async () => {
      if (!profile?.IDNumber) return;
      try {
        const unjoined = await fetchUnjoinedCommunities(profile.IDNumber);
        setCommunities(unjoined);
      } catch (err) {
        console.error("Failed to fetch unjoined communities", err);
      }
    };

    loadCommunities();
  }, [profile]);

  const handleJoin = async (communityId) => {
    if (!profile) {
      alert("You must be logged in to join a community.");
      return;
    }

    try {
      await joinCommunity(accessToken, profile.IDNumber, communityId);
      alert("Successfully joined the community!");
      setJoinedCommunities((prev) => [...prev, communityId]);
    } catch (err) {
      alert("Failed to join the community.");
    }
  };


  const sortedByMembers = [...communities].sort(
    (a, b) => (b.memberIds?.length || 0) - (a.memberIds?.length || 0)
  );
  const top8Ids = new Set(sortedByMembers.slice(0, 4).map((c) => c._id));
  const filteredCommunities = communities.filter(c => !top8Ids.has(c._id));

  return (
    <div className={styles.discoverSection}>
      <span>Discover Communities</span>
      <motion.div
        className={styles.communityList}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        drag="x"
        dragConstraints={{ left: -200, right: 0 }}
      >
        {filteredCommunities.map((community) => (
          <CommunityCard
            key={community._id}
            communityId={community._id}
            name={community.name}
            image={community.image}
            members={community.memberIds?.length || 0}
            description={community.description}
            isTopList={false}
            onJoin={handleJoin}
            joined={joinedCommunities.includes(community._id)}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default DiscoverCommunities;

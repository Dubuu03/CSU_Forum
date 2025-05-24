import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommunityHeader from "../components/Community/CommunityHeader";
import CommunityTabs from "../components/Community/CommunityTabs";
import DiscussionList from "../components/Community/DiscussionList";
import Navbar from "../components/Navbar";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import styles from "../styles/Community/CommunityPage.module.css";
import {
  fetchCommunityById,
  fetchUserCommunities,
  joinCommunity,
  leaveCommunity,
} from "../services/communityService";
import { fetchDiscussionsByCommunity } from "../services/discussionService";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import useStudentPictures from "../hooks/Profile/useStudentPictures";

import Spinner from "../components/Spinner"; // Adjust the path if necessary

const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const CommunityPage = () => {
  const { communityId } = useParams();
  const accessToken = useAuthRedirect();
  const { profile } = useStudentProfile(accessToken);
  const { pictures } = useStudentPictures(accessToken);

  const [communityData, setCommunityData] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);

  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        const [community, discussionList] = await Promise.all([
          fetchCommunityById(communityId),
          fetchDiscussionsByCommunity(communityId, accessToken),
        ]);

        setCommunityData({
          id: community._id,
          name: community.name,
          organizer: toTitleCase(community.creatorName),
          date: new Date(community.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          tags: community.tags || [],
          posts: discussionList.length,
        });

        setMemberCount(community.memberIds?.length || 0);

        const formattedDiscussions = discussionList.map((disc) => ({
          _id: disc._id,
          title: disc.title,
          author: toTitleCase(disc.authorName),
          date: new Date(disc.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          content: disc.content,
          tags: disc.tags,
          postSrc: disc.image
            ? disc.image.startsWith("http") || disc.image.startsWith("data:image")
              ? disc.image
              : `http://localhost:5000/uploads/discussions/${disc.image}`
            : null,
          imageSrc:
            disc.authorImage?.startsWith("data:image") || disc.authorImage?.startsWith("http")
              ? disc.authorImage
              : "/src/assets/default-profile.png",
          likes: disc.upvotes || 0,
          comments: disc.comments?.length || 0,
          upvoters: disc.upvoters || [],
          downvoters: disc.downvoters || [],
        }));

        setDiscussions(formattedDiscussions);
      } catch (error) {
        console.error("Error loading community or discussions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCommunityData();
  }, [communityId, accessToken, pictures]);

  useEffect(() => {
    const checkMembership = async () => {
      if (!profile?.IDNumber || !communityId) return;
      try {
        const userCommunities = await fetchUserCommunities(profile.IDNumber);
        const isJoined = userCommunities.some((c) => c._id === communityId);
        setIsMember(isJoined);
      } catch (err) {
        console.error("Error checking membership:", err);
      }
    };
    checkMembership();
  }, [profile, communityId]);

  const handleToggleMembership = async () => {
    if (!accessToken || !profile?.IDNumber || !communityId) return;

    try {
      if (isMember) {
        await leaveCommunity(accessToken, profile.IDNumber, communityId);
        setIsMember(false);
        setMemberCount((prev) => Math.max(0, prev - 1));
      } else {
        await joinCommunity(accessToken, profile.IDNumber, communityId);
        setIsMember(true);
        setMemberCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error toggling membership:", err);
    }
  };

  if (loading)
    return (
      <div
        className={styles.pageContainer}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <Spinner />
      </div>
    );

  if (!communityData)
    return <div className={styles.pageContainer}>Community not found.</div>;

  return (
    <div className={styles.pageContainer}>
      <ProfileSidebar
        isOpen={isProfileSidebarOpen}
        onClose={() => setProfileSidebarOpen(false)}
      />

      <CommunityHeader
        name={communityData.name}
        organizer={communityData.organizer}
        date={communityData.date}
        members={memberCount}
        posts={communityData.posts}
        tags={communityData.tags}
        onOpenProfileSidebar={() => setProfileSidebarOpen(true)}
        communityId={communityData.id}
        isMember={isMember}
        onToggleMembership={handleToggleMembership}
      />

      <CommunityTabs tabs={["Discussions", "Announcements", "Events"]} />
      <DiscussionList discussions={discussions} />
      <Navbar />
    </div>
  );
};

export default CommunityPage;

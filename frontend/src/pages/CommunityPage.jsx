import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommunityHeader from "../components/Community/CommunityHeader";
import CommunityTabs from "../components/Community/CommunityTabs";
import DiscussionList from "../components/Community/DiscussionList";
import Navbar from "../components/Navbar";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import styles from "../styles/Community/CommunityPage.module.css";
import { fetchCommunityById } from "../services/communityService";
import { fetchDiscussionsByCommunity } from "../services/discussionService";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentPictures from "../hooks/Profile/useStudentPictures";

const toTitleCase = (str) =>
  str.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const CommunityPage = () => {
  const { communityId } = useParams();
  const accessToken = useAuthRedirect();
  const { pictures } = useStudentPictures(accessToken);

  const [communityData, setCommunityData] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);

  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        const [community, discussionList] = await Promise.all([
          fetchCommunityById(communityId),
          fetchDiscussionsByCommunity(communityId, accessToken),
        ]);

        setCommunityData({
          name: community.name,
          organizer: toTitleCase(community.creatorName),
          date: new Date(community.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          members: community.memberIds?.length || 0,
          tags: community.tags || [],
          posts: discussionList.length,
        });

        const formattedDiscussions = discussionList.map(disc => ({
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

  if (loading) return <div className={styles.pageContainer}>Loading community...</div>;
  if (!communityData) return <div className={styles.pageContainer}>Community not found.</div>;

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
        members={communityData.members}
        posts={communityData.posts}
        tags={communityData.tags}
        onOpenProfileSidebar={() => setProfileSidebarOpen(true)}
      />

      <CommunityTabs tabs={["Discussions", "Announcements", "Events"]} />
      <DiscussionList discussions={discussions} />
      <Navbar />
    </div>
  );
};

export default CommunityPage;

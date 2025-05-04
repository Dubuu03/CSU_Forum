import React from "react";
import CommunityHeader from "../components/Community/CommunityHeader";
import CommunityTabs from "../components/Community/CommunityTabs";
import DiscussionList from "../components/Community/DiscussionList";
import Navbar from "../components/Navbar";
import styles from "../styles/Community/CommunityPage.module.css";
import profile from "../assets/default-profile.png";
import post from "../assets/post-image.png";

const CommunityPage = () => {
  const communityData = {
    name: "Art Club Exhibition",
    organizer: "Sam Brown",
    date: "24 March 2025",
    members: "3.5M",
    posts: "3.5K",
    tags: ["Arts", "Exhibition", "Creative"],
  };

  const discussions = [
    {
      title: "Best Painting Techniques",
      author: "Sophia Lee",
      date: "12 April 2025",
      content: "What are some of the best techniques you use for acrylic painting?",
      imageSrc: profile,
      tags: ["Acrylic", "Painting"],
      postSrc: post,
      likes: 120,
      comments: 15,
    },
    
  ];

  return (
    <div className={styles.pageContainer}>
      <CommunityHeader 
        name={communityData.name} 
        organizer={communityData.organizer}
        date={communityData.date}
        members={communityData.members}
        posts={communityData.posts}
        tags={communityData.tags}
      />
      <CommunityTabs tabs={["Discussions", "Announcements", "Events"]} />
      <DiscussionList discussions={discussions} />
      <Navbar />
    </div>
  );
};

export default CommunityPage;

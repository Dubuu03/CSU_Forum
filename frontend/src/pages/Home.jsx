import React, { useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import FeaturedEvents from "../components/Home/FeaturedEvents";
import LatestAnnouncements from "../components/Home/LatestAnnouncements";
import RecentDiscussions from "../components/Home/RecentDiscussions";
import ClubActivities from "../components/Home/ClubActivities";
import Sidebar from "../components/Sidebar/Sidebar";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import CampusMap from "../components/Home/CampusMap";
import styles from "../styles/Home/Home.module.css";
import projName from "../assets/proj-name.png";
import eventImage from "../assets/events-sample.png";
import discussion from "../assets/discussion-sample.png";
import profile from "../assets/default-profile.png";
import clubActivities from "../assets/club-activities.png";

const event = [
    {
        title: "University Meet 2025",
        date: "20 February 2025",
        imageSrc: eventImage,
        bannerText: "Limited Seats",
    },
    {
        title: "University Meet 2025",
        date: "20 February 2025",
        imageSrc: eventImage,
        bannerText: "Limited Seats",
    },
    {
        title: "University Meet 2025",
        date: "20 February 2025",
        imageSrc: eventImage,
        bannerText: "Limited Seats",
    },
];

const announcementData = [
    {
        date: "7 June 2025",
        title: "Academic Update",
        message: "Prelims is officially evicted sa bahay ni Urdujah",
        type: "alert",
    },
    {
        date: "7 June 2025",
        title: "Schedule Update",
        message: "Final exams moved to next week.",
        type: "info",
    },
    {
        date: "7 June 2025",
        title: "Faculty Notice",
        message: "Professor Reyes is on leave for the month.",
        type: "event",
    },
];

const discussionData = [
    {
        title: "Election 2025",
        imageSrc: discussion,
        tags: ["Question", "Opinion"],
        author: "Amy Lee",
        date: "7 June 2025",
        message: "Boo Quiboloy!",
        profileSrc: profile,
    },
    {
        title: "Election 2025",
        imageSrc: discussion,
        tags: ["Question", "Opinion"],
        author: "Amy Lee",
        date: "7 June 2025",
        message: "Boo Quiboloy!",
        profileSrc: profile,
    },
    {
        title: "Election 2025",
        imageSrc: discussion,
        tags: ["Question", "Opinion"],
        author: "Amy Lee",
        date: "7 June 2025",
        message: "Boo Quiboloy!",
        profileSrc: profile,
    },

];

const activityData = [
    {
        title: "Art Club Exhibition",
        profileSrc: profile,
        imageSrc: clubActivities,
        author: "Sam Brown",
        date: "7 June 2025",
        description: "Join us for a showcase of student art...",
        tag: "Event",
    },
    {
        title: "Art Club Exhibition",
        profileSrc: profile,
        imageSrc: clubActivities,
        author: "Sam Brown",
        date: "7 June 2025",
        description: "Join us for a showcase of student art...",
        tag: "Event",
    },
    {
        title: "Art Club Exhibition",
        profileSrc: profile,
        imageSrc: clubActivities,
        author: "Sam Brown",
        date: "7 June 2025",
        description: "Join us for a showcase of student art...",
        tag: "Event",
    },
];

const campusMapData = "https://maps.app.goo.gl/matSesDRNYDgxg7H6";

const Home = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    return (
        <div className={styles.mainContainer}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <ProfileSidebar isOpen={isProfileSidebarOpen} onClose={() => setProfileSidebarOpen(false)} />
            <div className={styles.contentContainer}>
                <Header
                    logo={projName}
                    onOpenSidebar={() => setSidebarOpen(true)}
                    onOpenProfileSidebar={() => setProfileSidebarOpen(true)}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    isSearchOpen={isSearchOpen}
                    setIsSearchOpen={setIsSearchOpen}
                />
                <FeaturedEvents events={event} />
                <LatestAnnouncements announcements={announcementData} />
                <RecentDiscussions discussions={discussionData} />
                <ClubActivities activities={activityData} />
                <CampusMap mapLink={campusMapData} />
            </div>
            <NavBar />
        </div>
    );
}

export default Home;
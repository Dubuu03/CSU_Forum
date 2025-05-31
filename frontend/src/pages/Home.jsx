import { useState } from "react";
import clubActivities from "../assets/club-activities.png";
import profile from "../assets/default-profile.png";
import discussion from "../assets/discussion-sample.png";
import eventImage from "../assets/events-sample.png";
import projName from "../assets/proj-name.png";
import Header from "../components/Header";
import CampusMap from "../components/Home/CampusMap";
import ClubActivities from "../components/Home/ClubActivities";
import FeaturedEvents from "../components/Home/FeaturedEvents";
import LatestAnnouncements from "../components/Home/LatestAnnouncements";
import RecentDiscussions from "../components/Home/RecentDiscussions";
import NavBar from "../components/NavBar";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "../styles/Home/Home.module.css";

// Sample data for featured events
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

// Sample data for latest announcements
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

// Sample data for recent discussions
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

// Sample data for club activities
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

// Link for campus map location
const campusMapData = "https://maps.app.goo.gl/matSesDRNYDgxg7H6";

const Home = () => {
    // State to manage main sidebar open/close
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // State to manage profile sidebar open/close
    const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);

    return (
        <div className={styles.mainContainer}>
            {/* Sidebar for main navigation */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Sidebar for profile actions */}
            <ProfileSidebar
                isOpen={isProfileSidebarOpen}
                onClose={() => setProfileSidebarOpen(false)}
            />

            {/* Main content container */}
            <div className={styles.contentContainer}>
                {/* Header with logo and sidebar toggles */}
                <Header
                    logo={projName}
                    onOpenSidebar={() => setSidebarOpen(true)}
                    onOpenProfileSidebar={() => setProfileSidebarOpen(true)}
                />

                {/* Featured events section with sample event data */}
                <FeaturedEvents events={event} />

                {/* Latest announcements section */}
                <LatestAnnouncements announcements={announcementData} />

                {/* Recent discussions section */}
                <RecentDiscussions discussions={discussionData} />

                {/* Club activities section */}
                <ClubActivities activities={activityData} />

                {/* Campus map section with external map link */}
                <CampusMap mapLink={campusMapData} />
            </div>

            {/* Bottom navigation bar */}
            <NavBar />
        </div>
    );
};

export default Home;

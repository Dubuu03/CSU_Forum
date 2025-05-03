import React, { useState } from "react"; 
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import TopicTagList from "../components/Communities/TopicTagList";
import DiscoverCommunities from "../components/Communities/DiscoverCommunities";
import TopCommunities from "../components/Communities/TopCommunities";
import Sidebar from "../components/Sidebar/Sidebar";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import avatar from "../assets/default-profile.png";
import styles from "../styles/Communities/Communities.module.css";
import profile from "../assets/default-profile.png";

const topics = [
    "Internet Culture", "Games", "Technology", "Movies & TV",
    "Pop Culture", "News & Politics", "Technology", "Movies & TV",
    "Pop Culture", "News & Politics", "Technology", "Movies & TV",
    "Pop Culture"
];
const communities = [
    { image: avatar, name: "GetMotivated", members: "24.0m", description: "Find the motivation you need to tackle anything life throws your way." },
    { image: avatar, name: "rWritingPrompts", members: "19M", description: "Find the motivation you need to tackle anything life throws your way." },
    { image: avatar, name: "GetMotivated", members: "24.0m", description: "Find the motivation you need to tackle anything life throws your way." },
    { image: avatar, name: "rWritingPrompts", members: "19M", description: "Find the motivation you need to tackle anything life throws your way." },
];

const topCommunities = [
    { image: avatar, name: "GetMotivated", members: "24.0m", description: "Find the motivation you need to tackle anything life throws your way." },
    { image: avatar, name: "rWritingPrompts", members: "19M", description: "Find the motivation you need to tackle anything life throws your way." },
    { image: avatar, name: "GetMotivated", members: "24.0m", description: "Find the motivation you need to tackle anything life throws your way." },
    { image: avatar, name: "rWritingPrompts", members: "19M", description: "Find the motivation you need to tackle anything life throws your way." },
];

const profileData = {
    username: "U/Aquila0301",
    profileImage: avatar,
    status: "Online",
}

const Communities = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);
    return (
        <div className={styles.mainContainer}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <ProfileSidebar profile={profileData} isOpen={isProfileSidebarOpen} onClose={() => setProfileSidebarOpen(false)} />
            <div className={styles.contentContainer}>
                <Header 
                    title="Communities" 
                    onOpenSidebar={() => setSidebarOpen(true)}
                    onOpenProfileSidebar={() => setProfileSidebarOpen(true)}
                />
                <TopicTagList topics={topics} />
                <DiscoverCommunities communities={communities} />
                <TopCommunities topCommunities={topCommunities} />
            </div>

            <NavBar />
        </div>
    );
}

export default Communities;
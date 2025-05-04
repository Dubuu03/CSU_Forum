import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import Header from "../components/Header";
import TopicTagList from "../components/Communities/TopicTagList";
import DiscoverCommunities from "../components/Communities/DiscoverCommunities";
import TopCommunities from "../components/Communities/TopCommunities";
import styles from "../styles/Communities/Communities.module.css";

import { tagOptions } from "../constants/tagOptions";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";

import Sidebar from "../components/Sidebar/Sidebar";
import ProfileSidebar from "../components/Profile/ProfileSidebar";

const extractTopics = (options) => {
    if (!Array.isArray(options)) return [];
    if (typeof options[0] === "string") return options;
    if (typeof options[0] === "object") return options.map((opt) => opt.label);
    return [];
};

const Communities = () => {
    const [communities, setCommunities] = useState([]);
    const topics = extractTopics(tagOptions);

    const accessToken = useAuthRedirect();
    const navigate = useNavigate();

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
                <TopCommunities communities={communities} />
            </div>
            <NavBar />
        </div>
    );
};


export default Communities;

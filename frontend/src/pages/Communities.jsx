import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import Header from "../components/Header";
import TopicTagList from "../components/Communities/TopicTagList";
import DiscoverCommunities from "../components/Communities/DiscoverCommunities";
import TopCommunities from "../components/Communities/TopCommunities";
import Sidebar from "../components/Sidebar/Sidebar";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import Spinner from "../components/Spinner";

import styles from "../styles/Communities/Communities.module.css";
import { tagOptions } from "../constants/tagOptions";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";

const extractTopics = (options) => {
    if (!Array.isArray(options)) return [];
    if (typeof options[0] === "string") return options;
    if (typeof options[0] === "object") return options.map((opt) => opt.label);
    return [];
};

const Communities = () => {
    const [selectedTag, setSelectedTag] = useState(null);
    const [topCommunityIds, setTopCommunityIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const topics = extractTopics(tagOptions);
    const accessToken = useAuthRedirect();
    const navigate = useNavigate();

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);

    return (
        <div className={styles.mainContainer}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <ProfileSidebar isOpen={isProfileSidebarOpen} onClose={() => setProfileSidebarOpen(false)} />

            <div className={styles.contentContainer}>
                <Header
                    title="Communities"
                    onOpenSidebar={() => setSidebarOpen(true)}
                    onOpenProfileSidebar={() => setProfileSidebarOpen(true)}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    isSearchOpen={isSearchOpen}
                    setIsSearchOpen={setIsSearchOpen}
                />

                {loading ? (
                    <div className={styles.spinnerContainer}>
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <TopicTagList
                            topics={topics}
                            selectedTag={selectedTag}
                            onSelectTag={setSelectedTag}
                        />

                        <DiscoverCommunities
                            selectedTag={selectedTag}
                            topCommunityIds={topCommunityIds}
                            setLoading={setLoading}
                            keyword={keyword}
                        />

                        {!selectedTag && !keyword && (
                            <TopCommunities
                                setTopCommunityIds={setTopCommunityIds}
                                setLoading={setLoading}
                            />
                        )}
                    </>
                )}
            </div>

            <NavBar />
        </div>
    );
};

export default Communities;

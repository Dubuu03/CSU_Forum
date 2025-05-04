import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import Header from "../components/Header";
import TopicTagList from "../components/Communities/TopicTagList";
import DiscoverCommunities from "../components/Communities/DiscoverCommunities";
import TopCommunities from "../components/Communities/TopCommunities";
import styles from "../styles/Communities/Communities.module.css";

import { fetchUnjoinedCommunities } from "../services/communityService";
import { tagOptions } from "../constants/tagOptions";
import avatar from "../assets/default-profile.png"; 
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";

// Helper to format member count
const formatMemberCount = (count) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}m`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
    return count.toString();
};

// Extract tags from tagOptions
const extractTopics = (options) => {
    if (!Array.isArray(options)) return [];
    if (typeof options[0] === "string") return options;
    if (typeof options[0] === "object") return options.map(opt => opt.label);
    return [];
};

const Communities = () => {
    const [communities, setCommunities] = useState([]);
    const [topCommunities, setTopCommunities] = useState([]);
    const topics = extractTopics(tagOptions);

    const accessToken = useAuthRedirect();
    const navigate = useNavigate();
    const { profile, loading, error } = useStudentProfile(accessToken);

    useEffect(() => {
        const fetchCommunities = async () => {
            if (!profile || loading || error) return;

            try {
                const studentId = profile.IDNumber;
                const data = await fetchUnjoinedCommunities(studentId);

                const formatted = data.map((community) => {
                    const validMembers = (community.memberIds || []).filter(id =>
                        typeof id === "string" &&
                        !id.includes(".") &&
                        id.length < 30
                    );

                    return {
                        name: community.name,
                        description: community.description,
                        membersID: validMembers,
                        members: `${formatMemberCount(validMembers.length)}`,
                        image: avatar, 
                        initial: community.name?.charAt(0).toUpperCase() || "?"
                    };
                });

                setCommunities(formatted);

                const sorted = [...formatted].sort(
                    (a, b) => b.membersID.length - a.membersID.length
                );
                setTopCommunities(sorted.slice(0, 4));
            } catch (err) {
                console.error("Failed to fetch unjoined communities:", err);
            }
        };

        fetchCommunities();
    }, [profile, loading, error]);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.contentContainer}>
                <Header title="Communities" />
                <TopicTagList topics={topics} />
                <DiscoverCommunities communities={communities} />
                <TopCommunities topCommunities={topCommunities} />
            </div>
            <NavBar />
        </div>
    );
};

export default Communities;

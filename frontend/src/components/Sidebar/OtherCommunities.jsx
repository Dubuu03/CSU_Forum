import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Slider/Sidebar.module.css";
import { ChevronDown, ChevronUp, Component } from "lucide-react";

import useAuthRedirect from "../../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../../hooks/Profile/useStudentProfile";
import { fetchUserCommunities } from "../../services/communityService";

const OtherCommunities = () => {
    const accessToken = useAuthRedirect();
    const { profile } = useStudentProfile(accessToken);
    const [userCommunities, setUserCommunities] = useState([]);
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        const loadCommunities = async () => {
            if (!profile?.IDNumber) return;
            try {
                const data = await fetchUserCommunities(profile.IDNumber);
                // Sort communities alphabetically by name before setting state
                const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
                setUserCommunities(sortedData);
            } catch (err) {
                console.error("Failed to load user's communities", err);
            }
        };
        loadCommunities();
    }, [profile]);

    return (
        <div className={styles.otherCommunities}>
            <span
                onClick={() => setExpanded((prev) => !prev)}
                style={{ cursor: "pointer" }}
            >
                OTHER COMMUNITIES
                {expanded ? (
                    <ChevronUp size={18} color="#7d7d7d" />
                ) : (
                    <ChevronDown size={18} color="#7d7d7d" />
                )}
            </span>

            {expanded && (
                <ul className={styles.otherCommunitiesList}>
                    {userCommunities.length === 0 ? (
                        <li
                            style={{ color: "#888", fontSize: "14px", paddingLeft: "10px" }}
                        >
                            No joined communities
                        </li>
                    ) : (
                        userCommunities.map((community) => (
                            <li key={community._id}>
                                <Link to={`/communities/${community._id}`} title={community.name}>
                                    <Component size={18} color="#434343" />
                                    {community.name}
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default OtherCommunities;

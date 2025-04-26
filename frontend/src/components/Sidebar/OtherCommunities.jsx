import React from "react";
import styles from "../../styles/Slider/Sidebar.module.css";
import { ChevronDown } from "lucide-react";
import { Component } from "lucide-react";

const otherCommunities = [
    { name: "CR Ayos na", link: "#" },
    { name: "Pre, may yosi ka?", link: "#" },
    { name: "CR Ayos na", link: "#" },
    { name: "Pre, may yosi ka?", link: "#" },
];

const OtherCommunities = () => {
    return (
        <div className={styles.otherCommunities}>
            <span>
                OTHER COMMUNITIES
                <ChevronDown size={18} color="#7d7d7d" />
            </span>
            <ul className={styles.otherCommunitiesList}>
                {otherCommunities.map((community, index) => (
                    <li key={index}>
                        <a href={community.link}>
                            <Component size={18} color="#434343" />
                            {community.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OtherCommunities;

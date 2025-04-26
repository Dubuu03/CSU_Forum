import React from "react";
import styles from "../../styles/Slider/Sidebar.module.css";
import { ChevronDown } from "lucide-react";
import { Component } from "lucide-react";

const mainCommunities = [
  { name: "CSU - Carig", link: "#" },
  { name: "Department", link: "#" },
];

const MainCommunities = () => {
  return (
    <div className={styles.mainCommunity}>
      <span>
        MAIN COMMUNITY
        <ChevronDown size={18} color="#7d7d7d"  />
      </span>
      <ul className={styles.mainCommunityList}>
        {mainCommunities.map((community, index) => (
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

export default MainCommunities;

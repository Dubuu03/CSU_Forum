import React from "react";
import styles from "../../styles/Slider/Sidebar.module.css";
import { ChevronDown, Component } from "lucide-react";

import useAuthRedirect from "../../hooks/Auth/useAuthRedirect";
import useStudentCollege from "../../hooks/Profile/useStudentCollege";

// Reuse the same COLLEGES map used in your hook
const COLLEGES = new Map([
  ["coea", { label: "College of Engineering and Architecture", color: "#ba0d0d" }],
  ["cics", { label: "College of Information and Computing Sciences", color: "#ba660d" }],
  ["cit", { label: "College of Industrial Technology", color: "#38ba0d" }],
  ["cnsm", { label: "College of Natural Sciences and Mathematics", color: "#0d55ba" }],
  ["chass", { label: "College of Humanities and Social Sciences", color: "#8f8f00" }],
  ["cvm", { label: "College of Veterinary Medicine", color: "#5b0dba" }],
  ["com", { label: "College of Medicine", color: "#0dba30" }],
  ["cpad", { label: "College of Public Administration", color: "#ba0d41" }],
  ["chk", { label: "College of Human Kinetics", color: "#1b0dba" }],
]);

// Utility to extract shortcut (e.g., "CICS") from college label
const getCollegeShortcut = (label) => {
  for (const [key, value] of COLLEGES.entries()) {
    if (value.label === label) {
      return key.toUpperCase();
    }
  }
  return "DEPT";
};

const MainCommunities = () => {
  const accessToken = useAuthRedirect();
  const { college, loading } = useStudentCollege(accessToken);

  const collegeShortcut = loading ? "Loading..." : getCollegeShortcut(college.label);

  const mainCommunities = [
    { name: "CSU - Carig", link: "/communities/csu-carig" },
    { name: collegeShortcut, link: `/communities/${collegeShortcut.toLowerCase()}` },
  ];

  return (
    <div className={styles.mainCommunity}>
      <span>
        MAIN COMMUNITY
        <ChevronDown size={18} color="#7d7d7d" />
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

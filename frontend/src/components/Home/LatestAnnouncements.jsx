import React from "react";
import AnnouncementCard from "./AnnouncementCard";
import styles from "../../styles/Home/LatestAnnouncements.module.css";

const LatestAnnouncements = ({ announcements }) => {
  return (
    <div className={styles.announcements}>
      <span>Latest Announcements</span>
      <div className={styles.announcementList}>
        {announcements.map((announcement, index) => (
          <AnnouncementCard
            key={index}
            date={announcement.date}
            title={announcement.title}
            message={announcement.message}
            type={announcement.type}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestAnnouncements;

import React from "react";
import styles from "../../styles/Home/LatestAnnouncements.module.css";
import { Megaphone, Dot } from "lucide-react";

const AnnouncementCard = ({date, title, message }) => {
  return (
    <div className={styles.announcementCard}>
      <div className={styles.icon}>
        <Megaphone size={30}  />
      </div>
      <div className={styles.details}>
        <div className={styles.header}>
          <p>{title}</p>
          <Dot size={20} color="#000" className={styles.dot} />
          <p className={styles.date}>{date}</p>
        </div>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default AnnouncementCard;

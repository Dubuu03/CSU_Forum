import React from "react";
import styles from "../../styles/Home/LatestAnnouncements.module.css";
import { Megaphone, AlertTriangle, Info, CalendarDays, Dot } from "lucide-react";

const AnnouncementCard = ({ date, title, message, type }) => {
  const getIconByType = (type) => {
    switch (type) {
      case "alert":
        return <AlertTriangle size={26} />;
      case "info":
        return <Info size={26} />;
      case "event":
        return <CalendarDays size={26} />;
      default:
        return <Megaphone size={26} />;
    }
  };

  return (
    <div className={styles.announcementCard}>
      <div className={styles.icon}>
        {getIconByType(type)}
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
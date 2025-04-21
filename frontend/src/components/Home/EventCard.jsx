import React from "react";
import styles from "../../styles/Home/FeaturedEvents.module.css";

const EventCard = ({ title, date, imageSrc, bannerText }) => {
  return (
    <div className={styles.eventCard}>
      {bannerText && <div className={styles.banner}>{bannerText}</div>}
      <img src={imageSrc} alt={title} className={styles.eventImage} />
      <div className={styles.eventDetails}>
        <span>{title}</span>
        <p>{date}</p>
      </div>
    </div>
  );
};

export default EventCard;

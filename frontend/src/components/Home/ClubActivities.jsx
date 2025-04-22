import React from "react";
import ActivityCard from "./ActivityCard";
import styles from "../../styles/Home/ClubActivities.module.css";

const ClubActivities = ({ activities }) => {
  return (
    <div className={styles.clubActivities}>
      <span>Club Activities</span>
      <div className={styles.activityList}>
        {activities.map((activity, index) => (
          <ActivityCard
            key={index}
            title={activity.title}
            profileSrc={activity.profileSrc}
            imageSrc={activity.imageSrc}
            author={activity.author}
            date={activity.date}
            description={activity.description}
            tag={activity.tag}
          />
        ))}
      </div>
    </div>
  );
};

export default ClubActivities;

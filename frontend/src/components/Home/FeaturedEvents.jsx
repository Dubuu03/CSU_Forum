import React from "react";
import EventCard from "./EventCard";
import styles from "../../styles/Home/FeaturedEvents.module.css";

const FeaturedEvents = ({ events }) => {
  return (
    <div className={styles.eventsContainer }>
      <span>Featured Events</span>
      <div className={styles.eventCardsContainer}>
        {events.map((event, index) => (
          <EventCard
            key={index}
            title={event.title}
            date={event.date}
            imageSrc={event.imageSrc}
            bannerText={event.bannerText}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedEvents;

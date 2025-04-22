import React from "react";
import EventCard from "./EventCard";
import styles from "../../styles/Home/FeaturedEvents.module.css";
import { motion } from "framer-motion";

const FeaturedEvents = ({ events }) => {
  return (
    <div className={styles.eventsContainer }>
      <span>Featured Events</span>
      <motion.div 
        className={styles.eventCardsContainer}
        drag="x"
        dragConstraints={{ left: -200, right: 0 }} // Adjust constraints
      >
        {events.map((event, index) => (
          <EventCard
            key={index}
            title={event.title}
            date={event.date}
            imageSrc={event.imageSrc}
            bannerText={event.bannerText}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturedEvents;

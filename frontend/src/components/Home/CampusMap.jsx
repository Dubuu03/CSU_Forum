import React from "react";
import styles from "../../styles/Home/CampusMap.module.css";

const CampusMap = ({ mapLink }) => {
    return (
        <div className={styles.campusMap}>
            <span>Campus Map</span>

            <a href={mapLink} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3801.776613464557!2d121.75247449999999!3d17.660736099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33858f6324b51985%3A0x4c99ce6945927cae!2sCagayan%20State%20University-Carig%20Campus!5e0!3m2!1sen!2sph!4v1745319128493!5m2!1sen!2sph&zoom=12" 
                    width="100%"
                    height="200px"
                    style={{ borderRadius: "10px", border: "none" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </a>
        </div>
    );
};

export default CampusMap;

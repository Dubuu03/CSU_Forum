import React from "react";
import { useNavigate } from "react-router-dom";
import { CirclePlus } from "lucide-react";
import styles from "../../styles/Slider/Sidebar.module.css";

const CreateCommunityButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/createcommunity");
  };

  return (
    <div className={styles.createCommunity}>
      <button className={styles.createBtn} onClick={handleClick}>
        <CirclePlus size={24} color="#f1f1f1" fill="#434343" />
        Create community
      </button>
    </div>
  );
};

export default CreateCommunityButton;

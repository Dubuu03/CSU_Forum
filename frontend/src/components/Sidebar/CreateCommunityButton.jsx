import React from "react";
import styles from "../../styles/Sidebar/Sidebar.module.css";
import { CirclePlus } from "lucide-react";

const CreateCommunityButton = () => {
  return (
    <div className={styles.createCommunity}>
      <button className={styles.createBtn}>
        <CirclePlus size={24} color="#f1f1f1" fill="#434343"/>
         Create community
      </button>
    </div>
  );
};

export default CreateCommunityButton;

import React from "react";
import styles from "../styles/NavBar.module.css";
import { CirclePlus } from "lucide-react";
import { House } from "lucide-react";
import { Users } from "lucide-react";


const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
            <House
                color="#fff"
                style={{
                    cursor: "pointer"}
                }
            />
        </li>
        <li>
            <CirclePlus 
                color="#fff"
                style={{
                    cursor: "pointer"}
                }
            />
        </li>
        <li>
            <Users 
                color="#fff"
                fill="#fff"
                style={{
                    cursor: "pointer"}
                }
            />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

import NavBar from "../components/NavBar";
import Header from "../components/Header";
import TopicTagList from "../components/Communities/TopicTagList";
import styles from "../styles/Communities.module.css";

const topics = [
    "Internet Culture", "Games", "Technology", "Movies & TV",
    "Pop Culture", "News & Politics", "Technology", "Movies & TV",
    "Pop Culture", "News & Politics", "Technology", "Movies & TV",
    "Pop Culture"
];

const Communities = () => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.contentContainer}>
                <Header />
                <TopicTagList topics={topics} />

            </div>

            <NavBar />
        </div>
    );
}

export default Communities;
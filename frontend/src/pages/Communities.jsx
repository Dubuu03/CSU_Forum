import NavBar from "../components/NavBar";
import Header from "../components/Header";
import TopicTagList from "../components/Communities/TopicTagList";
import DiscoverCommunities from "../components/Communities/DiscoverCommunities";
import TopCommunities from "../components/Communities/TopCommunities";
import avatar from "../assets/default-profile.png";
import styles from "../styles/Communities/Communities.module.css";

const topics = [
    "Internet Culture", "Games", "Technology", "Movies & TV",
    "Pop Culture", "News & Politics", "Technology", "Movies & TV",
    "Pop Culture", "News & Politics", "Technology", "Movies & TV",
    "Pop Culture"
];
const communities = [
    { image: avatar, name: "GetMotivated", members: "24.0m", description: "Find the motivation you need to tackle anything life throws your way." },
    { image: avatar, name: "rWritingPrompts", members: "19M", description: "Find the motivation you need to tackle anything life throws your way." },
    { image: avatar, name: "GetMotivated", members: "24.0m", description: "Find the motivation you need to tackle anything life throws your way." },
    { image: avatar, name: "rWritingPrompts", members: "19M", description: "Find the motivation you need to tackle anything life throws your way." },
];

const topCommunities = [
    { image: avatar, name: "GetMotivated", members: "24.0m", description: "Find the motivation you need to tackle anything life throws your way." },
    { image: avatar, name: "rWritingPrompts", members: "19M", description: "Find the motivation you need to tackle anything life throws your way." },
    { image: avatar, name: "GetMotivated", members: "24.0m", description: "Find the motivation you need to tackle anything life throws your way." },
    { image: avatar, name: "rWritingPrompts", members: "19M", description: "Find the motivation you need to tackle anything life throws your way." },
];


const Communities = () => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.contentContainer}>
                <Header title="Communities" />
                <TopicTagList topics={topics} />
                <DiscoverCommunities communities={communities} />
                <TopCommunities topCommunities={topCommunities} />
            </div>

            <NavBar />
        </div>
    );
}

export default Communities;
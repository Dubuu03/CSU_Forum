import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import useFormattedName from "../hooks/Profile/useFormattedName";
import { createCommunity, fetchUserCommunities } from "../services/communityService";

const CreateCommunity = () => {
    const accessToken = useAuthRedirect(); // Ensure user is authenticated
    const navigate = useNavigate();
    const { profile, loading, error } = useStudentProfile(accessToken); // Fetch student profile

    const [communityData, setCommunityData] = useState({
        name: "",
        description: "",
        tags: "",
    });

    const [searchId, setSearchId] = useState(""); // Student ID input
    const [communities, setCommunities] = useState([]); // Fetched communities
    const [loadingCommunities, setLoadingCommunities] = useState(false);
    const [errorCommunities, setErrorCommunities] = useState("");
    const [searched, setSearched] = useState(false); // Track if search has been performed

    const handleChange = (e) => {
        setCommunityData({ ...communityData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profile) {
            alert("Error: Unable to fetch creator information.");
            return;
        }

        // Format the creator's name
        const formattedName = useFormattedName(profile.LastName, profile.FirstName, profile.MiddleName);

        // Check if a community with the same name already exists for the user
        const duplicateCommunity = communities.find((c) => c.name.toLowerCase() === communityData.name.toLowerCase());
        if (duplicateCommunity) {
            alert("A community with this name already exists.");
            return;
        }

        try {
            const result = await createCommunity(accessToken, communityData, {
                IDNumber: profile.IDNumber,
                formattedName,
            });

            if (result.error) {
                alert("Error: " + result.error);
            } else {
                alert("Community submitted for approval!");
                navigate("/dashboard");
            }
        } catch (error) {
            alert("Failed to create community.");
        }
    };

    // Function to fetch communities for a given student ID
    const handleSearchCommunities = async () => {
        setLoadingCommunities(true);
        setErrorCommunities("");
        setCommunities([]);
        setSearched(true);

        try {
            const result = await fetchUserCommunities(searchId);
            setCommunities(result);
        } catch (error) {
            setErrorCommunities("Failed to fetch communities.");
        }

        setLoadingCommunities(false);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Community</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: "red" }}>Error: {error}</p>
            ) : (
                <>
                    <div style={styles.searchContainer}>
                        <h3 style={styles.subTitle}>Check a Student's Communities</h3>
                        <input
                            type="text"
                            placeholder="Enter Student ID"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            style={styles.input}
                        />
                        <button onClick={handleSearchCommunities} disabled={loadingCommunities} style={styles.button}>
                            {loadingCommunities ? "Searching..." : "Search"}
                        </button>
                        {errorCommunities && <p style={{ color: "red" }}>{errorCommunities}</p>}
                        {searched && communities.length > 0 && (
                            <ul style={styles.communityList}>
                                {communities.map((community) => (
                                    <li key={community._id} style={styles.communityItem}>{community.name}</li>
                                ))}
                            </ul>
                        )}
                        {searched && communities.length === 0 && !loadingCommunities && (
                            <p style={styles.message}>No communities found.</p>
                        )}
                    </div>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <h3 style={styles.subTitle}>Create Communities</h3>
                        <input type="text" name="name" placeholder="Community Name" value={communityData.name} onChange={handleChange} required style={styles.input} />
                        <textarea name="description" placeholder="Description" value={communityData.description} onChange={handleChange} required style={styles.textarea} />
                        <input type="text" name="tags" placeholder="Tags (comma separated)" value={communityData.tags} onChange={handleChange} style={styles.input} />
                        <button type="submit" style={styles.button}>Create</button>
                    </form>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#f1f1f1",
        textAlign: "center",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    subTitle: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    searchContainer: {
        marginBottom: "20px",
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "16px",
    },
    textarea: {
        width: "100%",
        padding: "10px",
        minHeight: "80px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "16px",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#9d0208",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "10px",
    },
    communityList: {
        listStyle: "none",
        padding: "0",
        textAlign: "left",
        marginTop: "10px",
    },
    communityItem: {
        padding: "8px",
        backgroundColor: "#e9ecef",
        marginBottom: "5px",
        borderRadius: "5px",
    },
    message: {
        fontSize: "14px",
        color: "#555",
    },
    form: {
        padding: "20px",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
    },
};

export default CreateCommunity;

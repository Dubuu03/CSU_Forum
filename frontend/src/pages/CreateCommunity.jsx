import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import { createCommunity } from "../services/communityService";
import { tagOptions } from '../constants/tagOptions';

const CreateCommunity = () => {
    const accessToken = useAuthRedirect();
    const navigate = useNavigate();
    const { profile, loading, error } = useStudentProfile(accessToken);

    const [communityData, setCommunityData] = useState({ name: '', description: '', tags: '' });
    const [selectedTags, setSelectedTags] = useState([]);

    const handleChange = (e) => {
        setCommunityData({ ...communityData, [e.target.name]: e.target.value });
    };

    const handleTagChange = (e) => {
        const selected = e.target.value.trim();
        if (!selectedTags.includes(selected) && selectedTags.length < 3) {
            const updatedTags = [...selectedTags, selected];
            setSelectedTags(updatedTags);
            setCommunityData({ ...communityData, tags: updatedTags.join(',') });
        }
    };

    const handleTagSelectChange = (e) => {
        const selectedTag = e.target.value;
        if (selectedTag && !selectedTags.includes(selectedTag)) {
            handleTagChange({ target: { value: selectedTag } });
        }
    };

    const removeTag = (tagToRemove) => {
        const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
        setSelectedTags(updatedTags);
        setCommunityData({ ...communityData, tags: updatedTags.join(',') });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!profile) {
            alert('Error: Unable to fetch creator information.');
            return;
        }

        try {
            const result = await createCommunity(accessToken, communityData, {
                IDNumber: profile.IDNumber,
                formattedName: `${profile.FirstName} ${profile.LastName}`,
            });

            if (result.error) {
                alert('Error: ' + result.error);
            } else {
                alert('Community submitted for approval!');
                navigate('/dashboard');
            }
        } catch (error) {
            alert('Failed to create community.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Create a Community</h2>
            {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>Error: {error}</p> : (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Community Name"
                        value={communityData.name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={communityData.description}
                        onChange={handleChange}
                        required
                        style={styles.textarea}
                    />
                    <select
                        onChange={handleTagSelectChange}
                        style={styles.input}
                        value={selectedTags.length === 3 ? "" : ""}
                        disabled={selectedTags.length === 3}
                    >
                        <option value="" disabled>
                            Select up to 3 tags
                        </option>
                        {tagOptions.map((tag) => (
                            <option
                                key={tag}
                                value={tag}
                                disabled={selectedTags.includes(tag)}
                            >
                                {tag}
                            </option>
                        ))}
                    </select>
                    <div style={styles.tagList}>
                        {selectedTags.map((tag) => (
                            <span key={tag} style={styles.tag}>
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    style={styles.removeTagButton}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                    <button type="submit" style={styles.button}>Create</button>
                </form>
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
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",

    },
    textarea: {
        width: "100%",
        padding: "10px",
        minHeight: "80px",
        borderRadius: "5px",
        border: "1px solid #ccc",
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
    tagList: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "10px",
        marginBottom: "20px",
    },
    tag: {
        backgroundColor: "#e0e0e0",
        color: "#333",
        padding: "6px 10px",
        borderRadius: "50px",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
    },
    removeTagButton: {
        marginLeft: "8px",
        background: "transparent",
        border: "none",
        color: "#888",
        fontWeight: "bold",
        cursor: "pointer",
    },
};

export default CreateCommunity;

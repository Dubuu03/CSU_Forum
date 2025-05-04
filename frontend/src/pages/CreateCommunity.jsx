import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import { createCommunity } from "../services/communityService";
import { tagOptions } from "../constants/tagOptions";
import BtnBack from "../components/BtnBack";

const CreateCommunity = () => {
    const accessToken = useAuthRedirect();
    const navigate = useNavigate();
    const { profile, loading, error } = useStudentProfile(accessToken);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const maxTags = 3;

    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else if (selectedTags.length < maxTags) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!profile) {
            alert('Error: Unable to fetch creator information.');
            return;
        }

        try {
            const communityData = {
                name,
                description,
                tags: selectedTags.join(','),
            };

            const result = await createCommunity(accessToken, communityData, {
                IDNumber: profile.IDNumber,
                formattedName: `${profile.FirstName} ${profile.LastName}`,
            });

            if (result.error) {
                alert('Error: ' + result.error);
            } else {
                alert('Community submitted for approval!');
                navigate('/home');
            }
        } catch (error) {
            alert('Failed to create community.');
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.topBar}>
                <div style={styles.backWrapper}><BtnBack /></div>
                <button onClick={handleSubmit} style={styles.postButton}>Post</button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.heading}>Tell us about your community</h2>
                <p style={styles.subText}>A name and description help people understand what your community’s all about</p>

                <input
                    type="text"
                    placeholder="Community Name"
                    value={name}
                    maxLength={21}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={styles.input}
                />
                <div style={styles.charCount}>{name.length}/21</div>

                <textarea
                    placeholder="Description"
                    value={description}
                    maxLength={100}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    style={styles.textarea}
                />
                <div style={styles.charCount}>{description.length}/100</div>

                <h2 style={styles.heading}>Choose community topics</h2>
                <p style={styles.subText}>Add up to 3 topics to help interested users find your community</p>
                <div style={styles.tagList}>
                    {tagOptions.map(tag => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => handleTagClick(tag)}
                                style={{
                                    ...styles.tag,
                                    backgroundColor: isSelected ? "#9d0208" : "#fff",
                                    color: isSelected ? "#fff" : "#000",
                                    border: isSelected ? "none" : "1px solid #ccc"
                                }}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>

            </form>
        </div>
    );
};

const styles = {
    wrapper: {
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "system-ui, sans-serif",
    },
    topBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    backWrapper: {
        display: "flex",
        alignItems: "center",
    },
    postButton: {
        padding: "6px 16px",
        borderRadius: "20px",
        border: "1px solid #999",
        backgroundColor: "#fff",
        cursor: "pointer",
    },
    heading: {
        color: "#9d0208",
        fontSize: "18px",
        margin: "24px 0 6px",
    },
    subText: {
        fontSize: "14px",
        marginBottom: "12px",
    },
    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "10px",
        border: "1px solid #ccc",
        marginBottom: "4px",
    },
    textarea: {
        width: "100%",
        padding: "10px",
        borderRadius: "10px",
        border: "1px solid #ccc",
        minHeight: "100px",
        marginBottom: "4px",
    },
    charCount: {
        fontSize: "12px",
        textAlign: "right",
        marginBottom: "16px",
        color: "#666",
    },
    tagList: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "10px",
    },
    tag: {
        padding: "6px 14px",
        borderRadius: "18px",
        cursor: "pointer",
        fontSize: "13px",
        lineHeight: "1.2",
    }

};

export default CreateCommunity;

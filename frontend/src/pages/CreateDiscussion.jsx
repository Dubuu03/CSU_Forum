import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import useStudentPictures from "../hooks/Profile/useStudentPictures";
import { fetchUserCommunities } from "../services/communityService";
import { createDiscussion } from "../services/discussionService";
import { tagOptions } from "../constants/tagOptions";
import BtnBack from "../components/BtnBack";

const CreateDiscussion = () => {
    const accessToken = useAuthRedirect();
    const navigate = useNavigate();
    const { profile, loading: profileLoading, error: profileError } = useStudentProfile(accessToken);
    const { pictures, loading: pictureLoading, error: pictureError } = useStudentPictures(accessToken);

    const [postData, setPostData] = useState({
        title: "",
        content: "",
        tags: "",
        communityId: "",
    });

    const [selectedTags, setSelectedTags] = useState([]);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [communities, setCommunities] = useState([]);
    const [loadingCommunities, setLoadingCommunities] = useState(true);
    const [errorCommunities, setErrorCommunities] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        const loadUserCommunities = async () => {
            if (!profile) return;
            try {
                const data = await fetchUserCommunities(profile.IDNumber);
                setCommunities(data);
            } catch (err) {
                setErrorCommunities("Failed to load communities.");
            } finally {
                setLoadingCommunities(false);
            }
        };
        if (profile) loadUserCommunities();
    }, [profile]);

    const handleChange = (e) => {
        setPostData({ ...postData, [e.target.name]: e.target.value });
    };

    const handleTagChange = (e) => {
        const selected = e.target.value.trim();
        if (!selectedTags.includes(selected) && selectedTags.length < 3) {
            const updatedTags = [...selectedTags, selected];
            setSelectedTags(updatedTags);
            setPostData({ ...postData, tags: updatedTags.join(",") });
        }
    };

    const handleTagSelectChange = (e) => {
        const selectedTag = e.target.value;
        if (selectedTag && !selectedTags.includes(selectedTag)) {
            handleTagChange({ target: { value: selectedTag } });
        }
    };

    const removeTag = (tagToRemove) => {
        const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
        setSelectedTags(updatedTags);
        setPostData({ ...postData, tags: updatedTags.join(",") });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError("");

        if (!profile) {
            alert("Error: Unable to fetch creator profile.");
            setSubmitting(false);
            return;
        }

        if (pictureLoading) {
            alert("Please wait while your profile picture loads.");
            setSubmitting(false);
            return;
        }

        if (!postData.communityId) {
            alert("Please select a community.");
            setSubmitting(false);
            return;
        }

        try {
            const discussionData = {
                title: postData.title,
                content: postData.content,
                tags: postData.tags,
                communityId: postData.communityId,
                authorId: profile.IDNumber,
                authorName: `${profile.FirstName} ${profile.LastName}`,
                authorImage: pictures?.profpic || "", // ✅ this is now sent to the server
            };

            const result = await createDiscussion(discussionData, image, accessToken, true);

            if (result._id) {
                alert("Post submitted successfully!");
                navigate("/home");
            } else {
                throw new Error("Failed to create post");
            }
        } catch (error) {
            console.error("Submit error:", error);
            setSubmitError(error.response?.data?.error || "Failed to create post.");
        } finally {
            setSubmitting(false);
        }
    };
W

    if (profileLoading || pictureLoading) return <p>Loading profile...</p>;
    if (profileError) return <p className="error">{profileError.message || profileError}</p>;
    if (pictureError) return <p className="error">Error loading picture: {pictureError}</p>;

    return (
        <div style={styles.wrapper}>
            <div style={styles.topBar}>
                <BtnBack />
                <button onClick={handleSubmit} disabled={submitting} style={styles.postButton}>
                    {submitting ? "Posting..." : "Post"}
                </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form} encType="multipart/form-data">
                <label style={styles.label}>Create a Discussion</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={postData.title}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    style={styles.titleInput}
                />
                <textarea
                    name="content"
                    placeholder="Note something down"
                    value={postData.content}
                    onChange={handleChange}
                    required
                    maxLength={500}
                    style={styles.textarea}
                />
                <div style={styles.charCount}>{postData.content.length}/500</div>

                <label style={styles.label}>Choose where to post</label>
                <select
                    value={postData.communityId}
                    name="communityId"
                    onChange={handleChange}
                    required
                    style={styles.pillSelect}
                >
                    <option value="">Select a community</option>
                    {communities.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <label style={styles.label}>Add up to 3 topics that fit your discussion</label>
                <div style={styles.tagPicker}>
                    {tagOptions.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => {
                                    if (isSelected) {
                                        removeTag(tag);
                                    } else if (selectedTags.length < 3) {
                                        handleTagSelectChange({ target: { value: tag } });
                                    }
                                }}
                                style={{
                                    ...styles.tagPill,
                                    backgroundColor: isSelected ? "#9d0208" : "#fff",
                                    color: isSelected ? "#fff" : "#000",
                                    border: isSelected ? "none" : "1px solid #ccc",
                                }}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>

                {preview && (
                    <div style={styles.imagePreview}>
                        <img src={preview} alt="Preview" style={styles.image} />
                    </div>
                )}

                <label style={styles.label}>Optional: Add an image to your post</label>
                <label style={styles.imageUpload}>
                    + Add Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={styles.hiddenFileInput}
                    />
                </label>
            </form>
        </div>
    );
};

const styles = {
    wrapper: {
        maxWidth: "500px",
        margin: "0 auto",
        padding: "24px 16px 80px",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
    },
    topBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    postButton: {
        padding: "6px 16px",
        borderRadius: "20px",
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        fontWeight: "500",
        cursor: "pointer",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    titleInput: {
        fontSize: "20px",
        fontWeight: "600",
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        borderBottom: "2px solid #ccc",
        padding: "6px 0",
    },
    textarea: {
        border: "none",
        outline: "none",
        fontSize: "16px",
        backgroundColor: "transparent",
        resize: "vertical",
        minHeight: "100px",
    },
    pillSelect: {
        padding: "10px 16px",
        borderRadius: "30px",
        border: "1px solid #ccc",
        backgroundColor: "#e0e0e0",
        fontSize: "14px",
        appearance: "none",
    },
    tagPicker: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
    },
    tagPill: {
        padding: "6px 14px",
        borderRadius: "18px",
        fontSize: "13px",
        cursor: "pointer",
        backgroundColor: "#fff",
    },
    imagePreview: {
        marginTop: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        backgroundColor: "#fff",
    },
    image: {
        maxWidth: "100%",
        maxHeight: "300px",
        borderRadius: "4px",
    },
    imageUpload: {
        display: "inline-block",
        padding: "10px 18px",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "14px",
        color: "#333",
        cursor: "pointer",
        textAlign: "center",
        width: "fit-content",
    },
    hiddenFileInput: {
        display: "none",
    },
    label: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#9d0208",
        marginBottom: "-4px",
        marginTop: "12px",
    },
    charCount: {
        fontSize: "12px",
        color: "#666",
        textAlign: "right",
        marginTop: "-10px",
        marginBottom: "10px",
    },
};

export default CreateDiscussion;
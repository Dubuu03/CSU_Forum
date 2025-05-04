import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import { fetchUserCommunities } from "../services/communityService";
import { createDiscussion } from "../services/discussionService";
import { tagOptions } from "../constants/tagOptions";

const CreateDiscussion = () => {
    const accessToken = useAuthRedirect();
    const navigate = useNavigate();
    const { profile, loading: profileLoading, error: profileError } = useStudentProfile(accessToken);

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

        if (!postData.communityId) {
            alert("Please select a community.");
            setSubmitting(false);
            return;
        }

        try {
            // Prepare discussion data for the service
            const discussionData = {
                title: postData.title,
                content: postData.content,
                tags: postData.tags,
                communityId: postData.communityId,
                authorId: profile.IDNumber,
                authorName: `${profile.FirstName} ${profile.LastName}`
            };

            // Convert image to URL if needed - for now we'll pass null
            // If you have image upload working separately, you'd use the URL from there
            let imageUrl = null;
            if (image && typeof image === 'string') {
                imageUrl = image;
            }

            // Use JSON format (true as last parameter) since that worked in Postman
            const result = await createDiscussion(discussionData, imageUrl, accessToken, true);

            if (result._id) {
                alert("Post submitted successfully!");
                navigate("/dashboard");
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

    if (profileLoading) return <p>Loading profile...</p>;
    if (profileError) return <p className="error">{profileError.message || profileError}</p>;

    return (
        <div style={styles.container}>
            <h2>Create a Post</h2>

            {loadingCommunities ? (
                <p>Loading communities...</p>
            ) : errorCommunities ? (
                <p className="error">{errorCommunities}</p>
            ) : (
                <form onSubmit={handleSubmit} style={styles.form} encType="multipart/form-data">
                    <select
                        value={postData.communityId}
                        name="communityId"
                        onChange={handleChange}
                        required
                        style={styles.input}
                    >
                        <option value="">Select a community</option>
                        {communities.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="title"
                        placeholder="Post Title"
                        value={postData.title}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <textarea
                        name="content"
                        placeholder="Content"
                        value={postData.content}
                        onChange={handleChange}
                        required
                        style={styles.textarea}
                    />

                    {preview && (
                        <div style={styles.imagePreview}>
                            <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "300px" }} />
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={styles.input}
                    />

                    <select
                        onChange={handleTagSelectChange}
                        style={styles.input}
                        value=""
                        disabled={selectedTags.length === 3}
                    >
                        <option value="" disabled>
                            Select up to 3 tags
                        </option>
                        {tagOptions.map((tag) => (
                            <option key={tag} value={tag} disabled={selectedTags.includes(tag)}>
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

                    <button type="submit" disabled={submitting} style={styles.button}>
                        {submitting ? "Submitting..." : "Submit"}
                    </button>

                    {submitError && <p className="error">{submitError}</p>}
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
    imagePreview: {
        marginBottom: "10px",
        border: "1px solid #ccc",
        padding: "10px",
        textAlign: "center",
    },
};

export default CreateDiscussion;
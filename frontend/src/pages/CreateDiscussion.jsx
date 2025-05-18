import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import useStudentPictures from "../hooks/Profile/useStudentPictures";
import { fetchUserCommunities } from "../services/communityService";
import { createDiscussion } from "../services/discussionService";
import { tagOptions } from "../constants/tagOptions";
import BtnBack from "../components/BtnBack";
import Spinner from "../components/Spinner";
import styles from "../styles/Communities/CreateDiscussion.module.css";

const Alert = (props) => <MuiAlert elevation={6} {...props} />;

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
    const [submitting, setSubmitting] = useState(false);

    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

    const showAlert = (message, severity = "info") => {
        setAlert({ open: true, message, severity });
    };

    const handleAlertClose = () => {
        setAlert({ ...alert, open: false });
    };

    useEffect(() => {
        const loadUserCommunities = async () => {
            if (!profile) return;
            try {
                const data = await fetchUserCommunities(profile.IDNumber);
                setCommunities(data);
            } catch (err) {
                showAlert("Failed to load communities.", "error");
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

        if (!profile) {
            showAlert("Unable to fetch creator profile.", "error");
            setSubmitting(false);
            return;
        }

        if (pictureLoading) {
            showAlert("Please wait while your profile picture loads.", "warning");
            setSubmitting(false);
            return;
        }

        if (!postData.communityId) {
            showAlert("Please select a community.", "error");
            setSubmitting(false);
            return;
        }

        if (!postData.title.trim()) {
            showAlert("Title is required.", "warning");
            setSubmitting(false);
            return;
        }

        if (!postData.content.trim()) {
            showAlert("Content is required.", "warning");
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
                authorImage: pictures?.profpic || "",
            };

            const result = await createDiscussion(discussionData, image, accessToken);

            if (result._id) {
                showAlert("Post submitted successfully!", "success");
                setTimeout(() => navigate("/home"), 1500);
            } else {
                throw new Error("Failed to create post");
            }
        } catch (error) {
            console.error("Submit error:", error);
            showAlert(error.response?.data?.error || "Failed to create post.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (profileLoading || pictureLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Spinner />
            </div>
        );
    }

    if (profileError) return <p className="error">{profileError.message || profileError}</p>;
    if (pictureError) return <p className="error">Error loading picture: {pictureError}</p>;

    return (
        <div className={styles.wrapper}>
            <div className={styles.topBar}>
                <BtnBack />
                <button onClick={handleSubmit} disabled={submitting} className={styles.postButton}>
                    {submitting ? "Posting..." : "Post"}
                </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
                <label className={styles.label}>Create a Discussion</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={postData.title}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className={styles.titleInput}
                />
                <textarea
                    name="content"
                    placeholder="Note something down"
                    value={postData.content}
                    onChange={handleChange}
                    required
                    maxLength={500}
                    className={styles.textarea}
                />
                <div className={styles.charCount}>{postData.content.length}/500</div>

                <label className={styles.label}>Choose where to post</label>
                <select
                    value={postData.communityId}
                    name="communityId"
                    onChange={handleChange}
                    required
                    className={styles.pillSelect}
                >
                    <option value="">Select a community</option>
                    {communities.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <label className={styles.label}>Add up to 3 topics that fit your discussion</label>
                <div className={styles.tagPicker}>
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
                                className={styles.tagPill}
                                style={{
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
                    <div className={styles.imagePreview}>
                        <img src={preview} alt="Preview" className={styles.image} />
                    </div>
                )}

                <label className={styles.label}>Optional: Add an image to your post</label>
                <label className={styles.imageUpload}>
                    + Add Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={styles.hiddenFileInput}
                    />
                </label>
            </form>

            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={alert.open}
                autoHideDuration={3000}
                onClose={handleAlertClose}
            >
                <Alert
                    onClose={handleAlertClose}
                    severity={alert.severity}
                    sx={{ width: "100%" }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default CreateDiscussion;

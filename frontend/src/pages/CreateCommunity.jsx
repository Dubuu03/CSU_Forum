import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import useStudentPictures from "../hooks/Profile/useStudentPictures";
import { createCommunity } from "../services/communityService";
import { tagOptions } from "../constants/tagOptions";
import BtnBack from "../components/BtnBack";
import { Snackbar, Alert } from "@mui/material";
import styles from "../styles/Communities/CreateCommunities.module.css";

const CreateCommunity = () => {
    const accessToken = useAuthRedirect();
    const navigate = useNavigate();
    const { profile } = useStudentProfile(accessToken);
    const { pictures } = useStudentPictures(accessToken);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [banner, setBanner] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

    const maxTags = 3;

    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else if (selectedTags.length < maxTags) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const showAlert = (message, severity = "info") => {
        setAlert({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setAlert({ ...alert, open: false });
    };

    const creatorName = `${profile?.FirstName} ${profile?.LastName}`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profile) {
            showAlert("Error: Unable to fetch creator information.", "error");
            return;
        }

        if (!name.trim()) {
            showAlert("Community name is required.", "warning");
            return;
        }

        if (!description.trim()) {
            showAlert("Description is required.", "warning");
            return;
        }

        let uploadedFileName = "";

        if (banner) {
            try {
                const formData = new FormData();
                formData.append("image", banner);

                const uploadRes = await fetch("http://localhost:5000/api/communities/upload-image", {
                    method: "POST",
                    body: formData,
                });

                const uploadData = await uploadRes.json();

                if (!uploadRes.ok || !uploadData.filename) {
                    throw new Error(uploadData.error || "Image upload failed.");
                }

                uploadedFileName = uploadData.filename;
            } catch (uploadError) {
                console.error("Image upload error:", uploadError);
                showAlert("Image upload failed.", "error");
                return;
            }
        }

        const communityData = {
            name,
            description,
            tags: selectedTags,
            image: uploadedFileName,
            creatorImage: pictures?.profpic || "",
        };

        try {
            const result = await createCommunity(accessToken, communityData, {
                IDNumber: profile.IDNumber,
                formattedName: creatorName,
            });

            if (result.error) {
                console.error("Backend error:", result);
                showAlert("Error: " + result.error, "error");
            } else {
                showAlert("Community submitted for approval!", "success");
                setTimeout(() => navigate("/home"), 1500);
            }
        } catch (error) {
            console.error("Submission error:", error);
            showAlert("Failed to create community.", "error");
        }
    };

    return (
        <>
            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={alert.severity} sx={{ width: "100%" }}>
                    {alert.message}
                </Alert>
            </Snackbar>

            <div className={styles.wrapper}>
                <div className={styles.topBar}>
                    <div className={styles.backWrapper}>
                        <BtnBack />
                    </div>
                    <button onClick={handleSubmit} className={styles.postButton}>
                        Post
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.heading}>Tell us about your community</h2>
                    <p className={styles.subText}>
                        A name and description help people understand what your community’s all about
                    </p>

                    <input
                        type="text"
                        placeholder="Community Name"
                        value={name}
                        maxLength={21}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <div className={styles.charCount}>{name.length}/21</div>

                    <textarea
                        placeholder="Description"
                        value={description}
                        maxLength={100}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className={styles.textarea}
                    />
                    <div className={styles.charCount}>{description.length}/100</div>

                    <h2 className={styles.heading}>Style your community</h2>
                    <p className={styles.subText}>
                        A banner and avatar attract members and establish your community’s culture.
                    </p>

                    <div className={styles.bannerUploadRow}>
                        <span>Banner</span>
                        <label className={styles.bannerButton}>
                            Add
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setBanner(file);
                                    if (file) {
                                        setBannerPreview(URL.createObjectURL(file));
                                    }
                                }}
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>

                    <div className={styles.previewCard}>
                        <div className={styles.previewHeader}>
                            <img
                                src={bannerPreview || "/src/assets/default-profile.png"}
                                alt="Preview"
                                className={styles.previewAvatar}
                            />
                            <div>
                                <strong style={{ fontSize: "1rem", fontWeight: "bold", color: "#98050a" }}>
                                    {name || "Community Name"}
                                </strong>
                                <div style={{ fontSize: "12px", color: "#666" }}>0 members</div>
                            </div>
                        </div>
                        <p style={{ fontSize: "13px", marginTop: "6px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {description || "Find the motivation you need"}
                        </p>
                    </div>

                    <h2 className={styles.heading}>Choose community topics</h2>
                    <p className={styles.subText}>
                        Add up to 3 topics to help interested users find your community
                    </p>
                    <div className={styles.tagList}>
                        {tagOptions.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => handleTagClick(tag)}
                                    className={styles.tag}
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
                </form>
            </div>
        </>
    );
};

export default CreateCommunity;

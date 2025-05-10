import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import useStudentPictures from "../hooks/Profile/useStudentPictures";
import { createCommunity } from "../services/communityService";
import { tagOptions } from "../constants/tagOptions";
import BtnBack from "../components/BtnBack";
import { Alert, Snackbar } from "@mui/material";
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
    const [alert, setAlert] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const maxTags = 3;

    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else if (selectedTags.length < maxTags) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const creatorName = `${profile?.FirstName} ${profile?.LastName}`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profile) {
            setAlert("Error: Unable to fetch creator information.");
            setOpenSnackbar(true);
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
                setAlert("Image upload failed.");
                setOpenSnackbar(true);
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
                setAlert("Error: " + result.error);
                setOpenSnackbar(true);
            } else {
                setAlert("Community submitted for approval!");
                setOpenSnackbar(true);
                setTimeout(() => navigate("/home"), 1500);
            }
        } catch (error) {
            console.error("Submission error:", error);
            setAlert("Failed to create community.");
            setOpenSnackbar(true);
        }
    };

    return (
        <>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="info" sx={{ width: "100%" }}>
                    {alert}
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

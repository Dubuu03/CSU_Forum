import React, { useState } from "react";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import styles from "../../styles/Discussion/Discussion.module.css";
import { Dot, ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";
import { upvoteDiscussion, downvoteDiscussion } from "../../services/discussionService";
import useAuthRedirect from "../../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../../hooks/Profile/useStudentProfile";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} variant="filled" ref={ref} {...props} />;
});

const DiscussionPost = ({ post, onVoteUpdate, noNavigation }) => {
    const accessToken = useAuthRedirect();
    const { profile } = useStudentProfile(accessToken);
    const [voteLoading, setVoteLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info"
    });
    const [upvoters, setUpvoters] = useState(post.upvoters || []);
    const [downvoters, setDownvoters] = useState(post.downvoters || []);
    const [likes, setLikes] = useState(post.likes || post.upvotes || 0);

    React.useEffect(() => {
        setUpvoters(post.upvoters || []);
        setDownvoters(post.downvoters || []);
        setLikes(post.likes || post.upvotes || 0);
    }, [post.upvoters, post.downvoters, post.likes, post.upvotes]);

    const tagArray = Array.isArray(post.tags)
        ? post.tags.flatMap(tag => tag.split(",").map(t => t.trim())).filter(t => t)
        : typeof post.tags === "string"
            ? post.tags.split(",").map(t => t.trim()).filter(t => t)
            : [];

    const voteStatus = React.useMemo(() => {
        return {
            isUpvoted: upvoters.includes(profile?.IDNumber),
            isDownvoted: downvoters.includes(profile?.IDNumber)
        };
    }, [upvoters, downvoters, profile?.IDNumber]);
    const { isUpvoted, isDownvoted } = voteStatus;

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        event.stopPropagation();
        setSnackbar({ ...snackbar, open: false });
    };

    const handleUpvote = async (e) => {
        e.stopPropagation();
        if (voteLoading || !post._id || !profile?.IDNumber) return;
        try {
            setVoteLoading(true);
            const updatedDiscussion = await upvoteDiscussion(post._id, profile.IDNumber, accessToken);
            setUpvoters(updatedDiscussion.upvoters || []);
            setDownvoters(updatedDiscussion.downvoters || []);
            setLikes(updatedDiscussion.upvotes || 0);
            const isNowUpvoted = updatedDiscussion.upvoters?.includes(profile.IDNumber);
            setSnackbar({
                open: true,
                message: isNowUpvoted ? "Discussion upvoted!" : "Upvote removed",
                severity: "success"
            });
            if (onVoteUpdate) {
                onVoteUpdate(post._id, updatedDiscussion);
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Error upvoting. Please try again.",
                severity: "error"
            });
        } finally {
            setVoteLoading(false);
        }
    };

    const handleDownvote = async (e) => {
        e.stopPropagation();
        if (voteLoading || !post._id || !profile?.IDNumber) return;
        try {
            setVoteLoading(true);
            const updatedDiscussion = await downvoteDiscussion(post._id, profile.IDNumber, accessToken);
            setUpvoters(updatedDiscussion.upvoters || []);
            setDownvoters(updatedDiscussion.downvoters || []);
            setLikes(updatedDiscussion.upvotes || 0);
            const isNowDownvoted = updatedDiscussion.downvoters?.includes(profile.IDNumber);
            setSnackbar({
                open: true,
                message: isNowDownvoted ? "Discussion downvoted" : "Downvote removed",
                severity: "success"
            });
            if (onVoteUpdate) {
                onVoteUpdate(post._id, updatedDiscussion);
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Error downvoting. Please try again.",
                severity: "error"
            });
        } finally {
            setVoteLoading(false);
        }
    };

    return (
        <div className={styles.post}>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <div className={styles.userAvatar}>
                {post.imageSrc && (
                    <img src={post.imageSrc} alt="User" className={styles.avatarImage} />
                )}
            </div>
            <div className={styles.postInfo}>
                <div className={styles.userInfo}>
                    {post.author} <Dot size={26} /> {post.date}
                </div>
                <span className={styles.postTitle}>{post.title}</span>
                {tagArray.length > 0 && (
                    <div className={styles.tags}>
                        {tagArray.map((tag, index) => (
                            <span key={index} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <p className={styles.content}>{post.content}</p>
                {post.postSrc && post.postSrc.trim() !== "" && (
                    <div className={styles.postImage}>
                        <img src={post.postSrc} alt="Post image" />
                    </div>
                )}
                <div className={styles.interactionButtons} onClick={e => e.stopPropagation()}>
                    <div className={styles.voteButtons}>
                        <button
                            className={`${styles.voteButton} ${voteLoading ? styles.disabled : ""} ${isUpvoted ? styles.active : ""}`}
                            onClick={handleUpvote}
                            disabled={voteLoading}
                        >
                            <ArrowBigUp
                                size={20}
                                stroke="currentColor"
                                fill={isUpvoted ? "currentColor" : "none"}
                            />{" "}
                            {likes}
                        </button>
                        <button
                            className={`${styles.voteButton} ${voteLoading ? styles.disabled : ""} ${isDownvoted ? styles.active : ""}`}
                            onClick={handleDownvote}
                            disabled={voteLoading}
                        >
                            <ArrowBigDown
                                size={20}
                                stroke="currentColor"
                                fill={isDownvoted ? "currentColor" : "none"}
                            />
                        </button>
                    </div>
                    <button className={styles.commentButton} onClick={e => e.stopPropagation()}>
                        <MessageCircle size={17} /> {post.comments}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiscussionPost;

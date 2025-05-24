// src/components/Comments/CommentInput.jsx
import React, { useState } from "react";
import styles from "../../styles/Discussion/CommentInput.module.css";
import { SendHorizontal } from "lucide-react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} variant="filled" ref={ref} {...props} />;
});

const CommentInput = ({ onAddComment, parentId = null, userImage, loading }) => {
  const [comment, setComment] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() === "") {
      setSnackbarOpen(true);
      return;
    }
    onAddComment(comment, parentId); // Only send the comment text
    setComment("");
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div>
      <form className={styles.commentForm} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <div className={styles.imageContainer}>
            {userImage && (
              <img src={userImage} alt="User" className={styles.userAvatar} />
            )}
          </div>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Post your comment"
            className={styles.commentInput}
          />
        </div>
        <button type="submit" className={styles.submitBtn}>
          <SendHorizontal size={24} />
        </button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          Comment cannot be empty.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CommentInput;

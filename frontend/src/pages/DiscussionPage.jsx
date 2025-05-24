import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DiscussionPageHeader from "../components/Discussion/DiscussionPageHeader";
import DiscussionPost from "../components/Discussion/DiscussionPost";
import CommentSection from "../components/Discussion/CommentSection";
import styles from "../styles/Discussion/DiscussionPage.module.css";
import profilePic from "../assets/default-profile.png";
import Spinner from "../components/Spinner";
import { fetchDiscussionById, fetchDiscussionComments } from "../services/discussionService";
import { createComment, getCommentsByDiscussionId } from "../services/commentService";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import useStudentPictures from "../hooks/Profile/useStudentPictures";

const DiscussionPage = () => {
  const { discussionId } = useParams();
  const accessToken = useAuthRedirect();
  const { profile } = useStudentProfile(accessToken);
  const { pictures } = useStudentPictures(accessToken);

  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch discussion and comments
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [discussionData, commentsData] = await Promise.all([
          fetchDiscussionById(discussionId, accessToken),
          getCommentsByDiscussionId(discussionId),
        ]);
        setDiscussion(discussionData);
        setComments(commentsData);
      } catch (err) {
        setError("Failed to load discussion or comments.");
      } finally {
        setLoading(false);
      }
    };
    if (discussionId && accessToken) {
      loadData();
    }
  }, [discussionId, accessToken]);

  // Handle posting a new comment
  const handleAddComment = async (content) => {
    if (!profile || !accessToken) return;
    setCommentLoading(true);
    try {
      // Format name: capitalize each part of first and last name, ignore middle name
      const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
      const formatMulti = str => str ? str.split(' ').map(cap).join(' ') : '';
      const authorName = profile.FirstName && profile.LastName
        ? `${formatMulti(profile.FirstName)} ${formatMulti(profile.LastName)}`.trim()
        : profile.fullName || profile.name || "Anonymous";
      await createComment(
        {
          content,
          authorId: profile.IDNumber,
          authorName,
          authorImage: (pictures && pictures.profpic) || profile.profilePic || profilePic,
          parentId: discussionId,
          isReply: false,
        },
        accessToken
      );
      // Reload comments after posting
      const updatedComments = await getCommentsByDiscussionId(discussionId);
      setComments(updatedComments);
    } catch (err) {
      setError("Failed to post comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle posting a reply to a comment (nested)
  const handleAddReply = async (content, parentCommentId) => {
    if (!profile || !accessToken) return;
    setCommentLoading(true);
    try {
      const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
      const formatMulti = str => str ? str.split(' ').map(cap).join(' ') : '';
      const authorName = profile.FirstName && profile.LastName
        ? `${formatMulti(profile.FirstName)} ${formatMulti(profile.LastName)}`.trim()
        : profile.fullName || profile.name || "Anonymous";
      await createComment(
        {
          content,
          authorId: profile.IDNumber,
          authorName,
          authorImage: (pictures && pictures.profpic) || profile.profilePic || profilePic,
          parentId: parentCommentId,
          isReply: true,
          replyToCommentId: parentCommentId,
        },
        accessToken
      );
      // Reload all comments after posting a reply
      const updatedComments = await getCommentsByDiscussionId(discussionId);
      setComments(updatedComments);
    } catch (err) {
      setError("Failed to post reply.");
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.mainContainer} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <div className={styles.mainContainer}>{error}</div>;
  }
  if (!discussion) {
    return <div className={styles.mainContainer}>Discussion not found.</div>;
  }

  // Format discussion data for DiscussionPost
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
  const formatMulti = str => str ? str.split(' ').map(cap).join(' ') : '';
  const postAuthorName = discussion.authorName
    ? formatMulti(discussion.authorName)
    : discussion.author || "Anonymous";

  const postData = {
    title: discussion.title,
    author: postAuthorName,
    date: new Date(discussion.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    content: discussion.content,
    tags: discussion.tags || [],
    imageSrc:
      discussion.authorImage?.startsWith("data:image") || discussion.authorImage?.startsWith("http")
        ? discussion.authorImage
        : profilePic,
    likes: discussion.upvotes || 0,
    comments: discussion.comments?.length || 0,
  };

  return (
    <div className={styles.mainContainer}>
      <DiscussionPageHeader
        communityName={discussion.communityName || "Community"}
        onBack={() => window.history.back()}
        onSearch={() => { }}
      />
      <div className={styles.discussionSection}>
        <DiscussionPost post={postData} noBorder />
      </div>
      <div className={styles.commentSection}>
        <CommentSection
          comments={comments}
          userImage={(pictures && pictures.profpic) || profile?.profilePic || profilePic}
          onAddComment={handleAddComment}
          onAddReply={handleAddReply}
          commentLoading={commentLoading}
        />
      </div>
    </div>
  );
};

export default DiscussionPage;

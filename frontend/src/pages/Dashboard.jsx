// components/Dashboard.js
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import useStudentCourse from "../hooks/Profile/useStudentCourse";
import useStudentCollege from "../hooks/Profile/useStudentCollege";
import useStudentPictures from "../hooks/Profile/useStudentPictures";  
import authService from "../services/authService";

const Dashboard = () => {
    const navigate = useNavigate();
    const accessToken = useAuthRedirect();

    const { profile, loading: profileLoading, error: profileError } = useStudentProfile(accessToken);
    const { course, loading: courseLoading, error: courseError } = useStudentCourse(accessToken);
    const { college, loading: collegeLoading, error: collegeError } = useStudentCollege(accessToken);
    const { pictures, loading: picturesLoading, error: picturesError } = useStudentPictures(accessToken); 

    if (profileLoading || courseLoading || collegeLoading || picturesLoading) return <p>Loading profile...</p>;
    if (profileError || courseError || collegeError || picturesError)
        return <p style={{ color: "red" }}>Error: {profileError || courseError || collegeError || picturesError}</p>;

    const avatarText = profile?.FirstName?.charAt(0).toUpperCase() || "?"; // Use first letter of the first name
    const profileImageUrl = pictures?.profpic || ""; // Assuming `profpic` contains the URL for the profile picture

    return (
        <div style={{ padding: "20px" }}>
            <h1>Dashboard</h1>
            <div
                style={{
                    backgroundColor: college.color,
                    padding: "15px",
                    borderRadius: "10px",
                    color: "#fff",
                    maxWidth: "400px",
                    textAlign: "center",
                }}
            >
                <h2>Student Profile</h2>

                <div
                    style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        backgroundColor: "#333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "50px",
                        fontWeight: "bold",
                        color: "#fff",
                        margin: "auto",
                    }}
                >
                    {/* Show profile image if available, otherwise show the initial */}
                    {profileImageUrl ? (
                        <img
                            src={profileImageUrl}
                            alt="Profile"
                            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                        />
                    ) : (
                        avatarText
                    )}
                </div>

                <p><strong>ID Number:</strong> {profile.IDNumber}</p>
                <p><strong>Last Name:</strong> {profile.LastName}</p>
                <p><strong>First Name:</strong> {profile.FirstName}</p>
                <p><strong>Middle Name:</strong> {profile.MiddleName}</p>
                <p><strong>College:</strong> {college.label}</p>
                <p><strong>Course:</strong> {course}</p>
            </div>
            <br />
            <button onClick={() => {
                authService.logout();
                navigate("/login"); // Redirect to login on logout
            }}>
                Logout
            </button>

            <p><Link to="/createcommunity">Go to Create Community</Link></p>
            <p><Link to="/community">Go to Community</Link></p>
            <p><Link to="/post">Go to Create Post</Link></p>
        </div>
    );
};

export default Dashboard;

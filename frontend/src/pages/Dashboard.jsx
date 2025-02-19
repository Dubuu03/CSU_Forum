import React, { useEffect, useState } from "react";
import profileService from "../services/profileService";
import authService from "../services/authService";

const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) throw new Error("No access token found");

                // Fetch student profile
                const studentProfile = await profileService.getBasicProfile(accessToken);
                setProfile(studentProfile);

                // Fetch student course
                const studentCourse = await profileService.getCourse(accessToken);
                setCourse(studentCourse);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    // Generate the profile avatar text (first letter of the first name)
    const avatarText = profile?.FirstName?.charAt(0).toUpperCase() || "?";

    return (
        <div style={{ padding: "20px" }}>
            <h1>Dashboard</h1>
            <div
                style={{
                    backgroundColor: profile.CollegeColor,
                    padding: "15px",
                    borderRadius: "10px",
                    color: "#fff",
                    maxWidth: "400px",
                    textAlign: "center",
                }}
            >
                <h2>Student Profile</h2>

                {/* Profile Picture (First Letter of First Name) */}
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
                    {avatarText}
                </div>

                <p><strong>ID Number:</strong> {profile.IDNumber}</p>
                <p><strong>Last Name:</strong> {profile.LastName}</p>
                <p><strong>First Name:</strong> {profile.FirstName}</p>
                <p><strong>Middle Name:</strong> {profile.MiddleName || "N/A"}</p>
                <p><strong>College:</strong> {profile.College}</p>
                <p><strong>Course:</strong> {course || "Not Available"}</p>
            </div>
            <br />
            <button onClick={() => authService.logout()}>Logout</button>
        </div>
    );
};

export default Dashboard;

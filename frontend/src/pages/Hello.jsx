import React from 'react';
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import useFormattedName from "../hooks/useFormattedName";
import authService from "../services/authService";
import useAuthRedirect from "../hooks/useAuthRedirect";

const Hello = () => {
    const accessToken = useAuthRedirect();
    const { profile, loading: profileLoading, error: profileError } = useStudentProfile(accessToken);

    if (profileLoading) return <p>Loading...</p>;
    if (profileError) return <p style={{ color: "red" }}>Error: {profileError}</p>;
    if (!profile) return <p>No profile data available.</p>;

    const fullName = useFormattedName(profile.LastName, profile.FirstName, profile.MiddleName);

    return (
        <div>
            <p><strong>ID Number:</strong> {profile.IDNumber}</p>
            <p><strong>Full Name:</strong> {fullName}</p>
            <button onClick={() => authService.logout()}>Logout</button>
        </div>
    );
}

export default Hello;

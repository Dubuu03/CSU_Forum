import { Link } from "react-router-dom";
import useAuthRedirect from "../hooks/Auth/useAuthRedirect";
import useCommunities from "../hooks/Community/useCommunities";
import useStudentProfile from "../hooks/Profile/useStudentProfile";
import authService from "../services/authService";

const Communities = () => {
    const accessToken = useAuthRedirect();
    const { profile, loading: profileLoading, error: profileError } = useStudentProfile(accessToken);
    const {
        unjoinedCommunities,
        userCommunities,
        loading,
        error,
        joiningStates,
        leavingStates,
        handleJoinCommunity,
        handleLeaveCommunity
    } = useCommunities(profile, accessToken);

    if (profileLoading || (loading && profile)) {
        return <div style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>Loading...</div>;
    }

    if (profileError) {
        return <div style={{ textAlign: "center", color: "red" }}>Failed to load profile. Please refresh the page.</div>;
    }

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", borderRadius: "8px" }}>
            <h2 style={{ textAlign: "center", color: "#333" }}>Communities</h2>
            {error && <div style={{ textAlign: "center", color: "red" }}>{error}</div>}

            <h3 style={{ color: "#333" }}>Communities I am a Member of</h3>
            {userCommunities.length === 0 ? (
                <p style={{ textAlign: "center", fontSize: "16px", color: "#777" }}>No joined communities.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: "0" }}>
                    {userCommunities.map((community) => (
                        <li key={community._id} style={{ padding: "15px", margin: "10px 0", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#fff" }}>
                            <strong style={{ fontSize: "18px", color: "#333" }}>{community.name}</strong>
                            <p style={{ color: "#666", fontSize: "14px" }}>{community.description}</p>
                            <p style={{ color: "#888", fontSize: "12px" }}>Owner: {community.creatorName}</p>
                            <button
                                disabled={profile.IDNumber === community.creatorId}
                                style={{
                                    padding: "8px 12px",
                                    backgroundColor: profile.IDNumber === community.creatorId ? "#6c757d" : "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: profile.IDNumber === community.creatorId ? "not-allowed" : "pointer",
                                    fontSize: "14px"
                                }}
                                onClick={profile.IDNumber !== community.creatorId ? () => {
                                    if (window.confirm("Are you sure you want to leave this community?")) {
                                        handleLeaveCommunity(community._id);
                                    }
                                } : undefined}
                            >
                                {profile.IDNumber === community.creatorId ? "Owner" : (leavingStates[community._id] ? "Leaving..." : "Leave")}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <h3 style={{ color: "#333" }}>Communities I am Not a Member of</h3>
            {unjoinedCommunities.length === 0 ? (
                <p style={{ textAlign: "center", fontSize: "16px", color: "#777" }}>No unjoined communities available.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: "0" }}>
                    {unjoinedCommunities.map((community) => (
                        <li key={community._id} style={{ padding: "15px", margin: "10px 0", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#fff" }}>
                            <strong style={{ fontSize: "18px", color: "#333" }}>{community.name}</strong>
                            <p style={{ color: "#666", fontSize: "14px" }}>{community.description}</p>
                            <p style={{ color: "#888", fontSize: "12px" }}>Owner: {community.creatorName}</p>
                            {profile.IDNumber === community.creatorId ? (
                                <button
                                    disabled
                                    style={{ padding: "8px 12px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", fontSize: "14px" }}
                                >
                                    Owner
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleJoinCommunity(community._id)}
                                    disabled={joiningStates[community._id]}
                                    style={{ padding: "8px 12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px" }}
                                >
                                    {joiningStates[community._id] ? "Joining..." : "Join"}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={() => {
                authService.logout();
                navigate("/login"); 
            }}>
                Logout
            </button>

            <p><Link to="/dashboard">Go to Dashboard</Link></p>
            <p><Link to="/community">Go to Community</Link></p>
        </div>
    );
};

export default Communities;
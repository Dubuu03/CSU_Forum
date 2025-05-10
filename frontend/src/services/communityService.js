import CONFIG from "../config";

const API_URL = `${CONFIG.API_BASE_URL}/api/communities`;

// Create a new community (Requires approval)
export const createCommunity = async (accessToken, communityData, creator) => {
    const requestBody = {
        ...communityData,
        creatorId: creator.IDNumber,
        creatorName: creator.formattedName,
        tags: Array.isArray(communityData.tags)
            ? communityData.tags
            : communityData.tags.split(",").map(tag => tag.trim()),
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to create community");
        }

        return data;
    } catch (error) {
        console.error("Error creating community:", error);
        throw error;
    }
};


// Get all approved communities
export const fetchAllCommunities = async () => {
    try {
        const res = await fetch(API_URL);
        return await res.json();
    } catch (error) {
        console.error("Error fetching communities:", error);
        throw error;
    }
};

// Get a specific community by ID
export const fetchCommunityById = async (communityId) => {
    try {
        const res = await fetch(`${API_URL}/${communityId}`);
        return await res.json();
    } catch (error) {
        console.error("Error fetching community:", error);
        throw error;
    }
};

// Approve a community (Admin Only)
export const approveCommunity = async (accessToken, communityId) => {
    try {
        const res = await fetch(`${API_URL}/${communityId}/approve`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return await res.json();
    } catch (error) {
        console.error("Error approving community:", error);
        throw error;
    }
};

// Delete a community
export const deleteCommunity = async (accessToken, communityId) => {
    try {
        const res = await fetch(`${API_URL}/${communityId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return await res.json();
    } catch (error) {
        console.error("Error deleting community:", error);
        throw error;
    }
};

// Get all communities a student is a member of
export const fetchUserCommunities = async (studentId) => {
    try {
        const res = await fetch(`${API_URL}/user/${studentId}`);
        return await res.json();
    } catch (error) {
        console.error("Error fetching user's communities:", error);
        throw error;
    }
};

// Get all approved communities the user has NOT joined
export const fetchUnjoinedCommunities = async (studentId) => {
    if (!studentId) {
        throw new Error("Student ID is required");
    }

    try {
        const res = await fetch(`${API_URL}/unjoined/${studentId}`);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const communities = await res.json();

        // Additional client-side verification
        return communities.filter(community =>
            !community.memberIds.includes(String(studentId))
        );
    } catch (error) {
        console.error("Error fetching unjoined communities:", error);
        throw error;
    }
};

// Join a community
export const joinCommunity = async (accessToken, studentId, communityId) => {
    try {
        console.log("Sending join request:", { studentId, communityId });

        const res = await fetch(`${API_URL}/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ studentId, communityId }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || "Failed to join community");
        }

        console.log("Join response:", data);
        return data;
    } catch (error) {
        console.error("Error joining community:", error);
        throw error;
    }
};

// Leave a community
export const leaveCommunity = async (accessToken, studentId, communityId) => {
    try {
        console.log("Sending leave request:", { studentId, communityId });

        const res = await fetch(`${API_URL}/leave`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ studentId, communityId }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || "Failed to leave community");
        }

        console.log("Leave response:", data);
        return data;
    } catch (error) {
        console.error("Error leaving community:", error);
        throw error;
    }
};

export const uploadCommunityImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const res = await fetch(`${API_URL}/upload-image`, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Image upload failed");
        }

        return data.filename; // You will save this filename in the community's "image" field
    } catch (error) {
        console.error("Image upload error:", error);
        throw error;
    }
};
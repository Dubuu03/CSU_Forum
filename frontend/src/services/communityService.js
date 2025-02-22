import CONFIG from "../config";

const API_URL = `${CONFIG.API_BASE_URL}/api/communities`;

// Create a new community (Requires approval)
export const createCommunity = async (accessToken, communityData, creator) => {
    const requestBody = {
        ...communityData,
        creatorId: creator.IDNumber,
        creatorName: creator.formattedName,
        tags: communityData.tags.split(",").map((tag) => tag.trim()),
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

        return await res.json();
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

export const fetchUserCommunities = async (studentId) => {
    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/api/communities/user/${studentId}`);
        return await res.json();
    } catch (error) {
        console.error("Error fetching user's communities:", error);
        throw error;
    }
};

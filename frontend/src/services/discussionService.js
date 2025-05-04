import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';


//Create a new discussion post

export const createDiscussion = async (discussionData, image, accessToken, useJson = false) => {
    try {
        let data;
        let headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        if (useJson) {
            // Use JSON payload (like in your successful Postman request)
            data = {
                title: discussionData.title,
                content: discussionData.content,
                authorId: discussionData.authorId,
                authorName: discussionData.authorName,
                community: discussionData.communityId,
                tags: discussionData.tags
            };

            // Add image URL if it's a string
            if (image && typeof image === 'string') {
                data.image = image;
            }

            headers['Content-Type'] = 'application/json';
        } else {
            // Use FormData for multipart/form-data (for file uploads)
            data = new FormData();

            // Add discussion data to form
            data.append('title', discussionData.title);
            data.append('content', discussionData.content);
            data.append('authorId', discussionData.authorId);
            data.append('authorName', discussionData.authorName);
            data.append('community', discussionData.communityId);

            // Add tags if they exist
            if (discussionData.tags && discussionData.tags.length > 0) {
                data.append('tags', discussionData.tags);
            }

            // Add image if it's a File object
            if (image && image instanceof File) {
                data.append('image', image);
            }

            headers['Content-Type'] = 'multipart/form-data';
        }

        console.log('Sending data to API:', data);

        const response = await axios.post(
            `${API_BASE_URL}/discussions`,
            data,
            { headers }
        );

        return response.data;
    } catch (error) {
        console.error('Error creating discussion:', error);
        throw error;
    }
};

// Fetch all discussions

export const fetchDiscussions = async (accessToken) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/discussions`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching discussions:', error);
        throw error;
    }
};

// Fetch a single discussion by ID

export const fetchDiscussionById = async (discussionId, accessToken) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/discussions/${discussionId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error(`Error fetching discussion ${discussionId}:`, error);
        throw error;
    }
};

// Fetch discussions by community ID

export const fetchDiscussionsByCommunity = async (communityId, accessToken) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/discussions/community/${communityId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error(`Error fetching discussions for community ${communityId}:`, error);
        throw error;
    }
};

// Delete a discussion by ID

export const deleteDiscussion = async (discussionId, accessToken) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/discussions/${discussionId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error(`Error deleting discussion ${discussionId}:`, error);
        throw error;
    }
};

// Update a discussion by ID

export const updateDiscussion = async (discussionId, updateData, image, accessToken) => {
    try {
        const formData = new FormData();

        // Add discussion update data to form
        if (updateData.title) formData.append('title', updateData.title);
        if (updateData.content) formData.append('content', updateData.content);
        if (updateData.tags) formData.append('tags', updateData.tags);

        // Add image if it exists
        if (image) {
            formData.append('image', image);
        }

        const response = await axios.put(
            `${API_BASE_URL}/discussions/${discussionId}`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error(`Error updating discussion ${discussionId}:`, error);
        throw error;
    }
};
// hooks/Profile/useStudentPictures.js
import { useState, useEffect } from "react";
import CONFIG from "../../config";


// Service for fetching student picture
const studentProfileService = {
    // Fetch student profile picture
    async getPictures(accessToken) {
        if (!accessToken) {
            throw new Error("Failed to authenticate");
        }

        const response = await fetch(CONFIG.STUDENT_PICTURE_ENDPOINT, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error encountered while fetching student picture");
        }

        try {
            const data = await response.json();
            return data; // Assuming `data` contains the `profpic` URL for the profile picture
        } catch (error) {
            console.warn(error);
            throw new Error("Error encountered parsing picture response");
        }
    },
};

// Custom hook to fetch student picture
const useStudentPictures = (accessToken) => {
    const [pictures, setPictures] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!accessToken) return; // Only fetch if accessToken exists

        setLoading(true); // Set loading state
        setError(null);    // Reset error state

        const fetchPictures = async () => {
            try {
                // Call the service function to fetch the picture
                const data = await studentProfileService.getPictures(accessToken);
                setPictures(data); // Store the picture in state
            } catch (err) {
                setError("Failed to fetch student picture"); // Set error state if fetch fails
            } finally {
                setLoading(false); // Turn off loading state once done
            }
        };

        fetchPictures(); // Fetch the picture when the token is available
    }, [accessToken]); // Re-run only when accessToken changes

    return { pictures, loading, error }; // Return the pictures, loading, and error states
};

export default useStudentPictures;

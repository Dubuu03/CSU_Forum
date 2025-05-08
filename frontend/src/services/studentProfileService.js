// services/studentProfileService.js

const STUDENT_PROFILE_ENDPOINT = "https://takay.csucarig.edu.ph/guid/profile";
const STUDENT_PICTURE_ENDPOINT = "https://takay.csucarig.edu.ph/guid/getStudentPic";
const STUDENT_COLLEGE_ENDPOINT = "https://takay.csucarig.edu.ph/checkusercollege";

// Service for fetching student pictures
const studentProfileService = {
    // Fetch student profile details
    async getProfile(accessToken) {
        if (!accessToken) {
            throw new Error("Failed to authenticate");
        }

        const response = await fetch(STUDENT_PROFILE_ENDPOINT, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error encountered while fetching student profile");
        }

        try {
            const data = await response.json();
            return data; // Assuming `data` contains the student profile information
        } catch (error) {
            console.warn(error);
            throw new Error("Error encountered parsing student profile response");
        }
    },

    // Fetch student profile picture
    async getPictures(accessToken) {
        if (!accessToken) {
            throw new Error("Failed to authenticate");
        }

        const response = await fetch(STUDENT_PICTURE_ENDPOINT, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error encountered while fetching student pictures");
        }

        try {
            const data = await response.json();
            return data; // Assuming `data` contains the `profpic` URL for the profile picture
        } catch (error) {
            console.warn(error);
            throw new Error("Error encountered parsing pictures response");
        }
    },

    // Fetch student college details
    async getCollege(accessToken) {
        if (!accessToken) {
            throw new Error("Failed to authenticate");
        }

        const response = await fetch(STUDENT_COLLEGE_ENDPOINT, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error encountered while fetching student college");
        }

        try {
            const data = await response.json();
            return data; // Assuming `data` contains college details
        } catch (error) {
            console.warn(error);
            throw new Error("Error encountered parsing college response");
        }
    },
};

export default studentProfileService;

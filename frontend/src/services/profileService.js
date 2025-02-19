const STUDENT_PROFILE_ENDPOINT = "https://takay.csucarig.edu.ph/guid/profile";
const STUDENT_COLLEGE_ENDPOINT = "https://takay.csucarig.edu.ph/checkusercollege";
const STUDENT_COURSE_ENDPOINT = "https://takay.csucarig.edu.ph/checkusercourse";

export class StudentProfileError extends Error {
    constructor(message) {
        super(message);
        this.name = "StudentProfileError";
    }
}

export const COLLEGES = new Map([
    ["coea", { label: "College of Engineering and Architecture", color: "#ba0d0d" }],
    ["cics", { label: "College of Information and Computing Sciences", color: "#ba660d" }],
    ["cit", { label: "College of Industrial Technology", color: "#38ba0d" }],
    ["cnsm", { label: "College of Natural Sciences and Mathematics", color: "#0d55ba" }],
    ["chass", { label: "College of Humanities and Social Sciences", color: "#8f8f00" }],
    ["cvm", { label: "College of Veterinary Medicine", color: "#5b0dba" }],
    ["com", { label: "College of Medicine", color: "#0dba30" }],
    ["cpad", { label: "College of Public Administration", color: "#ba0d41" }],
    ["chk", { label: "College of Human Kinetics", color: "#1b0dba" }],
]);

const profileService = {
    /**
     * Fetches basic student profile information.
     * @param {string} accessToken - The authentication token.
     * @returns {Promise<Object>} - Student profile with selected fields.
     * @throws {StudentProfileError} - If request fails.
     */
    async getBasicProfile(accessToken) {
        if (!accessToken) {
            throw new StudentProfileError("No access token provided");
        }

        try {
            const [profileRes, collegeRes] = await Promise.all([
                fetch(STUDENT_PROFILE_ENDPOINT, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
                fetch(STUDENT_COLLEGE_ENDPOINT, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
            ]);

            if (!profileRes.ok) {
                throw new StudentProfileError("Failed to fetch student profile");
            }

            if (!collegeRes.ok) {
                throw new StudentProfileError("Failed to fetch student college");
            }

            const profileData = await profileRes.json();
            const collegeData = await collegeRes.json();

            if (!profileData.length) {
                throw new StudentProfileError("Student profile data is empty");
            }

            const { IDNumber, LastName, FirstName, MiddleName } = profileData[0];

            let College = "Unknown";
            let CollegeColor = "#3c3c3c";

            if (collegeData.length > 0) {
                const collegeKey = collegeData[0].toLowerCase();
                const collegeInfo = COLLEGES.get(collegeKey);
                if (collegeInfo) {
                    College = collegeInfo.label;
                    CollegeColor = collegeInfo.color;
                } else {
                    College = collegeData[0].toUpperCase();
                }
            }

            return { IDNumber, LastName, FirstName, MiddleName, College, CollegeColor };
        } catch (error) {
            console.error(error);
            throw new StudentProfileError("Error encountered while fetching student profile");
        }
    },


    /**
     * Fetches the student's course information.
     * @param {string} accessToken - The authentication token.
     * @returns {Promise<string>} - Course name.
     * @throws {StudentProfileError} - If request fails.
     */
    async getCourse(accessToken) {
        if (!accessToken) throw new StudentProfileError("No access token provided");

        try {
            const res = await fetch(STUDENT_COURSE_ENDPOINT, {
                method: "GET",
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!res.ok) {
                throw new StudentProfileError("Failed to fetch student course");
            }

            // Handle response as text since it may not be valid JSON
            const courseText = await res.text();

            // Ensure a valid course name is returned
            return courseText.trim() || "Unknown Course";
        } catch (error) {
            console.error(error);
            throw new StudentProfileError("Error encountered while fetching student course");
        }
    },

};

export default profileService;

import { useEffect, useState } from "react";
import CONFIG from "../../config";
const useStudentCourse = (accessToken) => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                if (!accessToken) throw new Error("No access token provided");

                const res = await fetch(CONFIG.STUDENT_COURSE_ENDPOINT, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (!res.ok) throw new Error("Failed to fetch student course");

                const courseText = await res.text();
                setCourse(courseText.trim() || "Unknown Course");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [accessToken]);

    return { course, loading, error };
};

export default useStudentCourse;

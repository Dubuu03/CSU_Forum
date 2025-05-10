import { useEffect, useState } from "react";
import CONFIG from "../../config";

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

export const getCollegeShortcut = (label) => {
    for (const [key, value] of COLLEGES.entries()) {
        if (value.label === label) {
            return key.toUpperCase();
        }
    }
    return "DEPT";
};

const useStudentCollege = (accessToken) => {
    const [college, setCollege] = useState({ label: "Unknown College", color: "#3c3c3c" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCollege = async () => {
            try {
                if (!accessToken) throw new Error("No access token provided");

                const res = await fetch(CONFIG.STUDENT_COLLEGE_ENDPOINT, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch student college");

                const collegeData = await res.json();
                const collegeKey = collegeData[0]?.toLowerCase();

                const collegeInfo = COLLEGES.get(collegeKey) || {
                    label: collegeKey?.toUpperCase() || "Unknown College",
                    color: "#3c3c3c",
                };

                setCollege(collegeInfo);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCollege();
    }, [accessToken]);

    return { college, loading, error };
};

export default useStudentCollege;

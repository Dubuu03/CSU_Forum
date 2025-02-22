import { useEffect, useState } from "react";
import CONFIG from "../../config";

const useStudentProfile = (accessToken) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!accessToken) throw new Error("No access token provided");

                const res = await fetch(CONFIG.STUDENT_PROFILE_ENDPOINT, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch student profile");

                const profileData = await res.json();

                if (!profileData.length) throw new Error("Student profile data is empty");

                const { IDNumber, LastName, FirstName, MiddleName } = profileData[0];

                setProfile({
                    IDNumber,
                    LastName,
                    FirstName,
                    MiddleName: MiddleName || "N/A",
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [accessToken]);

    return { profile, loading, error };
};

export default useStudentProfile;

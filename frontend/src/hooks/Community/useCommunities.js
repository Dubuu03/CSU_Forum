import { useState, useEffect } from "react";
import { fetchUnjoinedCommunities, fetchUserCommunities, joinCommunity, leaveCommunity } from "../../services/communityService";

const useCommunities = (accessToken, studentId) => {
    const [unjoinedCommunities, setUnjoinedCommunities] = useState([]);
    const [userCommunities, setUserCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [joiningStates, setJoiningStates] = useState({});
    const [leavingStates, setLeavingStates] = useState({});

    useEffect(() => {
        if (!studentId) return;
        loadCommunities();
    }, [studentId]);

    const loadCommunities = async () => {
        if (!studentId) return;
        setLoading(true);
        try {
            const unjoinedData = await fetchUnjoinedCommunities(studentId);
            const userData = await fetchUserCommunities(studentId);
            setUnjoinedCommunities(unjoinedData);
            setUserCommunities(userData);
        } catch (err) {
            setError("Failed to fetch communities. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinCommunity = async (communityId) => {
        if (!studentId) return;

        setJoiningStates(prev => ({ ...prev, [communityId]: true }));
        setError(null);

        try {
            await joinCommunity(accessToken, studentId, communityId);
            await loadCommunities();
        } catch (err) {
            setError(`Failed to join community. ${err.message || 'Please try again.'}`);
        } finally {
            setJoiningStates(prev => ({ ...prev, [communityId]: false }));
        }
    };

    const handleLeaveCommunity = async (communityId, creatorId) => {
        if (!studentId) return;

        if (studentId === creatorId) {
            setError("You cannot leave a community you own.");
            return;
        }

        setLeavingStates(prev => ({ ...prev, [communityId]: true }));
        setError(null);

        try {
            await leaveCommunity(accessToken, studentId, communityId);
            await loadCommunities();
        } catch (err) {
            setError(`Failed to leave community. ${err.message || 'Please try again.'}`);
        } finally {
            setLeavingStates(prev => ({ ...prev, [communityId]: false }));
        }
    };

    return {
        unjoinedCommunities,
        userCommunities,
        loading,
        error,
        joiningStates,
        leavingStates,
        handleJoinCommunity,
        handleLeaveCommunity
    };
};

export default useCommunities;

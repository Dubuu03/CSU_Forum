const Community = require("../models/Community");

// Create a new community (requires admin approval)
exports.createCommunity = async (req, res) => {
    try {
        const { name, description, image, creatorId, creatorName, tags } = req.body;

        const newCommunity = new Community({
            name,
            description,
            image,
            creatorId,
            creatorName,
            tags,
            memberIds: [creatorId] // Automatically add creator as a member
        });

        await newCommunity.save();
        res.status(201).json({ message: "Community created, awaiting admin approval.", community: newCommunity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all approved communities
exports.getCommunities = async (req, res) => {
    try {
        const communities = await Community.find({ isApproved: true });
        res.json(communities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all pending communities (Admin Only)
exports.getPendingCommunities = async (req, res) => {
    try {
        const pendingCommunities = await Community.find({ isApproved: false });
        res.json(pendingCommunities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single community by ID
exports.getCommunityById = async (req, res) => {
    try {
        const { id } = req.params;
        const community = await Community.findById(id).populate("discussions");
        if (!community) return res.status(404).json({ error: "Community not found" });

        res.json(community);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve a community (Admin Only)
exports.approveCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        const community = await Community.findById(id);
        if (!community) return res.status(404).json({ error: "Community not found" });

        community.isApproved = true;
        await community.save();

        res.json({ message: "Community approved successfully", community });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a community
exports.deleteCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        await Community.findByIdAndDelete(id);
        res.json({ message: "Community deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all communities a student is a member of
exports.getUserCommunities = async (req, res) => {
    const { studentId } = req.params;

    try {
        const communities = await Community.find({
            memberIds: studentId,
            isApproved: true // Only fetch approved communities
        });
        res.json(communities);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user communities" });
    }
};

// Get all approved communities the user is NOT a member of
exports.getUnjoinedCommunities = async (req, res) => {
    const { studentId } = req.params;

    try {
        const stringStudentId = String(studentId);

        const communities = await Community.find({
            isApproved: true,
            memberIds: { $ne: stringStudentId }
        }).exec();

        const filtered = communities.filter(
            community => !community.memberIds.includes(stringStudentId)
        );

        
        const formatted = filtered.map(c => ({
            _id: c._id, 
            name: c.name,
            description: c.description,
            image: c.image,
            tags: c.tags,
            members: c.memberIds.length,
            memberIds: c.memberIds,
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            error: "Error fetching unjoined communities",
            details: error.message,
        });
    }
};



// Join a community
exports.joinCommunity = async (req, res) => {
    const { communityId, studentId } = req.body;

    try {
        console.log("Join request received for:", { communityId, studentId });

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ error: "Community not found" });
        }

        // Ensure `memberIds` is initialized
        if (!community.memberIds) {
            community.memberIds = [];
        }

        // Check if the user is already a member
        if (community.memberIds.includes(studentId)) {
            return res.status(400).json({ error: "User is already a member of this community" });
        }

        // Add studentId to memberIds
        community.memberIds.push(studentId);
        await community.save();

        console.log("User joined successfully:", { communityId, studentId });

        res.json({ message: "Successfully joined the community", community });
    } catch (error) {
        console.error("Error joining community:", error);
        res.status(500).json({ error: error.message || "Error joining community" });
    }
};

// Leave or Unfollow a Community
exports.leaveCommunity = async (req, res) => {
    const { communityId, studentId } = req.body;

    try {
        console.log("Leave request received for:", { communityId, studentId });

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ error: "Community not found" });
        }

        // Check if the user is the owner
        if (community.creatorId.toString() === studentId) {
            return res.status(403).json({ error: "Community owners cannot leave their own community." });
        }

        // Check if the user is a member of the community
        if (!community.memberIds.includes(studentId)) {
            return res.status(400).json({ error: "User is not a member of this community" });
        }

        // Remove studentId from memberIds array
        community.memberIds = community.memberIds.filter(id => id !== studentId);
        await community.save();

        console.log("User left the community successfully:", { communityId, studentId });

        res.json({ message: "Successfully left the community", community });
    } catch (error) {
        console.error("Error leaving community:", error);
        res.status(500).json({ error: error.message || "Error leaving community" });
    }
};


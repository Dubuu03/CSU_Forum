const Community = require("../models/Community");

// Create a new community (requires admin approval)
exports.createCommunity = async (req, res) => {
    try {
        const { name, description, creatorId, creatorName, tags } = req.body;

        const newCommunity = new Community({
            name,
            description,
            creatorId,
            creatorName,
            tags
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


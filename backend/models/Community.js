const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    creatorId: { type: String, required: true },
    creatorName: { type: String, required: true },
    image: { type: String }, 
    tags: [{ type: String }], 
    memberIds: { type: [String], default: [] },
    discussions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discussion" }],
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Middleware to ensure the creator is added as the first member
communitySchema.pre("save", function (next) {
    if (!this.memberIds.includes(this.creatorId)) {
        this.memberIds.push(this.creatorId); // Add creator to members list
    }
    next();
});

const Community = mongoose.model("Community", communitySchema);
module.exports = Community;

const discussionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    community: { type: mongoose.Schema.Types.ObjectId, ref: "Community", required: true },
    tags: [{ type: String }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Discussion = mongoose.model("Discussion", discussionSchema);
module.exports = Discussion;

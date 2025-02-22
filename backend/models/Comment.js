const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Discussion" }, 
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    accessLevel: {
        type: String,
        enum: ["admin", "superadmin"],
        default: "admin"
    },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);

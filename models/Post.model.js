module.exports = model("User", userSchema);


const { Schema, model } = require("mongoose");

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: 5
        },
        content: {
            type: String,
            required: true,
            minLength: 5
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        replies: [{
            type: Schema.Types.ObjectId,
            ref: "Post"
        }],
        downvotes: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        upvotes: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        img: String,
        threadStarter: Boolean

    },

    {
        timestamps: true,
    }
);

module.exports = model("Post", postSchema);

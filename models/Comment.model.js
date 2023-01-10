const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
            minLength: 5
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }],
        originalPost: {
            type: Schema.Types.ObjectId,
            ref: "Post"
        },
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        subreddit: {
            type: Schema.Types.ObjectId,
            ref: "Subreddit"
        },


        votes: {
            type: Number,
            default: 0
        }

    },

    {
        timestamps: true,
    }
);

module.exports = model("Comment", commentSchema);
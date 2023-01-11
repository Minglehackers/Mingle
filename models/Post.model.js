const { Schema, model } = require("mongoose");

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: 5
        },
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
        upvotes: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        downvotes: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],


        img: String,

        subreddit: {
            type: Schema.Types.ObjectId,
            ref: "Subreddit"
        }

    },

    {
        timestamps: true,
    }
);

module.exports = model("Post", postSchema);

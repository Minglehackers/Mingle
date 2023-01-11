const { Schema, model } = require("mongoose");

const subredditSchema = new Schema(
    {

        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLength: 3
        },
        description: {
            type: String,
            required: true,
            minLength: 8
        },
        topics: [{
            type: Schema.Types.ObjectId,
            ref: "Post"
        }],
        moderator: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        img: String
    },
    {
        timestamps: true,
    }
);

const Subreddit = model("Subreddit", subredditSchema);

module.exports = Subreddit;


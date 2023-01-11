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
        img: { 
            type: String,
            default: 'https://res.cloudinary.com/dm6a8aocc/image/upload/v1673448897/mingle/jc1iz6vviqidjss3d8yf.jpg'
        }
    },
    {
        timestamps: true,
    }
);

const Subreddit = model("Subreddit", subredditSchema);

module.exports = Subreddit;


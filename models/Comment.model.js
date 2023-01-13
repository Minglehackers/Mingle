const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      minLength: 5,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isCommentAuthor: {
      type: Boolean,
      default: true
    },
    originalPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    subreddit: {
      type: Schema.Types.ObjectId,
      ref: "Subreddit",
    },
    votes: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = model("Comment", commentSchema);

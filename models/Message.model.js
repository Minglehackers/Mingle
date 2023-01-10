const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
    text: {
        type: String,
        required: true,
        minLength: 5,
    },
    with: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    sentBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    read: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model("Message", messageSchema);


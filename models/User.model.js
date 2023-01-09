const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    isModerator: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3
    },
    password: {
      type: String,
      required: true,
      minLength: 8
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      maxLength: 20,
      default: "First Name"
    },
    lastName: {
      type: String,
      maxLength: 20,
      default: "Last Name"
    },
    profilePicture: {
      type: String,
      default: 'https://cdn.dribbble.com/users/6142/screenshots/5679189/media/1b96ad1f07feee81fa83c877a1e350ce.png?compress=1&resize=1200x900&vertical=top'
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post"
      }
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  {
    timestamps: true,
  }
);


const User = model("User", userSchema);

module.exports = User;



// const userSchema = new Schema(
//   {
//     username: {
//       type: String,
//       required: false,
//       unique: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     // this second object adds extra properties: `createdAt` and `updatedAt`
//     timestamps: true,
//   }
// );

// const User = model("User", userSchema);

// module.exports = User;

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
      maxLength: 30,
      default: "First Name"
    },
    lastName: {
      type: String,
      maxLength: 30,
      default: "Last Name"
    },
    profilePicture: {
      type: String,
      default: '../public/images/default-profile-picture.png'
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

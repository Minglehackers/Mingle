const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const fileUploader = require('../config/cloudinary.config');

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isSamePerson = require("../middleware/isSamePerson");
const youShallNotPass = require("../middleware/youShallNotPass");

// Controller  
const inboxController = require("./controllers/inboxController");
const Message = require("../models/Message.model");




// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", isLoggedOut, (req, res) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });

    return;
  }

  if (password.length < 6) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });

    return;
  }

  //   ! This regular expression checks password for special characters and minimum length
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter."
      });
    return;
  }

  // Create a new user - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      return User.create({ username, email, password: hashedPassword });
    })
    .then((user) => {
      res.redirect(`/auth/profile/${user._id}`);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
});

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });

    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;

          res.redirect("/");
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

// *** USER PROFILE ***
// GET USER PROFILE : /auth/userProfile/:id
router.get("/profile/:id", isLoggedIn, isSamePerson, (req, res) => {
  console.log(res.locals)
  let postArr;
  let commentArr;

  const id = req.params.id
  Comment.find({
    author: id
  })
    .then((commentdetails) => {
      commentArr = commentdetails;
      //console.log("the comments for this user -------->"+commentArr);
      return Post.find({
        author: id
      })
    })
    .then((postdetails) => {
      postArr = postdetails;
      // console.log("the posts for this user -------->"+postArr);
      return User.findByIdAndUpdate(id)
    })

    .then((userInSession) => {
      const data = {
        userInSession: userInSession,
        postArr: postArr,
        commentArr: commentArr,
      }
      res.render("users/user-profile", data);
    })
    .catch(error => {
      console.log(`Error while loading the user profile: ${error}`)
      next();
    })

});

// *** EDIT USER PROFILE ***
// GET EDIT USER PROFILE : /auth/profile/:id/edit
router.get("/profile/:id/edit", isLoggedIn, youShallNotPass, (req, res) => {
  const id = req.params.id

  User.findById(id)
    .then((userInSession) => {
      res.render("users/user-edit", { userInSession });
    })
    .catch(error => {
      console.log(`Error updating user: ${error}`)
      next();
    })
});

// POST EDIT USER PROFILE : /auth/profile/:id/edit
router.post("/profile/:id/edit", isLoggedIn, fileUploader.single('profile-picture-image'), (req, res) => {
  const id = req.params.id;

  let { firstName, lastName, existingImage, isAdmin, aboutMe } = req.body;

  if (isAdmin === "on") {
    isAdmin = true
  } else {
    isAdmin = false
  }

  let profilePicture;
  if (req.file) {
    profilePicture = req.file.path;
  } else {
    profilePicture = existingImage;
  }

  User.findByIdAndUpdate(id, { firstName, lastName, profilePicture, isAdmin, aboutMe }, { new: true })
    .select("-password")
    .then((newDetails) => {
      req.session.currentUser = newDetails
      res.redirect(`/auth/profile/${id}`)
    })
    .catch(error => {
      res.redirect("/")
      console.log(`Error updating user profile: ${error}`)
      next();
    })

});

// *** DELETE USER ***
// GET DELETE : /auth/profile/:id/delete
router.get("/profile/:id/delete", isLoggedIn, (req, res) => {
  const id = req.params.id

  User.findById(id)
    .then((userInSession) => {
      res.render("users/user-delete", { userInSession });
    })
    .catch(error => {
      console.log(`Error updating user: ${error}`)
      next();
    })
});

// POST DELETE : /auth/delete
router.post('/profile/:id/delete', isLoggedIn, (req, res, next) => {
  const id = req.params.id

  User.findById(id)
    .then((userInSession) => {
      if (req.body.userDeletion === userInSession.username) {
        User.findByIdAndDelete(id)
          .then((userDetails) => {
            console.log(userDetails)
            res.redirect('/auth/logout')
          })
          .catch((error) => {
            console.log(`Error deleting user: ${error}`)
            next();
          })
      } else {
        res.render('/profile/:id')
      }
    })


});


// ? INBOX





router.get('/inbox', youShallNotPass, inboxController.displayInbox);
router.get('/inbox/:id', youShallNotPass, inboxController.displayConversation);

router.post('/inbox/:id', youShallNotPass, inboxController.sendMessage);


module.exports = router;
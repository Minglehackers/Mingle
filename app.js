// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

var passport = require('passport');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "mingle";

app.locals.appTitle = `${capitalize(projectName)}`;

app.use((req, res, next) => {
    app.locals.userDetails = req.session.currentUser; //store user details in app.locals (so that is is available in handlebars)
    next();
});


module.exports = (req, res, next) => {

    if (req.session.currentUser._id !== req.params.id) {
        return res.redirect("/");
    }
    next();
};


app.use(passport.initialize());
app.use(passport.session());

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

// TODO: Routes
const subredditRoutes = require("./routes/subreddit.routes");
//app.use('/', require('./routes/index'));
app.use('/subreddit', subredditRoutes);
//app.use('/user', require('./routes/user.routes'));

app.use("/inbox", require("./routes/inbox.routes"));

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

/* Added handlebar helper to equate in views using handlebars */

hbs.handlebars.registerHelper('equal', function (lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if (lvalue != rvalue) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

hbs.handlebars.registerHelper('publishedAgo', function (date) {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now - postDate;
    const diffInSeconds = diff / 1000;
    const diffInMinutes = diff / 1000 / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
    const diffInWeeks = diffInDays / 7;
    const diffInMonths = diffInDays / 30;
    const diffInYears = diffInDays / 365;


    if (diffInMinutes < 1) {
        return `${Math.floor(diffInSeconds)} second${Math.floor(diffInSeconds) > 1 ? "s" : ""} ago`
    }
    if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)} minute${Math.floor(diffInMinutes) > 1 ? "s" : ""} ago`;
    }
    if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) > 1 ? "s" : ""} ago`;
    }
    if (diffInDays < 7) {
        return `${Math.floor(diffInDays)} day${Math.floor(diffInDays) > 1 ? "s" : ""} ago`;
    }
    if (diffInWeeks < 4) {
        return `${Math.floor(diffInWeeks)} week${Math.floor(diffInWeeks) > 1 ? "s" : ""} ago`;
    }
    if (diffInMonths < 12) {
        return `${Math.floor(diffInMonths)} month${Math.floor(diffInMonths) > 1 ? "s" : ""} ago`;
    }
    return `${Math.floor(diffInYears)} year${Math.floor(diffInYears) > 1 ? "s" : ""} ago`;

});

hbs.handlebars.registerHelper('formatDate', function (date) {
    const postDate = new Date(date);
    return postDate.toLocaleString().slice(0, -10);
});

hbs.handlebars.registerHelper('countVotes', function (up, down) {
    return up - down;
});

hbs.handlebars.registerHelper('checkVote', function (upvotes, user, color) {
    if (user) {
        if (upvotes.includes(user._id)) {
            return color;
        }
        // if (downvotes.includes(user._id)) {
        //     return 'orange';
        // }
        return "black"
    }
    return '';
});


hbs.handlebars.registerHelper("linkFix", function (link) {

    return link.slice(0, 4) === "http" ? link : "http://" + link;
});



hbs.handlebars.registerHelper('stringify', function (object) {
    return JSON.stringify(object);
});



hbs.handlebars.registerHelper('checkUserExists', function (user, id) {
    if (user) {
        if (user._id == "63c0da3a67554c58ce13a469") {
            return "deleted account";
        } else {
            return user.username;
        }
    }
    return "deleted account";
});


const postRoutes = require("./routes/post.routes");
app.use("/post", postRoutes);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

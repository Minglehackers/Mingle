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

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

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



const postRoutes = require("./routes/post.routes");
app.use("/post", postRoutes);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

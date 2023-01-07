// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "mingle";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

app.use( (req, res, next) => {
    res.locals.userImage = req.body
    app.locals.userDetails = req.session.currentUser; //store user details in app.locals (so that is is available in handlebars)
    next();
});

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

// TODO: Routes
//app.use('/', require('./routes/index'));
//app.use('/subreddit', require('./routes/subreddit.routes'));
//app.use('/user', require('./routes/user.routes'));



const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);






// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

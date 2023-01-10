module.exports = (req, res, next) => {
    if (req.session.currentUser._id !== req.params.id) {
        res.locals.samePerson = false
        return res.redirect("/");
    } else {
        res.locals.samePerson = true
        next();
       
    }
  };

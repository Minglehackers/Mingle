const checkIfSamePerson = (req, res, input) => {

    if (`${req.session.currentUser._id}` !== input) {
        res.locals.samePerson = false;

    } else {
        res.locals.samePerson = true;

    }


}

module.exports = checkIfSamePerson;


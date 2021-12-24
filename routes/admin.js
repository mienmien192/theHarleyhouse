const express = require('express')
const router = express.Router()

const passport = require("passport");

function checkAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === "Admin") {
        req.flash("success", "Login successfully");
        return next();
    }
    req.flash("error", "Account doesn't have permission");
    res.redirect('/admin/login');
}
router.get('/', checkAdmin, async(req, res) => {

    res.render("admin/home");

})
router.get("/login", (req, res) => {
    res.render("admin/login");
});
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/admin",
        failureRedirect: "/admin/login",
        failureFlash: true,
    })
);


module.exports = router
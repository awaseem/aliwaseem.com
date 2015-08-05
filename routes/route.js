/**
 * Created by awaseem on 15-08-03.
 */

var isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = function(app, passport) {
    app.get("/", function (req, res) {
        res.render("home");
    });

    app.get("/item", function (req, res) {
        res.sendFile(htmlDir + "item.html");
    });

    app.get("/login", function (req, res) {
        res.render("login", {
            messages: req.flash("loginMessage")
        });
    });

    app.post("/login", passport.authenticate("local-login", {
        successRedirect: "/admin",
        failureRedirect: "/login",
        failureFlash: true
    }));

    app.get("/admin", isLoggedIn, function (req, res) {
        res.render("admin");
    });

    app.get("/admin/add", isLoggedIn, function (req, res) {
       res.render("addItem");
    });

    app.post("/admin/add", isLoggedIn, function (req, res) {
       res.redirect("/admin");
    })
};
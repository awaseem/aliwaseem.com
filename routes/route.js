/**
 * Created by awaseem on 15-08-03.
 */

var item = require("../models/item");
var about = require("../models/about");

var isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = function(app, passport) {
    app.get("/", function (req, res, next) {
        item.find(function (err, results) {
            if (err) {
                return next(err);
            }
            res.render("home", {
                items: results
            });
        });
    });

    app.get("/item/:id", function (req, res, next) {
        item.findOne({ _id: req.params.id }, function (err, results) {
            if (err) {
                return next(err);
            }
            res.render("item", results);
        });
    });

    app.get("/about", function (req, res, next) {
        about.findOne(function (err, results) {
            if (err) {
                return next(err);
            }
            res.render("about", results)
        });
    });

    app.get("/login", function (req, res) {
        res.render("login", {
            layout: "blank",
            messages: req.flash("loginMessage")
        });
    });

    app.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/login");
    });

    app.post("/login", passport.authenticate("local-login", {
        successRedirect: "/admin",
        failureRedirect: "/login",
        failureFlash: true
    }));

    app.get("/admin", isLoggedIn, function (req, res) {
        item.find(function (error, results) {
            var context = {};

            if (error) {
                context.error = true;
            }
            else {
                context.items = results
            }
            context.layout = "blank";
            context.adminInfo = req.flash("adminInfo");
            res.render("admin", context);
        });
    });

    app.get("/admin/about/edit", isLoggedIn, function (req, res, next) {
        about.findOne(function (err, results) {
            if (err) {
                return next(err);
            }
            if (!results) {
                var newAbout = new about();
                newAbout.body = "";
                newAbout.save(function (err, about) {
                    if (err) {
                        return next(err);
                    }
                    about.layout = "blank";
                    res.render("aboutEdit", about);
                });
            }
            else {
                results.layout = "blank";
                res.render("aboutEdit", results);
            }
        });
    });

    app.post("/admin/about/edit", isLoggedIn, function (req, res) {
        about.findOneAndUpdate({}, { body: req.body.body.replace(/(?:\r\n|\r|\n)/g, '<br />') }, {}, function (err) {
            if (err) {
                req.flash("adminInfo", "Error could not add item to the database");
            }
            else {
                req.flash("adminInfo", "Updated about section!");
            }
            res.redirect("/admin");
        });
    });

    app.get("/admin/add", isLoggedIn, function (req, res) {
        res.render("addItem", { layout: "blank" });
    });

    app.post("/admin/add", isLoggedIn, function (req, res) {
        var newItem = new item();

        newItem.headingImage = req.body.headingImage;
        newItem.heading = req.body.heading;
        newItem.body = req.body.body.replace(/(?:\r\n|\r|\n)/g, '<br />');
        newItem.image = req.body.image;
        newItem.website = req.body.website;
        newItem.git = req.body.git;

        newItem.save(function (err) {
            if (err) {
                req.flash("adminInfo", "Error could not add item to the database");
            }
            else {
                req.flash("adminInfo", "Successfully added item!")
            }
            res.redirect("/admin");
        });
    });

    app.get("/admin/edit/:id", isLoggedIn, function (req, res, next) {
        item.findOne({ _id: req.params.id }, function (err, results) {
            if (err) {
                return next(err);
            }
            results.layout = "blank";
            res.render("editItem", results);
        });
    });

    app.post("/admin/edit/:id", isLoggedIn, function (req, res) {
        item.update({ _id: req.params.id }, {
            $set: {
                headingImage: req.body.headingImage,
                heading: req.body.heading,
                body: req.body.body.replace(/(?:\r\n|\r|\n)/g, '<br />'),
                image: req.body.image,
                website: req.body.website,
                git: req.body.git
            }
        }, function (error) {
            if (error) {
                req.flash("adminInfo", "Error could not edit item into database");
            }
            else {
                req.flash("adminInfo", "Successfully edited: " + req.body.heading);
            }
            res.redirect("/admin");
        });
    });

    app.get("/admin/delete/:id", isLoggedIn, function (req, res, next) {
        item.findOne({ _id: req.params.id }, function (err, results) {
            if (err) {
                return next(err);
            }
            results.layout = "blank";
            res.render("deleteItem", results);
        });
    });

    app.post("/admin/delete/:id", isLoggedIn, function (req, res) {
        if (req.body.dropdown == "1") {
            item.findByIdAndRemove(req.params.id, function (error) {
                if (error) {
                    req.flash("adminInfo", "Error failed to remove item from database")
                }
                else {
                    req.flash("adminInfo", "Removed item!")
                }
                res.redirect("/admin");
            })
        }
        else {
            res.redirect("/admin");
        }
    });
};
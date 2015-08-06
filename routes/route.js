/**
 * Created by awaseem on 15-08-03.
 */

var item = require("../models/item");

var isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = function(app, passport) {
    app.get("/", function (req, res) {
        item.find(function (error, results) {

            if (error) {
                res.render("error");
                console.log(error);
            }

            res.render("home", {
                items: results
            });
        });
    });

    app.get("/item", function (req, res) {
        res.render("item");
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
        item.find(function (error, results) {
            var context = {};

            if (error) {
                context.error = true;
                console.log(error);
            }
            else {
                context.items = results
            }

            context.addItemInfo = req.flash("addItemInfo");
            res.render("admin", context);
        });
    });

    app.get("/admin/add", isLoggedIn, function (req, res) {
        res.render("addItem");
    });

    app.post("/admin/add", isLoggedIn, function (req, res) {
        var newItem = new item();

        newItem.headingImage = req.body.headingImage;
        newItem.heading = req.body.heading;
        newItem.body = req.body.body;
        newItem.image = req.body.image;
        newItem.website = req.body.website;
        newItem.git = req.body.git;

        newItem.save(function (err) {
            if (err) {
                req.flash("addItemInfo", "Error could not add item to the database");
                console.log(err);
            }
            else {
                req.flash("addItemInfo", "Successfully added item!")
            }
            res.redirect("/admin");
        });
    });

    app.get("/admin/edit/:id", isLoggedIn, function (req, res) {
        item.findOne({ _id: req.params.id }, function (error, results) {
            if (error) {
                res.render("error");
            }
            res.render("editItem", results);
        });
    });

    app.post("/admin/edit/:id", isLoggedIn, function (req, res) {
        item.update({ _id: req.params.id }, {
            $set: {
                headingImage: req.body.headingImage,
                heading: req.body.heading,
                body: req.body.body,
                image: req.body.image,
                website: req.body.website,
                git: req.body.git
            }
        }, function (error) {
            if (error) {
                console.log(error);
                req.flash("addItemInfo", "Error could not edit item into database");
            }
            else {
                req.flash("addItemInfo", "Successfully edited: " + req.body.heading);
            }
            res.redirect("/admin");
        });
    });

    app.get("/admin/delete/:id", isLoggedIn, function (req, res) {
        item.findOne({ _id: req.params.id }, function (error, results) {
            if (error) {
                res.render("error");
            }
            res.render("deleteItem", results);
        });
    });

    app.post("/admin/delete/:id", isLoggedIn, function (req, res) {
        if (req.body.dropdown == "1") {
            item.findByIdAndRemove(req.params.id, function (error) {
                if (error) {
                    req.flash("addItemInfo", "Error failed to remove item from database")
                }
                else {
                    req.flash("addItemInfo", "Removed item!")
                }
                res.redirect("/admin");
            })
        }
        else {
            res.redirect("/admin");
        }
    });
};
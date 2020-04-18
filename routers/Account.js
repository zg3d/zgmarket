const express = require('express')
const router = express.Router();
const User = require("../models/Users");
const isLoggedIn = require("../middleware/auth");
const admin= require("../middleware/author");
const path = require('path');


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 13;

const validator = require("email-validator");
const commonPasswordList = require('fxa-common-password-list');
//const isAuthenticated = require("../middleware/auth");
//const dashBoardLoader = require("../middleware/authorization");

//Route to direct use to Registration form

router.get("/login", (req, res) => {
    res.render("login", {

    });
});
router.post("/login", async (req, res) => {

    const errors = [];
    try {
        const user = await User.findOne({ Email: req.body.email });

        if (user == null) {
            errors.push("Sorry, your email and/or password incorrect");
            res.render("login", {
                errors
            })

        }
    

        const match = await new Promise((resolve, reject) => {
            bcrypt.compare(req.body.password, user.Password, function (err, result) {
                // result == true
                if (err) reject(err);
                resolve(result);
            });
        });
      

        // result == true
        if (match) {
            console.log("success")
            req.session.userInfo = user;
            res.redirect("/");
        }

        else {
            errors.push("Sorry, your email and/or password incorrect ");
            res.render("login", {
                errors
            })
        }
        
    }
    catch (err) {
        console.log(err);
    }








});
router.get("/sign-up", (req, res) => {
    res.render("register", {

    });
});
router.post("/sign-up", async (req, res) => {
    const errors = { password: [], email: [] };
    const emailUser = {};
    const newUser =
    {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
    }
    let colors = {};
    let msg = {};
    if (/^[a-zA-Z]{3,}/.test(newUser.firstName) != true) {
        errors.firstName = "Please enter a valid First Name.";
        colors.firstName = 'red';
    }

    if (/^[a-zA-Z]{2,}/.test(newUser.lastName) != true) {
        errors.lastName = "Please enter a valid Last Name.";
        colors.lastName = 'red';
    }

    if (validator.validate(newUser.email) != true) {
        errors.email.push("Enter a valid email address");
        colors.email = 'red';
    }
    try {
        
        const user = await User.findOne({Email:(newUser.email.toLowerCase())});
        

        if (user.Email === newUser.email.toLowerCase()) {
            errors.email.push("You already have an account");
            colors.email = 'red';
        }
    } catch (err) {
        console.log(err);
    }

    if (errors.email.length == 0) {
        msg = {
            to: `${newUser.email}`,
            from: 'noreply@zgmarket.com',
            subject: 'You have sucessfully registered ',
            text: 'hello',
            html: '<strong>Welecome to ZG Market ' + newUser.firstName + " " + newUser.lastName + ' </strong>',

        };
    }
    if (newUser.password.length < 8 || newUser.password.length > 64) {
        errors.password.push("Password needs a minimum of eight characters and a maximum length of at least 64 characters");
        colors.password = 'red'
    }
    if (commonPasswordList.test(newUser.password)) {
        errors.password.push("Your Passowrd has been previously hacked make you password unique");
        colors.password = 'red'
    }
    //need to and sequentail and repative check 
    if (newUser.password != newUser.password2) {
        errors.match = "Passwords do not match.";
        colors.password2 = 'red'
    }

    if (Object.keys(errors).length > 2 || errors.password.length > 0 || errors.email.length > 0) {
        res.render("register", {
            title: "Create A Account",
            pageheading: "Create an Account",
            errors: errors,
            color: colors,
            user: newUser

        })
    }
    try {

        const hashed = await new Promise((resolve, reject) => {
            bcrypt.hash(newUser.password, saltRounds, function (err, hash) {
                if (err) reject(err);
                resolve(hash);
            });
        });

        const user = new User({
            FirstName: newUser.firstName.toLowerCase(),
            LastName: newUser.lastName.toLowerCase(),
            Email: newUser.email.toLowerCase(),
            Password: hashed

        });

        const userSaved = await user.save();
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        await sgMail.send(msg);
    }
    catch (err) {
        console.log(err);
    }
    res.redirect("/");

});

router.get("/logout", (req,res)=>{
    req.session.destroy();
    res.redirect("/account/login");
})

module.exports = router;
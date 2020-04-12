
const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session');
//import your router objects
const accountRoutes = require("./routers/Account");
//const employeeRoutes = require("./routers/Employee");
//const productsRoutes = require("./routers/Shop");
//const userRoutes = require("./routers/User")



const app = express();

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));

//express static middleware
app.use(express.static("public"));


//Handlebars middlware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

/*
    This is to allow specific forms and/or links that were submitted/pressed
    to send PUT and DELETE request respectively!!!!!!!
*/
app.use((req, res, next) => {

    if (req.query.method == "PUT") {
        req.method = "PUT"
    }

    else if (req.query.method == "DELETE") {
        req.method = "DELETE"
    }

    next();
})

app.use(fileUpload());

/* app.use(session({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true
})) */

app.use((req, res, next) => {


    res.locals.user = req.session.userInfo;

    next();
})
//MAPs EXPRESS TO ALL OUR  ROUTER OBJECTS


//app.use("/",userRoutes);
app.use("/account",accountRoutes);
//app.use("/employee",employeeRoutes);
//app.use("/shop",productsRoutes);

app.get("/", (req, res) => {

    res.render("home", {
        title: 'Home Page'
    });


});

const PORT = process.env.PORT || 3000;
//Makes the app listen to port 3000
app.listen(PORT, () => console.log(`Server Connected`));
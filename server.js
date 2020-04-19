require('dotenv').config();
const express = require("express");
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session');
//import your router objects
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const accountRoutes = require("./routers/Account");
const employeeRoutes = require("./routers/Clerk");
const productsRoutes = require("./routers/Shop");
const userRoutes = require("./routers/User")

const app = express();

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));

//express static middleware
app.use(express.static("public"));


//Handlebars middlware
app.engine("handlebars", exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
}));
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

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use(session({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true
}))

app.use((req, res, next) => {


     res.locals.user = req.session.userInfo;

     next();
})

//MAPs EXPRESS TO ALL OUR  ROUTER OBJECTS


app.use("/",userRoutes);
app.use("/account", accountRoutes);
app.use("/clerk",employeeRoutes);
app.use("/shop",productsRoutes);

app.get("/", (req, res) => {

    res.render("home", {
        title: 'Home Page'
    });


});

const PORT = process.env.PORT || 8080;

const connect = async () => {
    try {
        await mongoose.connect(process.env.URI, {
            keepAlive: 1,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        mongoose.set('useFindAndModify', false);
    } catch (err) {
        console.log(err + "connect");
    }
};
connect();

//Makes the app listen to port 3000
app.listen(PORT, () => console.log(`Server Connected`));
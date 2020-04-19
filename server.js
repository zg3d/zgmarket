require('dotenv').config();
const express = require("express");
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Product = require("./models/Product");
const fileUpload = require('express-fileupload');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
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
    helpers: {
        select: function(selected, options) {
            return options.fn(this).replace(
                new RegExp(' value=\"' + selected + '\"'),
                '$& selected="selected"');
        },
        
    }
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
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 4320 * 60000}
}))

app.use((req, res, next) => {


     res.locals.user = req.session.userInfo;
     res.locals.session = req.session;

     next();
})

//MAPs EXPRESS TO ALL OUR  ROUTER OBJECTS



app.use("/",userRoutes);
app.use("/account", accountRoutes);
app.use("/clerk",employeeRoutes);
app.use("/shop",productsRoutes);




app.get("/", async (req, res) => {
    try{
    const Bestseller = await Product.find({Bestseller:true});
    res.render("home", {
        title: 'Home Page',
        Bestseller
        
    });
}
catch(err){
    console.log(err);
}


});

app.use(function(req, res, next){
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
      res.render('error', { url: req.url });
      return;
    }
  
    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
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
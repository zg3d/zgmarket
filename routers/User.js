
const express = require('express');
const path = require('path');
const Product = require("../models/Product");
const User = require("../models/Users");
const Cart = require("../models/Cart");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");
const admin = require("../middleware/author");



router.get("/add-to-cart/:id", isLoggedIn, async (req, res) => {
    let itemID = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    try{
    await Product.findById(itemID, function (err, product) {
        if (err) {
            return res.render("/", {
                title: "Home",
                pageHeader: "Home",
            });
        };
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart.items);
        res.redirect("/shop");
    });
}
catch(err){
    console.log(err);
}

});


router.get("/dashboard", isLoggedIn, admin);


router.get("/add/:id", (req, res)=>{
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.increaseByOne(productId);
    req.session.cart = cart;
    res.redirect("/checkout")
});


router.get("/sub/:id", (req, res)=>{
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect("/checkout")
});

router.get("/checkout", isLoggedIn, (req, res) => {
    if (!req.session.cart) {

        return res.render("cart", {
            products: null,
        });
    };
    let cart = new Cart(req.session.cart);
    console.log(cart.generateArray());
    res.render("cart", {
        title: "Checkout",
        pageHeader: "Checkout",
        products: cart.generateArray(),
        totalCost: cart.totalPrice,
    });
});

router.post("/SendCartEmail", isLoggedIn, async (req, res) => {
    const buyCart = new Cart(req.session.cart);
    let totalCost = buyCart.totalPrice;
    const arrOfItems = buyCart.generateArray();
    let items = "";
    for (let i = 0; i < buyCart.totalQty; i++) {
        items += `<div>${i + 1}: ${arrOfItems[i].item.Title}</div>`
    }
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    msg = {
        to: `${req.session.userInfo.Email}`,
        from: 'noreply@zgmarket.com',
        subject: 'Receipt From ZGMarket',
        text: `Hello ${req.session.userInfo.FirstName}`,
        html: `<div>Thank you for your Purchase of: ${items}</div> <p>Your Purchase Amount Was: ${totalCost}.</p>`,
    };
    await sgMail.send(msg)
    req.session.destroy();
    res.locals.session.destroy();
    res.redirect("/dashboard");
});


module.exports = router;
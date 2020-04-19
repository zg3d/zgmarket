const express = require('express')
const router = express.Router();
const Product = require("../models/Product");
const isLoggedIn = require("../middleware/auth");
const admin = require("../middleware/author");
const path = require('path');
router.get("/", async (req, res) => {
    try {
        const allItems = [];
     await Product.find({}, (err, docs) => {
            docs.forEach(item => {
                allItems.push(item);
            })
            console.log(req.session.userInfo.IsClerk);
            res.render("shop", {
                allItems,
                admin:!req.session.userInfo.IsClerk,
            });
        });
        
 
       

    } catch (err) {
        console.log(err);
    }
});

router.get("/:id", async (req, res) => {
    try {
       const item=  await Product.findById(req.params.id)
            

             
                res.render("itemdesc", {
                   item,
            
                });
           
    }
    catch (err) {
        console.log(err);
    }
});





module.exports = router;
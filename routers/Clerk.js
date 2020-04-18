const express = require('express');
const path = require('path');
const Product = require("../models/Product");
const router = express.Router();


router.use(express.static("public"));

router.get("/dashboard",(req,res)=>{
    res.render("clerkdashboard",{});
});


router.get("/addinventory",(req,res)=>{

    res.render("addanitem",{});

});

router.post("/addinventory", async (req,res)=>{
    const productToAdd = {
        ImagePath:"",
        Title: req.body.name,
        Description: req.body.desc,
        Price: req.body.price,
        Category: req.body.category,
        Quantity: req.body.qty,
    }
    try {

        const product = new Product(productToAdd);
        let productSave = await product.save();
        req.files.img.name = `p${productSave._id}${path.parse(req.files.img.name).ext}`
        req.files.img.mv(`public/image/products/${req.files.img.name}`);
       const uploadedProduct = await Product.updateOne({_id:productSave._id},{
            ImagePath:req.files.img.name,
        });
        res.redirect("/clerk/dashboard");
    } catch (err) {
        console.log(err);
        res.render("addanitem",{});
    }
   

});
module.exports = router;
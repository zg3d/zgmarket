const express = require('express');
const Handlebars = require('handlebars')
const Product = require("../models/Product");
const router = express.Router();
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');


router.use(express.static("public"));


router.get("/addinventory", (req, res) => {

    res.render("addanitem", {});

});




router.get("/shop", async (req, res) => {
    try {
        const allItems = [];
        await Product.find({}, (err, docs) => {
            docs.forEach(item => {
                allItems.push(item);
            })

            res.render("adminshop", {
                allItems,

            });
        });




    } catch (err) {
        console.log(err);
    }
});

router.post("/addinventory", async (req, res) => {
    const productToAdd = {
        ImagePath: "",
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

        console.log(req.files.img.tempFilePath);


        //configuring the AWS environment
        AWS.config.update({
            accessKeyId: process.env.AWSAccessKeyId,
            secretAccessKey: process.env.AWSSecretKey
        });

        let s3 = new AWS.S3();


        //configuring parameters
        let params = {
            Bucket: 'zgmarket',
            Body: fs.createReadStream(req.files.img.tempFilePath),
            Key: path.basename(req.files.img.tempFilePath)
        };

        s3.upload(params, async (err, data) => {
            //handle error
            if (err) {
                console.log("Error", err);
            }

            //success
            if (data) {
                console.log("Uploaded in:", data.Location);
                const uploadedProduct = await Product.updateOne({ _id: productSave._id }, {
                    ImagePath: data.Location,
                });
            }
        });


        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.render("addanitem", {});
    }


});


router.post("/update/:id", (req, res) => {
    const item = {
        Title: req.body.name,
        Description: req.body.desc,
        Price: req.body.price, 
        Bestseller:  req.body.bestseller,
        Quantity: req.body.qty,
        Category: req.body.category,
        DateLastModified:Date.now(),
    }
    console.log(item.Bestseller)
    if(item.Bestseller == "true"){
        item.Bestseller = true;
    } 
    else{
        item.Bestseller =false;
    }
    Product.updateOne({_id:req.params.id}, item)
    .then(() =>{
        res.redirect("/clerk/shop");
    })
    .catch(err => console.log(` ${err}`)) 
});

router.get("/:id", async (req, res) => {
    try {

        const item = await Product.findById(req.params.id)



        res.render("edititem", {
            item,
            
        });


    }
    catch (err) {
        console.log(err);
    }

});
module.exports = router;
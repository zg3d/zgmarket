const express = require('express');
const path = require('path');
const Product = require("../models/Product");
const router = express.Router();


router.use(express.static("public"));


router.get("/addinventory", (req, res) => {

    res.render("addanitem", {});

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


        const AWS = require('aws-sdk');
        const fs = require('fs');
        const path = require('path');

        //configuring the AWS environment
        AWS.config.update({
            accessKeyId: process.env.AWSAccessKeyId,
            secretAccessKey: process.env.AWSSecretKey
        });

        var s3 = new AWS.S3();
        

        //configuring parameters
        var params = {
            Bucket: 'zgmarket',
            Body: fs.createReadStream(req.files.img),
            Key: path.basename(req.files.img)
        };

        s3.upload(params, async (err, data)=> {
            //handle error
            if (err) {
                console.log("Error", err);
            }

            //success
            if (data) {
                console.log("Uploaded in:", data.Location);
                const uploadedProduct = await Product.updateOne({ _id: productSave._id }, {
                    ImagePath:  data.Location,
                });
            }
        });
      
        
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.render("addanitem", {});
    }


});
module.exports = router;
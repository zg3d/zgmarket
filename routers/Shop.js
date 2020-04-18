const express = require('express')
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req,res)=>{
    try{
        let allItems = [];
    await Product.find({},(err,docs)=>{
        docs.forEach(item =>{
            allItems.push(item);
        })
    });
    let all={};
    all.items = allItems;
    
    
    res.render("shop",{
        allItem : all.items
    });

}catch(err){
    console.log(err);
}
});

router.get("")


module.exports = router;
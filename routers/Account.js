const express = require('express')
const router = express.Router();
const userModel = require("../models/User");
const path = require("path");
const bcrypt = require("bcryptjs");
//const isAuthenticated = require("../middleware/auth");
//const dashBoardLoader = require("../middleware/authorization");

//Route to direct use to Registration form
router.get("/sign-up",(req,res)=>
{
    res.render("register");
});

router.post("/sign-up",(req,res)=>
{ 

 
 
});



module.exports=router;
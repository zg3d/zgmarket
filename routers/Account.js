const express = require('express')
const router = express.Router();
//const userModel = require("../models/Users");
const path = require("path");
const bcrypt = require("bcryptjs");
//const isAuthenticated = require("../middleware/auth");
//const dashBoardLoader = require("../middleware/authorization");

//Route to direct use to Registration form


router.post("/sign-up",(req,res)=>
{ 

    const newUser = 
    {
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        password:req.body.password
    }
 
});



module.exports=router;
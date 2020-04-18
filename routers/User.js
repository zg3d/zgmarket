

const express = require('express');
const path = require('path');
const Product = require("../models/Product");
const User = require("../models/Users");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");
const admin= require("../middleware/author");






router.get("/dashboard",isLoggedIn, admin );


module.exports = router;
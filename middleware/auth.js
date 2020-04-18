const isLoggedIn = (req,res,next)=>{

    if(req.session.userInfo)
    {
        next();
    }
    
    else
    {
        res.redirect("/account/login")
    }

}

module.exports = isLoggedIn;
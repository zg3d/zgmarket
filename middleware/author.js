const dashBoardLoader = (req,res)=>{

    if(req.session.userInfo.IsClerk)
    {
        res.render("clerkdashBoard");
    }
    
    else
    {
        res.render("dashboard");
    }

}

module.exports = dashBoardLoader;
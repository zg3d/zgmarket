const dashBoardLoader = (req,res)=>{

    if(req.session.userInfo.IsClerk)
    {
        res.render("clerkdashboard");
    }
    
    else
    {
        res.render("dashboard");
    }

}

module.exports = dashBoardLoader;
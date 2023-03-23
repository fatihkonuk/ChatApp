const User = require('../models/User');

const getHomePage = async (req,res) => {
    const user = await User.findById(req.session.userID);
    const users = await User.find();
    res.render('index', {
        user,
        users,
        page_name: 'chat'
    });
}

const getLoginPage = (req,res) => {
    res.render('login');
}

const getSignupPage = (req,res) => {
    res.render('signup');
}



module.exports = {
    getHomePage,
    getLoginPage,
    getSignupPage,
}
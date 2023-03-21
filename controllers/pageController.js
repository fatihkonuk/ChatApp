const User = require('../models/User');

const getHomePage = async (req,res) => {
    const user = await User.findById(req.session.userID);
    const users = await User.find();
    res.render('index', {
        user,
        users
    });
}

const getLoginPage = (req,res) => {
    res.render('login');
}

const getSignupPage = (req,res) => {
    res.render('signup');
}

const getProfilePage = async (req,res) => {
    const user = await User.findById(req.session.userID);
    res.render('profile', {
        user
    });
}

module.exports = {
    getHomePage,
    getLoginPage,
    getSignupPage,
    getProfilePage
}
const bcrypt = require('bcrypt');
const User = require('../models/User');

const createUser = async (req,res) => {
    await User.create(req.session.verifyUser);
    res.status(200).redirect('/login');
}

const loginUser = async (req,res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username: username});
    if (user) {
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            req.session.userID = user._id;
            user.isOnline = true;
            user.save();
            res.status(200).redirect('/');
        }else {
            res.status(400).redirect('/login');
        } 
    }else {
        res.status(400).redirect('/login');
    }
}

const logoutUser = async (req,res) => {
    const user = await User.findById(req.session.userID);
    req.session.destroy(() => {
        user.isOnline = false;
        user.save();
        res.status(200).redirect('/login');
    })
}

const getVerifyPage = async (req,res) => {
    res.render('verify', {
        email: req.body.email
    });
}

const getProfilePage = async (req,res) => {
    const user = await User.findById(req.session.userID);
    res.render('profile', {
        user,
        page_name: 'profile'
    });
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getVerifyPage,
    getProfilePage,
}
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


// //! Deneme
// const {v4: uuidV4 } = require('uuid');
// const getVideoPage = (req,res) => {
//     res.redirect(`/video/${uuidV4()}`);
// }
// const getRoomPage = (req,res) => {
//     res.render('video', { roomId: req.params.room});
// }


module.exports = {
    getHomePage,
    getLoginPage,
    getSignupPage,
}
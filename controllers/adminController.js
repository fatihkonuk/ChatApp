const User = require('../models/User');
const Message = require('../models/Message');

const getDashboardPage = async (req,res) => {
    const user = await User.findById(req.session.userID);
    const users = await User.find();
    res.render('./admin/index', {
        user,
        users,
        page_name: 'dashboard'
    });
}

const getAllUsers = async (req,res) => {
    const user = await User.findById(req.session.userID);
    const users = await User.find();
    res.render('./admin/users', {
        user,
        users,
        page_name: 'dashboard'
    });
}

const updateUser = async (req,res) => {
    const user = await User.findById(req.body.user_id);
    if (user.name !== req.body.user_name || user.role !== req.body.role) {
        user.name = req.body.user_name;
        user.role = req.body.user_role;
        await user.save();
    }
    res.redirect('/admin/users');
}

const getAllMessages = async (req,res) => {
    const user = await User.findById(req.session.userID);
    const messages = await Message.find().sort('-sendAt');
    res.render('./admin/messages', {
        user,
        messages,
        page_name: 'dashboard'
    });
}

const deleteMessage = async (req,res) => {
    await Message.findByIdAndRemove(req.query.id);
    res.redirect('/admin/messages');
}


module.exports = {
    getDashboardPage,
    getAllUsers,
    getAllMessages,
    deleteMessage,
    updateUser,
}
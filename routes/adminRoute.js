const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/', adminController.getDashboardPage);
router.get('/users', adminController.getAllUsers);
router.put('/users', adminController.updateUser);
router.get('/messages', adminController.getAllMessages);
router.delete('/messages', adminController.deleteMessage);

module.exports = router;
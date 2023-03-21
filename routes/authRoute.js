const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const verifyMiddleware = require('../middlewares/verifyMiddleware');

const router = express.Router();

router.post('/verify', verifyMiddleware.sendCode, authController.getVerifyPage);
router.post('/signup', verifyMiddleware.checkCode, authController.createUser);
router.post('/login', authController.loginUser);
router.get('/logout', authMiddleware, authController.logoutUser);

module.exports = router;
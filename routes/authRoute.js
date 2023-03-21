const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', authController.createUser);
router.post('/login', authController.loginUser);
router.get('/logout', authMiddleware, authController.logoutUser);
router.get('/:slug', authController.getProfilePage);

module.exports = router;
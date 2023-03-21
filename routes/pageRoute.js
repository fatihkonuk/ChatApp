const express = require('express');
const pageController = require('../controllers/pageController');
const authMiddleware = require('../middlewares/authMiddleware');
const redirectMiddleware = require('../middlewares/redirectMiddleware');

const router = express.Router();

router.get('/', authMiddleware, pageController.getHomePage);
router.get('/login', redirectMiddleware, pageController.getLoginPage);
router.get('/signup', redirectMiddleware, pageController.getSignupPage);

module.exports = router;
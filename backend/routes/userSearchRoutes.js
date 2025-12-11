const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { searchUsers } = require('../controllers/userSearchController');

router.get('/', auth, searchUsers);

module.exports = router;

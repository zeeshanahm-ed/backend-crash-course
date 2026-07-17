const express = require('express');
const authenticationToken = require('../middleware/authentication');
const user = require('../models/user');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await user.find({});
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users' });
    }
});

module.exports = router;
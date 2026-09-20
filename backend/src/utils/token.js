const jwt = require('jsonwebtoken');
const { env } = require('../config/env.js');

const signToken = (payload) => jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);

module.exports = { signToken, verifyToken };

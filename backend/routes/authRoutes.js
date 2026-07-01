const express = require('express');

const router = express.Router();

router.get('/', (_request, response) => {
  response.json({ routes: ['/api/auth/signup', '/api/auth/signin', '/api/auth/me', '/api/auth/forgot-password'] });
});

module.exports = router;

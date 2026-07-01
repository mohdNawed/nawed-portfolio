const express = require('express');

const router = express.Router();

router.get('/', (_request, response) => {
  response.json({ routes: ['/api/contact', '/api/hire', '/api/admin/messages'] });
});

module.exports = router;

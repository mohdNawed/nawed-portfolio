const express = require('express');

const router = express.Router();

router.get('/', (_request, response) => {
  response.json({
    success: true,
    source: 'src/data/projects.js',
    note: 'Project data is currently bundled with the frontend portfolio.',
  });
});

module.exports = router;

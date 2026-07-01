const express = require('express');

const router = express.Router();

router.get('/', (_request, response) => {
  response.json({
    success: true,
    source: 'src/data/projects.js',
    note: 'Skill data is currently bundled with the frontend portfolio.',
  });
});

module.exports = router;

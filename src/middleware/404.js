'use strict';

module.exports = (req, res) => {
  res.status(404);
  res.statusMessage = 'Not Found';
  res.json({ error: 'Not Found' });
};
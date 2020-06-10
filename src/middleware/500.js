'use strict';

module.exports = ( (err, req, res, next) => {
  res.status(500);
  res.statusMessage = `Internal Server Error`;
  res.json({error: err});
});
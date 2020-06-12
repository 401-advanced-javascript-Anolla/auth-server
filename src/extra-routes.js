'use strict';

const bearerMiddleware = require('../src/auth/middleware/bearer');
const router = require('./auth/router');

router.get('/secret', bearerMiddleware, (req,res) => {

  res.json(req.user);

} );

module.exports = router;

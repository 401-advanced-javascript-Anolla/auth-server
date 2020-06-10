'use strict';

const bearerMiddleware = require('../src/auth/middleware/bearer');
const permissions =require('./auth/middleware/acl');
const router = require('./auth/router');

router.get('/secret', bearerMiddleware, (req,res) => {

  res.json(req.user);

} );

router.get('/read', bearerMiddleware, permissions('read'),(req, res) => {
  res.send('Route /read worked');
});

router.post('/create', bearerMiddleware, permissions('create'),(req, res) => {
  res.send('Route /add worked');
});

router.put('/change', bearerMiddleware, permissions('change'),(req, res) => {
  res.send('Route /change worked');
});

router.delete('/remove', bearerMiddleware, permissions('remove'),(req, res) => {
  res.send('Route /remove worked');
});

module.exports = router;

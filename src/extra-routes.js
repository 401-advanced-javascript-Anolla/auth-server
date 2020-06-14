'use strict';

const bearerMiddleware = require('../src/auth/middleware/bearer');
const permissions =require('./auth/middleware/acl');
const router = require('./auth/router');
// const users = require('./auth/models/users/users-model');

router.get('/secret', bearerMiddleware, (req,res) => {
  res.json(req.user);

} );

router.get('/read', bearerMiddleware, permissions('read'),(req, res) => {
  res.send('Route /read worked');
});

router.post('/add', bearerMiddleware, permissions('create'),(req, res) => {
  res.send('Route /add worked');
});

router.put('/change', bearerMiddleware, permissions('update'),(req, res) => {
  res.send('Route /change worked');
});

router.delete('/remove', bearerMiddleware, permissions('delete'),(req, res) => {
  res.send('Route /remove worked');
});

module.exports = router;

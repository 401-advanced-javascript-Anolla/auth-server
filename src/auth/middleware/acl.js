'use strict';

// req.user =?
// module.exports = (req, res, next) => {};
module.exports = (capability) => {
// capability == "create" || 'update' || 'delete
  return (req, res, next) => {
    // we are expecting the bearerAuth middleware to add the user on the req
    // we need to find the user capabilities
    // req.user.capabilities = Array
    // ['read'] || ['read', 'create', 'update'] || ['read', 'create', 'update', 'delete']
    try {
      console.log('aaaaccccllll',req.user);
      if (req.user.acl.capabilities.includes(capability)) {
        next();
      } else {
        next('Access Denied!!');
      }
    } catch (e) {
      next('Invalid acl Login');
    }
  };
};
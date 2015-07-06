var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.json(req.user._id);
  //res.send('display name = ' + req.user.displayName);
});

module.exports = router;

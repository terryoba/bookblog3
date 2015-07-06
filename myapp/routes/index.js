var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Terry' });
  console.log('Example app listening at testing');
});

router.get('/hello/', function(req, res, next) {
  next();
});

router.get('/hello/222/*/123/*/:message', function(req, res, next) {
  var m = req.params[1];
  var m1 = req.params.message;
  var m2 = req.query.name;
  var m3 = req.query.ppp;

  res.render('index', { title: m + " " + m3 });
});

module.exports = router;

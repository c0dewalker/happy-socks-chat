var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('auth/login')
});

/* GET users listing. */
router.get('/impressum', function (req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/about', function (req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;

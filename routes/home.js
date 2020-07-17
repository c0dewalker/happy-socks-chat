var express = require('express');
var router = express.Router();

// router.get('/', function (req, res, next) {
//   res.sendFile(__dirname.slice(0, __dirname.lastIndexOf('/')) + '/public/html/index.html')
//   // res.render('index', { title: 'Happy Socks Chat' });
// });

router.get('/chat', (req, res, next) => {
  console.log(req.query.params)
  res.sendFile(__dirname.slice(0, __dirname.lastIndexOf('/')) + '/public/html/chat.html')
});

module.exports = router;

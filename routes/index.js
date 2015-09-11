var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'New JobQ' });
});

/* GET worker */
router.get('/work', function(req, res, next) {
  res.render('worker', { title: 'Worker' });
  MainFn();
});

module.exports = router;

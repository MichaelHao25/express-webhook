var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('资源正在构建中....请稍后再试...')
});

module.exports = router;

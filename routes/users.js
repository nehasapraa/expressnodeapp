var express = require('express');
var router = express.Router();

/* GET users listing. */
//router.get('/', function(req, res, next) {
    // res.render('index', { title: 'me' });
 // res.send('respond with a resource');
//});
router.get('/ab*cd', function(req, res) {
  res.send('ab*cd');
  
});
module.exports = router;

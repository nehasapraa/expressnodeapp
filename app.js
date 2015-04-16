var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var csfreferrer = require('./routes/csfreferrer');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/csfreferrer', csfreferrer);

app.use(function(req, res, next) {
  next();
});
 


app.post('/csfreferrer', function(req, res){
    
    var dst = req.body.url;
    var login = req.body.login;
    var expires = req.body.expires;
    var cred = { accessKeyId: req.body.accessKeyId, secretAccessKey: req.body.secretAccessKey };
    
    var datenow = validateExpiration(expires);
    var generatedUrl = generate(dst, login, expires, cred);
   
    res.render('csfreferrer', { title:'Web App', dst: req.body.url, login: req.body.login, expires: req.body.expires, accesskey: req.body.accessKeyId, secretaccesskey: req.body.secretAccessKey, generatedUrl: generatedUrl, errMsg:datenow});
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}




var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;
console.log('Example app listening at http://%s:%s', host, port);

   
});



// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;


//1/ After submitting, re-populate the fields with the previous submission. This will allow the user to do a few tests by changing just one field like timestamp or user login.
//2/ Place a big red warning near the secret key and advise the user they should not be using a live key for testing their algorithm.
//3/ If the expiry is in the past, warn the user. If the expiration is more than 6 hours into the future, warn the user that the expiration will be truncated to 6 hours.
//4/ Include a link to the documentation page: http://complispace.github.io/ReferredSignIn.html
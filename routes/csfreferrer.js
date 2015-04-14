var express = require('express');
var router = express.Router();




router.get('/', function(req, res, next) {
  res.render('csfreferrer', { title: 'ME' });
});
(function() {
    var url = require('url');
    var crypto = require('crypto');
    var querystring = require('querystring');
    var util = require('util');
 
    generate = function(aUrl, aReferredUserLogin, aReferredExpires, credentials) {
	//parse the url into its components
	var uriObject = url.parse(aUrl);
        console.log("pagal main tujhko " +credentials);
	//Caluclate the string to sign
	var stringToSign = util.format("%s:%s:%s", aReferredUserLogin, aReferredExpires, credentials.accessKeyId);
 
	//Calculate the signature
	var hmac = crypto.createHmac('sha256', credentials.secretAccessKey);
	hmac.update(stringToSign);
	var signature = Buffer(hmac.digest('hex')).toString('base64');
 
	//Extract the query parameters that may already exist
	var query = querystring.parse(uriObject.query);
 
	//Update the query parameters with referred sign in parameters
	query = {
	    referredUserLogin:aReferredUserLogin,
	    referredExpires:aReferredExpires,
	    referredAccessKeyId:credentials.accessKeyId,
	    referredSignature:signature
	};
 
	//Put the query back into our object ('search' parameter overides 'query' parameter: http://nodejs.org/api/url.html#url_url_format_urlobj)
	uriObject.search = querystring.stringify(query);
 
	//Recomompose the url and return it
	return url.format(uriObject);    
    }
})();



    



module.exports = router;

